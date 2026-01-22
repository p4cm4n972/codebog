"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { databases } from '@/lib/appwrite/client';
import { Query, ID } from 'appwrite';
import ReactMarkdown from 'react-markdown';
import dynamic from 'next/dynamic';
import UnlockModal from '@/components/UnlockModal';

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#1e1e1e] flex items-center justify-center text-gray-400">
      Chargement de l&apos;éditeur...
    </div>
  ),
});

interface Level {
    $id: string;
    slug: string;
    worldSlug: string;
    title: string;
    statement: string;
    starterCode: string;
    testCode: string;
    order: number;
    xpReward: number;
    difficulty: string;
}

interface World {
    $id: string;
    slug: string;
    name: string;
    icon: string;
    color: string;
}

interface Submission {
    code: string;
    passed: boolean;
    submittedAt: string;
}

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const JS_LEVELS_COLLECTION = 'js-levels';
const JS_WORLDS_COLLECTION = 'js-worlds';
const JS_SUBMISSIONS_COLLECTION = 'js-submissions';

const COLOR_CLASSES: Record<string, { border: string; text: string; bg: string }> = {
    green: { border: 'border-green-500', text: 'text-green-400', bg: 'bg-green-600' },
    purple: { border: 'border-purple-500', text: 'text-purple-400', bg: 'bg-purple-600' },
    orange: { border: 'border-orange-500', text: 'text-orange-400', bg: 'bg-orange-600' },
    cyan: { border: 'border-cyan-500', text: 'text-cyan-400', bg: 'bg-cyan-600' },
    yellow: { border: 'border-yellow-500', text: 'text-yellow-400', bg: 'bg-yellow-600' },
    pink: { border: 'border-pink-500', text: 'text-pink-400', bg: 'bg-pink-600' },
    red: { border: 'border-red-500', text: 'text-red-400', bg: 'bg-red-600' },
    amber: { border: 'border-amber-500', text: 'text-amber-400', bg: 'bg-amber-500' },
};

