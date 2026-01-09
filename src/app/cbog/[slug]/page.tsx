"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { databases } from '@/lib/appwrite/client';
import { Query, ID } from 'appwrite';
import ReactMarkdown from 'react-markdown';
import Editor from '@monaco-editor/react';

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
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [exercise, setExercise] = useState<CExercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userCode, setUserCode] = useState('');
  const [hasExistingSubmission, setHasExistingSubmission] = useState(false);
  const [lastSubmissionPassed, setLastSubmissionPassed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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

        // Fetch exercise and user's last submission in parallel
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
          setError('Exercise not found');
          return;
        }

        const exerciseData = exerciseResponse.documents[0] as unknown as CExercise;
        setExercise(exerciseData);

        // Check if user has a previous submission
        if (submissionsResponse.documents.length > 0) {
          const lastSubmission = submissionsResponse.documents[0] as unknown as Submission;
          setUserCode(lastSubmission.code);
          setHasExistingSubmission(true);
          setLastSubmissionPassed(lastSubmission.passed);
        } else {
          setUserCode(exerciseData.starterCode || '// Écrivez votre code C ici\n');
          setHasExistingSubmission(false);
          setLastSubmissionPassed(false);
        }
      } catch (err: unknown) {
        console.error('Failed to fetch exercise:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to load exercise');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseAndSubmission();
  }, [user, slug]);

  const handleSubmit = async () => {
    if (!user || !exercise) return;

    setSubmitting(true);
    setSubmitResult(null);

    try {
      // Execute code and run tests
      const executeResponse = await fetch('/api/execute-c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: userCode,
          exerciseSlug: exercise.slug,
          testCode: exercise.testCode,
        }),
      });

      const executeData = await executeResponse.json();

      // Save submission to Appwrite with test results
      await databases.createDocument(
        DATABASE_ID,
        C_SUBMISSIONS_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          exerciseId: exercise.$id,
          exerciseSlug: exercise.slug,
          code: userCode,
          submittedAt: new Date().toISOString(),
          passed: executeData.results?.passed || false,
          compiled: executeData.results?.compiled || false,
          compileError: executeData.results?.compileError || '',
          testResults: JSON.stringify(executeData.results || {}),
        }
      );

      if (!executeData.success) {
        setSubmitResult({
          success: false,
          message: executeData.results?.compiled === false ? 'Erreur de compilation' : 'Échec des tests',
          results: executeData.results,
        });
      } else {
        setSubmitResult({
          success: true,
          message: executeData.results.passed ? '✅ Tous les tests sont passés !' : '❌ Certains tests ont échoué',
          results: executeData.results,
        });
        if (executeData.results.passed) {
          setLastSubmissionPassed(true);
          setHasExistingSubmission(true);
        }
      }
    } catch (err: unknown) {
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0f0a] font-mono text-white">
        <p>Loading session...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0f0a] font-mono text-blue-400">
        <svg className="animate-spin h-10 w-10 mb-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p>Chargement de la mission...</p>
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0f0a] font-mono text-white p-4">
        <div className="text-center text-red-500 border-4 border-red-500 p-8">
          <h2 className="text-3xl font-bold mb-4">ERREUR</h2>
          <p>{error || 'Exercise not found'}</p>
          <button
            onClick={() => router.push('/cbog')}
            className="mt-6 px-6 py-3 bg-blue-500 text-black font-bold border-4 border-black hover:bg-blue-400"
          >
            RETOUR AUX MISSIONS
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/cbog')}
            className="mb-4 px-4 py-2 bg-blue-500 text-black font-mono font-bold border-4 border-black hover:bg-blue-400 transition-colors"
          >
            ← RETOUR
          </button>
          <h1 className="text-4xl font-bold text-cyan-400 font-mono">
            {exercise.title}
          </h1>
          <div className="flex gap-4 mt-2">
            <span className="text-blue-400 font-mono">/{exercise.slug}</span>
            <span className="text-gray-500 font-mono">{exercise.week} / {exercise.day}</span>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Instructions Section - Left */}
          <div className="lg:col-span-4 bg-black border-4 border-blue-500 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-200px)]">
            <div className="prose prose-invert prose-blue max-w-none font-mono">
              <ReactMarkdown
                components={{
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold text-cyan-400 mb-4 mt-6">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-bold text-blue-400 mb-3 mt-4">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-blue-300 mb-4 leading-relaxed">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside text-blue-300 mb-4 space-y-2">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside text-blue-300 mb-4 space-y-2">{children}</ol>
                  ),
                  code: ({ className, children }) => {
                    const isBlock = className?.includes('language-');
                    if (isBlock) {
                      return (
                        <pre className="bg-black border-2 border-blue-700 p-4 rounded overflow-x-auto mb-4">
                          <code className="text-blue-400 text-sm">{children}</code>
                        </pre>
                      );
                    }
                    return (
                      <code className="bg-blue-900/30 text-cyan-400 px-2 py-1 rounded text-sm">
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

          {/* Code Editor Section - Right */}
          <div className="lg:col-span-8 bg-black border-4 border-cyan-400 p-6 md:p-8 flex flex-col max-h-[calc(100vh-200px)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-cyan-400 font-mono">CODE_EDITOR_C</h2>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              </div>
            </div>

            {/* Submission Status Banner */}
            {hasExistingSubmission && (
              <div className={`mb-4 p-3 border-2 rounded flex items-center justify-between ${lastSubmissionPassed ? 'border-blue-500 bg-blue-900/20' : 'border-yellow-500 bg-yellow-900/20'}`}>
                <div className="flex items-center gap-2">
                  {lastSubmissionPassed ? (
                    <>
                      <span className="text-blue-400 text-lg">✓</span>
                      <span className="text-blue-400 text-sm font-mono">Dernière solution validée</span>
                    </>
                  ) : (
                    <>
                      <span className="text-yellow-400 text-lg">⏳</span>
                      <span className="text-yellow-400 text-sm font-mono">Dernière tentative chargée</span>
                    </>
                  )}
                </div>
                <button
                  onClick={() => {
                    setUserCode(exercise?.starterCode || '// Écrivez votre code C ici\n');
                    setHasExistingSubmission(false);
                  }}
                  className="px-3 py-1 text-xs font-mono text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 rounded transition-colors"
                >
                  RESET
                </button>
              </div>
            )}

            {/* Monaco Editor */}
            <div className="flex-grow border-2 border-blue-700 rounded overflow-hidden">
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
                }}
              />
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full px-6 py-4 bg-[#3498db] text-black text-xl font-bold uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150 rounded-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    COMPILATION EN COURS...
                  </>
                ) : 'COMPILER & TESTER'}
              </button>
            </div>

            {/* Results - Inside Editor Section */}
            {submitResult && (
              <div className={`mt-4 p-4 border-2 ${submitResult.results?.passed ? 'border-blue-500 bg-blue-900/20' : submitResult.results?.compiled === false ? 'border-orange-500 bg-orange-900/20' : 'border-red-500 bg-red-900/20'} rounded`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-lg font-bold font-mono ${submitResult.results?.passed ? 'text-blue-400' : submitResult.results?.compiled === false ? 'text-orange-400' : 'text-red-400'}`}>
                    {submitResult.results?.compiled === false ? '⚠️ ERREUR DE COMPILATION' : submitResult.results?.passed ? '✅ MISSION RÉUSSIE' : '❌ MISSION ÉCHOUÉE'}
                  </h3>
                  <button
                    onClick={() => setSubmitResult(null)}
                    className="w-6 h-6 flex items-center justify-center text-lg text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {submitResult.results && (
                  <>
                    {submitResult.results.compileError && (
                      <div className="mb-3 p-3 bg-orange-900/30 border border-orange-700 rounded">
                        <p className="text-orange-400 font-mono text-xs whitespace-pre-wrap">
                          {submitResult.results.compileError}
                        </p>
                      </div>
                    )}

                    {submitResult.results.compiled !== false && (
                      <div className="flex gap-4 text-sm font-mono mb-3">
                        <span className="text-blue-400">
                          ✓ Réussis: {submitResult.results.passedTests}/{submitResult.results.totalTests}
                        </span>
                        {submitResult.results.failedTests > 0 && (
                          <span className="text-red-400">
                            ✗ Échoués: {submitResult.results.failedTests}
                          </span>
                        )}
                      </div>
                    )}

                    {submitResult.results.output && (
                      <div className="max-h-48 overflow-y-auto p-3 bg-black/50 border border-gray-700 rounded">
                        <div className="text-xs font-mono space-y-1">
                          {submitResult.results.output.split('\n').map((line, index) => {
                            const isPass = line.includes('✓') || line.includes('PASS');
                            const isFail = line.includes('✗') || line.includes('FAIL');
                            const colorClass = isPass
                              ? 'text-blue-400'
                              : isFail
                                ? 'text-red-400'
                                : 'text-gray-400';
                            return (
                              <div key={index} className={colorClass}>
                                {line}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {submitResult.results.error && (
                      <div className="mt-3 p-3 bg-red-900/30 border border-red-700 rounded">
                        <p className="text-red-400 font-mono text-xs whitespace-pre-wrap">
                          {submitResult.results.error}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
