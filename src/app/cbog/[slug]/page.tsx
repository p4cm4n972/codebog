"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { databases } from '@/lib/appwrite/client';
import { Query } from 'appwrite';
import ReactMarkdown from 'react-markdown';
import dynamic from 'next/dynamic';
import UnlockModal from '@/components/UnlockModal';

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#0a0a00] flex items-center justify-center text-green-700 font-mono text-sm">
      initialisation éditeur...
      <span className="inline-block w-1 h-4 bg-green-600 ml-1 animate-pulse" />
    </div>
  ),
});

function CExercisePageSkeleton() {
  return (
    <div className="min-h-screen bg-black font-mono text-green-400 p-4 md:p-8"
      style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.012) 2px, rgba(0,255,65,0.012) 4px)' }}>
      <div className="max-w-7xl mx-auto animate-pulse">
        <div className="mb-6">
          <div className="h-8 w-44 bg-green-900/30 rounded mb-3" />
          <div className="h-7 w-72 bg-green-900/20 rounded mb-2" />
          <div className="h-4 w-48 bg-green-900/10 rounded" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 border border-green-900 bg-black p-6">
            <div className="space-y-3">
              {[40, 100, 80, 60, 100, 70].map((w, i) => (
                <div key={i} className={`h-3 bg-green-900/20 rounded`} style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
          <div className="lg:col-span-8 border border-green-800 bg-black p-6 flex flex-col gap-4" style={{ minHeight: 400 }}>
            <div className="h-6 w-40 bg-green-900/30 rounded" />
            <div className="flex-1 bg-[#0a0a00] rounded" />
            <div className="h-14 bg-green-900/20 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface CExercise {
  $id: string;
  title: string;
  slug: string;
  week: string;
  day: string;
  statement: string;
  starterCode?: string;
  testCode?: string;
  solution?: string;
}

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const C_EXERCISES_COLLECTION_ID = 'c-exercises';
const C_SUBMISSIONS_COLLECTION_ID = 'c-submissions';

interface Submission {
  code: string;
  passed: boolean;
  submittedAt: string;
}

export default function CExerciseDetailPage() {
  const { user, isLoading, getJWT } = useAuth();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [exercise, setExercise] = useState<CExercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userCode, setUserCode] = useState('');
  const [accessDenied, setAccessDenied] = useState(false);
  const [accessReason, setAccessReason] = useState('');
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [exerciseTitle, setExerciseTitle] = useState('');
  const [exerciseWeek, setExerciseWeek] = useState('');
  const [hasExistingSubmission, setHasExistingSubmission] = useState(false);
  const [lastSubmissionPassed, setLastSubmissionPassed] = useState(false);
  const [testing, setTesting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastTestPassed, setLastTestPassed] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
    results?: {
      compiled: boolean;
      passed: boolean;
      totalTests: number;
      passedTests: number;
      failedTests: number;
      output?: string;
      compileError?: string;
      error?: string;
    };
  } | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const fetchExerciseAndSubmission = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError('');
        setAccessDenied(false);

        const jwt = await getJWT();
        if (jwt) {
          const accessResponse = await fetch('/api/access/c-exercise', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwt}`,
            },
            body: JSON.stringify({ exerciseSlug: slug }),
          });

          const accessData = await accessResponse.json();

          if (!accessData.hasAccess) {
            try {
              const exerciseInfoResponse = await databases.listDocuments(DATABASE_ID, C_EXERCISES_COLLECTION_ID, [
                Query.equal('slug', slug),
                Query.limit(1)
              ]);
              if (exerciseInfoResponse.documents.length > 0) {
                const exerciseInfo = exerciseInfoResponse.documents[0];
                setExerciseTitle(exerciseInfo.title as string);
                setExerciseWeek(exerciseInfo.week as string);
              }
            } catch {
              // ignore
            }
            setAccessDenied(true);
            setAccessReason(accessData.reason || 'Cet exercice est verrouillé');
            setLoading(false);
            return;
          }
        }

        const [exerciseResponse, submissionsResponse] = await Promise.all([
          databases.listDocuments(DATABASE_ID, C_EXERCISES_COLLECTION_ID, [Query.equal('slug', slug)]),
          databases.listDocuments(DATABASE_ID, C_SUBMISSIONS_COLLECTION_ID, [
            Query.equal('userId', user.$id),
            Query.equal('exerciseSlug', slug),
            Query.orderDesc('submittedAt'),
            Query.limit(1),
          ]),
        ]);

        if (exerciseResponse.documents.length === 0) {
          setError('Exercice introuvable');
          return;
        }

        const exerciseData = exerciseResponse.documents[0] as unknown as CExercise;
        setExercise(exerciseData);

        if (submissionsResponse.documents.length > 0) {
          const lastSubmission = submissionsResponse.documents[0] as unknown as Submission;
          setUserCode(lastSubmission.code);
          setHasExistingSubmission(true);
          setLastSubmissionPassed(lastSubmission.passed);
        } else {
          setUserCode(exerciseData.starterCode || '/* Écrivez votre code C ici */\n');
          setHasExistingSubmission(false);
          setLastSubmissionPassed(false);
        }
      } catch (err: unknown) {
        console.error('Failed to fetch exercise:', err);
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseAndSubmission();
  }, [user, slug, getJWT]);

  const callSubmissionsApi = async (dryRun: boolean) => {
    const jwt = await getJWT();
    if (!jwt) throw new Error('ERR: authentification requise');

    const response = await fetch('/api/submissions/c', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        code: userCode,
        exerciseSlug: exercise!.slug,
        testCode: exercise!.testCode,
        dryRun,
      }),
    });

    return { data: await response.json(), status: response.status };
  };

  const handleTest = async () => {
    if (!user || !exercise) return;

    setTesting(true);
    setSubmitResult(null);
    setLastTestPassed(false);

    try {
      const { data, status } = await callSubmissionsApi(true);

      if (status === 403) {
        setSubmitResult({ success: false, message: `[403] ${data.reason || 'Accès refusé'}` });
        return;
      }
      if (status !== 200) {
        setSubmitResult({
          success: false,
          message: data.results?.compiled === false ? 'ERR: échec de compilation' : (data.error || 'ERR: exécution impossible'),
          results: data.results,
        });
        return;
      }

      const passed = data.results?.passed || false;
      setLastTestPassed(passed);
      setSubmitResult({
        success: passed,
        message: passed ? '[OK] Tests passés — prêt à soumettre' : '[FAIL] Certains tests ont échoué',
        results: data.results,
      });
    } catch (err: unknown) {
      setSubmitResult({ success: false, message: err instanceof Error ? err.message : 'ERR: exécution impossible' });
    } finally {
      setTesting(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !exercise) return;

    setSubmitting(true);
    setSubmitResult(null);

    try {
      const { data, status } = await callSubmissionsApi(false);

      if (status === 403) {
        setSubmitResult({ success: false, message: `[403] ${data.reason || 'Accès refusé'}` });
        return;
      }
      if (status !== 200) {
        setSubmitResult({
          success: false,
          message: data.results?.compiled === false ? 'ERR: échec de compilation' : (data.error || 'ERR: soumission impossible'),
          results: data.results,
        });
        return;
      }

      if (data.results?.passed) {
        setLastSubmissionPassed(true);
        setHasExistingSubmission(true);
        setLastTestPassed(false);
      }

      const xpMessage = data.submission?.isFirstCompletion ? ` +${data.submission.xpEarned} XP` : '';

      setSubmitResult({
        success: data.results?.passed || false,
        message: data.results?.passed
          ? `[OK] Soumission validée !${xpMessage}`
          : '[FAIL] Certains tests ont échoué',
        results: data.results,
      });
    } catch (err: unknown) {
      setSubmitResult({
        success: false,
        message: err instanceof Error ? err.message : 'ERR: soumission impossible',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || (user && loading)) return <CExercisePageSkeleton />;
  if (!user) return null;

  /* ── Access denied ── */
  if (accessDenied) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black font-mono text-green-400 p-4"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.012) 2px, rgba(0,255,65,0.012) 4px)' }}>
        <div className="border border-amber-700 bg-amber-950/10 p-8 max-w-md w-full">
          <p className="text-amber-600 text-xs mb-4">$ ./cbog/{slug}</p>
          <p className="text-amber-500 text-lg font-bold mb-2">[PERMISSION DENIED]</p>
          <p className="text-amber-700 text-sm mb-6">{accessReason}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShowUnlockModal(true)}
              className="w-full px-4 py-3 border border-purple-600 text-purple-400 text-sm hover:bg-purple-950/20 transition-colors"
            >
              💎 DÉBLOQUER AVEC GEMMES
            </button>
            <button
              onClick={() => router.push('/cbog')}
              className="w-full px-4 py-3 border border-green-800 text-green-700 text-sm hover:border-green-600 hover:text-green-400 transition-colors"
            >
              ◄ cd ../
            </button>
          </div>
        </div>
        <UnlockModal
          isOpen={showUnlockModal}
          onClose={() => setShowUnlockModal(false)}
          exerciseSlug={slug}
          exerciseType="c"
          exerciseTitle={exerciseTitle || slug}
          week={exerciseWeek}
          onUnlocked={() => { setShowUnlockModal(false); window.location.reload(); }}
        />
      </div>
    );
  }

  /* ── Error ── */
  if (error || !exercise) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black font-mono text-green-400 p-4">
        <div className="border border-red-700 bg-red-950/10 p-8 max-w-md w-full">
          <p className="text-red-400 font-bold mb-2">[ERREUR]</p>
          <p className="text-red-600 text-sm mb-6">{error || 'Exercice introuvable'}</p>
          <button
            onClick={() => router.push('/cbog')}
            className="px-4 py-2 border border-green-800 text-green-700 text-sm hover:border-green-600 hover:text-green-400 transition-colors"
          >
            ◄ cd ../
          </button>
        </div>
      </div>
    );
  }

  /* ── Main page ── */
  return (
    <div
      className="min-h-screen bg-black font-mono text-green-400 p-4 md:p-8"
      style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.012) 2px, rgba(0,255,65,0.012) 4px)' }}
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push(`/cbog/week/${exercise.week.toLowerCase()}`)}
            className="mb-4 text-green-700 hover:text-green-400 text-sm transition-colors"
          >
            ◄ cd ../{exercise.week.toLowerCase()}/
          </button>
          <h1 className="text-3xl font-bold text-green-300 tracking-wide">
            {exercise.title}
            <span className="inline-block w-0.5 h-7 bg-green-400 ml-2 align-middle animate-pulse" />
          </h1>
          <div className="flex gap-4 mt-1 text-xs text-green-700">
            <span>$ ./{exercise.slug}</span>
            <span>|</span>
            <span>{exercise.week} / {exercise.day}</span>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Instructions — left */}
          <div className="lg:col-span-4 border border-green-800 bg-black overflow-y-auto max-h-[calc(100vh-200px)]">
            {/* Terminal title bar */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-green-900 bg-green-950/10">
              <span className="w-2.5 h-2.5 rounded-full bg-red-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-700" />
              <span className="ml-2 text-xs text-green-700">README.md</span>
            </div>
            <div className="p-5 prose prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  h2: ({ children }) => (
                    <h2 className="text-base font-bold text-green-300 mb-3 mt-5 flex items-center gap-2">
                      <span className="text-green-700">##</span> {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm font-bold text-green-400 mb-2 mt-4 flex items-center gap-2">
                      <span className="text-green-700">###</span> {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-green-600 text-sm mb-3 leading-relaxed">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="text-green-600 text-sm mb-3 space-y-1 list-none pl-0">{children}</ul>
                  ),
                  li: ({ children }) => (
                    <li className="flex gap-2"><span className="text-green-800">▸</span><span>{children}</span></li>
                  ),
                  ol: ({ children }) => (
                    <ol className="text-green-600 text-sm mb-3 space-y-1 list-decimal list-inside">{children}</ol>
                  ),
                  code: ({ className, children }) => {
                    const isBlock = className?.includes('language-');
                    if (isBlock) {
                      return (
                        <pre className="bg-[#0a0a00] border border-green-900 p-3 overflow-x-auto mb-3 text-xs">
                          <code className="text-green-400">{children}</code>
                        </pre>
                      );
                    }
                    return (
                      <code className="bg-green-950/30 text-green-300 px-1.5 py-0.5 text-xs border border-green-900">
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {exercise.statement}
              </ReactMarkdown>
            </div>
          </div>

          {/* Editor — right */}
          <div className="lg:col-span-8 border border-green-700 bg-black flex flex-col max-h-[calc(100vh-200px)]">
            {/* Terminal title bar */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-green-800 bg-green-950/10 flex-shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-red-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-700" />
              <span className="ml-2 text-xs text-green-500 font-bold tracking-widest">
                {exercise.slug}.c
              </span>
            </div>

            {/* Submission status */}
            {hasExistingSubmission && (
              <div className={`px-4 py-2 border-b flex items-center justify-between text-xs flex-shrink-0 ${
                lastSubmissionPassed
                  ? 'border-green-800 bg-green-950/10 text-green-600'
                  : 'border-amber-900 bg-amber-950/10 text-amber-700'
              }`}>
                <span>
                  {lastSubmissionPassed ? '[OK] Dernière soumission validée' : '[WARN] Tentative précédente chargée'}
                </span>
                <button
                  onClick={() => {
                    setUserCode(exercise?.starterCode || '/* Écrivez votre code C ici */\n');
                    setHasExistingSubmission(false);
                  }}
                  className="text-green-800 hover:text-green-500 border border-green-900 hover:border-green-700 px-2 py-0.5 transition-colors"
                >
                  RESET
                </button>
              </div>
            )}

            {/* Monaco editor */}
            <div className="flex-grow overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage="c"
                value={userCode}
                onChange={(value) => setUserCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 4,
                  fontFamily: 'monospace',
                }}
              />
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-green-900 flex-shrink-0 flex gap-3">
              {/* Test button — dry run, no save */}
              <button
                onClick={handleTest}
                disabled={testing || submitting}
                className="flex-1 px-4 py-3 border border-green-700 text-green-600 text-xs font-bold tracking-widest uppercase hover:border-green-500 hover:text-green-400 hover:bg-green-950/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center gap-2"
              >
                {testing ? (
                  <>
                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    compilation...
                  </>
                ) : (
                  '$ ./run_tests'
                )}
              </button>

              {/* Submit button — only saves, enabled once tests pass */}
              <button
                onClick={handleSubmit}
                disabled={submitting || testing || !lastTestPassed}
                className={`flex-1 px-4 py-3 border-2 text-xs font-bold tracking-widest uppercase transition-all duration-150 flex items-center justify-center gap-2
                  ${lastTestPassed
                    ? 'border-green-500 text-green-400 hover:bg-green-950/30 hover:border-green-400 cursor-pointer'
                    : 'border-green-900 text-green-900 cursor-not-allowed'
                  }
                  disabled:opacity-40 disabled:cursor-not-allowed`}
                style={{ boxShadow: lastTestPassed && !submitting ? '0 0 8px rgba(74,222,128,0.2)' : 'none' }}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    envoi...
                  </>
                ) : (
                  lastTestPassed ? '[SOUMETTRE]' : '[SOUMETTRE]'
                )}
              </button>
            </div>

            {/* Results */}
            {submitResult && (
              <div className={`mx-4 mb-4 border p-4 flex-shrink-0 ${
                submitResult.results?.passed
                  ? 'border-green-600 bg-green-950/20'
                  : submitResult.results?.compiled === false
                    ? 'border-amber-700 bg-amber-950/10'
                    : 'border-red-800 bg-red-950/10'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm font-bold ${
                    submitResult.results?.passed ? 'text-green-400'
                      : submitResult.results?.compiled === false ? 'text-amber-400'
                      : 'text-red-400'
                  }`}>
                    {submitResult.message}
                  </span>
                  <button
                    onClick={() => setSubmitResult(null)}
                    className="text-green-800 hover:text-green-500 text-xs px-2 py-0.5 border border-green-900 hover:border-green-700 transition-colors"
                  >
                    [✕]
                  </button>
                </div>

                {submitResult.results?.compileError && (
                  <div className="mb-3 p-3 border border-amber-900 bg-black">
                    <p className="text-amber-600 text-xs whitespace-pre-wrap leading-relaxed">
                      {submitResult.results.compileError}
                    </p>
                  </div>
                )}

                {submitResult.results?.compiled !== false && (
                  <div className="flex gap-4 text-xs mb-3">
                    <span className="text-green-600">
                      [PASS] {submitResult.results?.passedTests}/{submitResult.results?.totalTests}
                    </span>
                    {(submitResult.results?.failedTests ?? 0) > 0 && (
                      <span className="text-red-600">
                        [FAIL] {submitResult.results?.failedTests}
                      </span>
                    )}
                  </div>
                )}

                {submitResult.results?.output && (
                  <div className="max-h-40 overflow-y-auto bg-black border border-green-900 p-3">
                    <div className="text-xs space-y-0.5">
                      {submitResult.results.output.split('\n').map((line, i) => {
                        const isPass = line.includes('✓') || line.includes('PASS');
                        const isFail = line.includes('✗') || line.includes('FAIL');
                        return (
                          <div key={i} className={
                            isPass ? 'text-green-500'
                              : isFail ? 'text-red-500'
                              : 'text-green-800'
                          }>
                            {line ? `> ${line}` : ''}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {submitResult.results?.error && (
                  <div className="mt-3 p-3 border border-red-900 bg-black">
                    <p className="text-red-600 text-xs whitespace-pre-wrap">{submitResult.results.error}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