export default function LevelDetailPage() {
    const { user, isLoading, getJWT } = useAuth();
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;

    const [level, setLevel] = useState<Level | null>(null);
    const [world, setWorld] = useState<World | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [accessDenied, setAccessDenied] = useState(false);
    const [accessReason, setAccessReason] = useState('');
    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const [levelTitle, setLevelTitle] = useState('');
    const [userCode, setUserCode] = useState('');
    const [hasExistingSubmission, setHasExistingSubmission] = useState(false);
    const [lastSubmissionPassed, setLastSubmissionPassed] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{
        success: boolean;
        message: string;
        results?: {
            passed: boolean;
            totalTests: number;
            passedTests: number;
            failedTests: number;
            output?: string;
            error?: string;
        };
    } | null>(null);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [isLoading, user, router]);

    useEffect(() => {
        const fetchLevelAndSubmission = async () => {
            if (!user || !slug) return;

            try {
                setLoading(true);
                setError('');
                setAccessDenied(false);

                // Get JWT and check access first
                const jwt = await getJWT();
                if (jwt) {
                    const accessResponse = await fetch('/api/access/js-level', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${jwt}`,
                        },
                        body: JSON.stringify({ levelSlug: slug }),
                    });

                    const accessData = await accessResponse.json();

                    if (!accessData.hasAccess) {
                        // Fetch level title for the unlock modal
                        try {
                            const levelInfoResponse = await databases.listDocuments(DATABASE_ID, JS_LEVELS_COLLECTION, [
                                Query.equal('slug', slug),
                                Query.limit(1)
                            ]);
                            if (levelInfoResponse.documents.length > 0) {
                                const levelInfo = levelInfoResponse.documents[0];
                                setLevelTitle(levelInfo.title as string);
                            }
                        } catch {
                            // Ignore errors fetching level title
                        }
                        setAccessDenied(true);
                        setAccessReason(accessData.reason || 'Ce niveau est verrouillé');
                        setLoading(false);
                        return;
                    }
                }

                // Fetch level
                const levelResponse = await databases.listDocuments(DATABASE_ID, JS_LEVELS_COLLECTION, [
                    Query.equal('slug', slug),
                    Query.limit(1)
                ]);

                if (levelResponse.documents.length === 0) {
                    setError('Niveau non trouvé');
                    return;
                }

                const levelData = levelResponse.documents[0] as unknown as Level;
                setLevel(levelData);

                // Fetch world and submission in parallel
                const [worldResponse, submissionResponse] = await Promise.all([
                    databases.listDocuments(DATABASE_ID, JS_WORLDS_COLLECTION, [
                        Query.equal('slug', levelData.worldSlug),
                        Query.limit(1)
                    ]),
                    databases.listDocuments(DATABASE_ID, JS_SUBMISSIONS_COLLECTION, [
                        Query.equal('userId', user.$id),
                        Query.equal('exerciseSlug', slug),
                        Query.orderDesc('submittedAt'),
                        Query.limit(1)
                    ]).catch(() => ({ documents: [] }))
                ]);

                if (worldResponse.documents.length > 0) {
                    setWorld(worldResponse.documents[0] as unknown as World);
                }

                // Check for previous submission
                if (submissionResponse.documents.length > 0) {
                    const lastSubmission = submissionResponse.documents[0] as unknown as Submission;
                    setUserCode(lastSubmission.code);
                    setHasExistingSubmission(true);
                    setLastSubmissionPassed(lastSubmission.passed);
                } else {
                    setUserCode(levelData.starterCode || '// Écris ton code ici\n');
                    setHasExistingSubmission(false);
                    setLastSubmissionPassed(false);
                }
            } catch (err) {
                console.error('Failed to fetch level:', err);
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Échec du chargement');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchLevelAndSubmission();
    }, [user, slug, getJWT]);

    const handleSubmit = async () => {
        if (!user || !level) return;

        setSubmitting(true);
        setSubmitResult(null);

        try {
            // Get JWT for authenticated API call
            const jwt = await getJWT();
            if (!jwt) {
                setSubmitResult({
                    success: false,
                    message: 'Session expirée. Veuillez vous reconnecter.',
                });
                return;
            }

            // Execute code and run tests
            const executeResponse = await fetch('/api/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`,
                },
                body: JSON.stringify({
                    code: userCode,
                    exerciseSlug: level.slug,
                    testCode: level.testCode,
                }),
            });

            const executeData = await executeResponse.json();

            // Handle access denied
            if (executeResponse.status === 403) {
                setSubmitResult({
                    success: false,
                    message: `Accès refusé: ${executeData.reason || 'Ce niveau est verrouillé'}`,
                });
                return;
            }

            if (!executeData.success) {
                setSubmitResult({
                    success: false,
                    message: 'Échec des tests',
                    results: executeData.results,
                });
                return;
            }

            // Save submission to Appwrite
            await databases.createDocument(
                DATABASE_ID,
                JS_SUBMISSIONS_COLLECTION,
                ID.unique(),
                {
                    userId: user.$id,
                    exerciseId: level.$id,
                    exerciseSlug: level.slug,
                    worldSlug: level.worldSlug,
                    code: userCode,
                    submittedAt: new Date().toISOString(),
                    passed: executeData.results.passed,
                    testResults: JSON.stringify(executeData.results),
                    xpEarned: executeData.results.passed ? level.xpReward : 0,
                }
            );

            setLastSubmissionPassed(executeData.results.passed);
            setHasExistingSubmission(true);

            setSubmitResult({
                success: true,
                message: executeData.results.passed
                    ? `✅ Niveau complété ! +${level.xpReward} XP`
                    : '❌ Certains tests ont échoué',
                results: executeData.results,
            });
        } catch (err) {
            console.error('Submission failed:', err);
            setSubmitResult({
                success: false,
                message: err instanceof Error ? err.message : 'Erreur lors de la soumission',
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading || !user) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0f0a] font-mono text-green-400">
                <svg className="animate-spin h-10 w-10 mb-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p>Chargement...</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0f0a] font-mono text-green-400">
                <svg className="animate-spin h-10 w-10 mb-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p>Chargement du niveau...</p>
            </div>
        );
    }

    if (accessDenied) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0f0a] font-mono text-white p-4">
                <div className="text-center border-4 border-yellow-500 bg-yellow-500/10 rounded-lg p-8 max-w-md">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-yellow-400 mb-4">NIVEAU VERROUILLÉ</h2>
                    <p className="text-yellow-200 mb-6">{accessReason}</p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => setShowUnlockModal(true)}
                            className="px-6 py-3 bg-purple-600 text-white font-bold border-4 border-black rounded hover:bg-purple-500 transition-colors flex items-center justify-center gap-2"
                        >
                            💎 DÉBLOQUER AVEC GEMMES
                        </button>
                        <Link
                            href="/jsbog"
                            className="inline-block px-6 py-3 bg-green-500 text-black font-bold border-4 border-black rounded hover:bg-green-400 transition-colors"
                        >
                            RETOUR À LA CARTE
                        </Link>
                    </div>
                </div>
                <UnlockModal
                    isOpen={showUnlockModal}
                    onClose={() => setShowUnlockModal(false)}
                    exerciseSlug={slug}
                    exerciseType="js"
                    exerciseTitle={levelTitle || slug}
                    onUnlocked={() => {
                        setShowUnlockModal(false);
                        window.location.reload();
                    }}
                />
            </div>
        );
    }

    if (error || !level) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0f0a] font-mono text-white p-4">
                <div className="text-center text-red-500 border-4 border-red-500 rounded-lg p-8">
                    <h2 className="text-3xl font-bold mb-4">ERREUR</h2>
                    <p>{error || 'Niveau non trouvé'}</p>
                    <Link
                        href="/jsbog"
                        className="inline-block mt-6 px-6 py-3 bg-green-500 text-black font-bold border-4 border-black rounded hover:bg-green-400"
                    >
                        RETOUR À LA CARTE
                    </Link>
                </div>
            </div>
        );
    }

    const colors = world ? COLOR_CLASSES[world.color] || COLOR_CLASSES.green : COLOR_CLASSES.green;

    return (
        <div className="min-h-screen bg-[#0a0f0a] text-white p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href={world ? `/jsbog/world/${world.slug}` : '/jsbog'}
                        className={`inline-flex items-center gap-2 mb-4 px-4 py-2 ${colors.bg} text-white font-mono font-bold border-4 border-black rounded hover:opacity-90 transition-opacity`}
                    >
                        ← {world ? world.name : 'Retour'}
                    </Link>

                    <div className="flex items-center gap-4">
                        {world && (
                            <div className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center`}>
                                <span className="text-2xl">{world.icon}</span>
                            </div>
                        )}
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white font-mono">
                                {level.title}
                            </h1>
                            <div className="flex items-center gap-3 mt-1">
                                <span className={`${colors.text} font-mono text-sm`}>
                                    Niveau {level.order}
                                </span>
                                <span className="text-yellow-400 text-sm">+{level.xpReward} XP</span>
                                {lastSubmissionPassed && (
                                    <span className="text-green-400 text-sm flex items-center gap-1">
                                        <span>✓</span> Complété
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Instructions - Left */}
                    <div className={`lg:col-span-4 bg-[#1a2e1a] border-4 ${colors.border} rounded-lg p-4 md:p-6 overflow-y-auto max-h-[calc(100vh-220px)]`}>
                        <h2 className={`text-xl font-bold ${colors.text} mb-4 font-mono`}>Instructions</h2>
                        <div className="prose prose-invert prose-green max-w-none text-sm">
                            <ReactMarkdown>{level.statement}</ReactMarkdown>
                        </div>
                    </div>

                    {/* Editor - Right */}
                    <div className="lg:col-span-8 flex flex-col gap-4">
                        {/* Monaco Editor */}
                        <div className="bg-[#1e1e1e] border-4 border-black rounded-lg overflow-hidden flex-1 min-h-[400px]">
                            <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between">
                                <span className="text-gray-400 font-mono text-sm">index.js</span>
                                {hasExistingSubmission && (
                                    <span className={`text-xs px-2 py-1 rounded ${lastSubmissionPassed ? 'bg-green-600' : 'bg-yellow-600'}`}>
                                        {lastSubmissionPassed ? 'Réussi' : 'En cours'}
                                    </span>
                                )}
                            </div>
                            <Editor
                                height="400px"
                                defaultLanguage="javascript"
                                value={userCode}
                                onChange={(value) => setUserCode(value || '')}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    lineNumbers: 'on',
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    tabSize: 2,
                                    wordWrap: 'on',
                                }}
                            />
                        </div>

                        {/* Submit Button & Results */}
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className={`
                                    w-full py-4 font-bold font-mono text-lg
                                    ${colors.bg} text-white
                                    border-4 border-black rounded-lg
                                    shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                                    hover:translate-x-1 hover:translate-y-1 hover:shadow-none
                                    transition-all duration-150
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                `}
                            >
                                {submitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Exécution...
                                    </span>
                                ) : (
                                    'SOUMETTRE'
                                )}
                            </button>

                            {/* Results */}
                            {submitResult && (
                                <div className={`
                                    p-4 rounded-lg border-4
                                    ${submitResult.results?.passed
                                        ? 'bg-green-900/30 border-green-500'
                                        : 'bg-red-900/30 border-red-500'
                                    }
                                `}>
                                    <div className="font-bold text-lg mb-2">{submitResult.message}</div>
                                    {submitResult.results && (
                                        <div className="text-sm space-y-1">
                                            <div>Tests: {submitResult.results.passedTests}/{submitResult.results.totalTests} réussis</div>
                                            {submitResult.results.output && (
                                                <pre className="mt-2 p-2 bg-black/50 rounded text-xs overflow-x-auto">
                                                    {submitResult.results.output}
                                                </pre>
                                            )}
                                            {submitResult.results.error && (
                                                <pre className="mt-2 p-2 bg-red-900/50 rounded text-xs text-red-300 overflow-x-auto">
                                                    {submitResult.results.error}
                                                </pre>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
