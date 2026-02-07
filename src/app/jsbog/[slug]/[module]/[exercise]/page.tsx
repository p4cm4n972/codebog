'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getSeasonBySlug, getModuleBySlug, SEASON_COLOR_CLASSES } from '@/lib/js-seasons-config';
import ReactMarkdown from 'react-markdown';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#1e1e1e] flex items-center justify-center text-gray-400 font-mono">
      Chargement de l&apos;éditeur...
    </div>
  ),
});

interface PiscineExercise {
  index: number;
  slug: string;
  title: string;
  statement: string;
  starterCode: string;
  testCode: string;
}

// Skeleton component
function ExercisePageSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-6">
          <div className="h-4 w-64 bg-gray-800 rounded animate-pulse mb-4" />
          <div className="h-8 w-80 bg-gray-700 rounded animate-pulse" />
        </div>

        {/* Two Column Layout skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 bg-black border-4 border-gray-700 p-6 rounded-lg animate-pulse">
            <div className="space-y-3">
              <div className="h-6 w-40 bg-gray-700 rounded" />
              <div className="h-4 w-full bg-gray-800 rounded" />
              <div className="h-4 w-5/6 bg-gray-800 rounded" />
              <div className="h-4 w-4/5 bg-gray-800 rounded" />
            </div>
          </div>
          <div className="lg:col-span-7 bg-black border-4 border-gray-700 p-6 rounded-lg animate-pulse">
            <div className="h-[400px] bg-[#1e1e1e] rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PiscineExercisePage() {
  const { user, isLoading: authLoading, getJWT } = useAuth();
  const router = useRouter();
  const params = useParams();

  const seasonSlug = params.slug as string;
  const moduleSlug = params.module as string;
  const exerciseSlug = params.exercise as string;

  const [exercise, setExercise] = useState<PiscineExercise | null>(null);
  const [nextExercise, setNextExercise] = useState<{ slug: string; title: string } | null>(null);
  const [prevExercise, setPrevExercise] = useState<{ slug: string; title: string } | null>(null);
  const [userCode, setUserCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [testing, setTesting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    isSubmission: boolean;
    results?: {
      passed: boolean;
      totalTests: number;
      passedTests: number;
      failedTests: number;
      output?: string;
      error?: string;
    };
  } | null>(null);

  // Get season and module info
  const season = getSeasonBySlug(seasonSlug);
  const jsModule = getModuleBySlug(seasonSlug, moduleSlug);
  const colors = season ? SEASON_COLOR_CLASSES[season.slug as keyof typeof SEASON_COLOR_CLASSES] : null;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    const loadExercise = async () => {
      if (!user || !seasonSlug || !moduleSlug || !exerciseSlug) return;

      try {
        setLoading(true);
        setError('');

        // Obtenir le JWT pour l'authentification
        const jwt = await getJWT();
        if (!jwt) {
          setError('Authentication required');
          setLoading(false);
          return;
        }

        const headers = {
          'Authorization': `Bearer ${jwt}`,
        };

        // Charger l'exercice et la liste des exercices en parallèle
        const [exerciseResponse, listResponse] = await Promise.all([
          fetch(`/api/jsbog/exercises?season=${seasonSlug}&module=${moduleSlug}&exercise=${exerciseSlug}`, { headers }),
          fetch(`/api/jsbog/exercises?season=${seasonSlug}&module=${moduleSlug}`)
        ]);

        const exerciseData = await exerciseResponse.json();
        const listData = await listResponse.json();

        if (exerciseData.error) {
          setError(exerciseData.error);
          return;
        }

        if (exerciseData.exercise) {
          setExercise(exerciseData.exercise);
          setUserCode(exerciseData.exercise.starterCode || '// Write your code here');

          // Trouver l'exercice suivant et précédent
          if (listData.exercises && listData.exercises.length > 0) {
            const currentIndex = listData.exercises.findIndex(
              (ex: { slug: string }) => ex.slug === exerciseSlug
            );

            if (currentIndex > 0) {
              setPrevExercise(listData.exercises[currentIndex - 1]);
            } else {
              setPrevExercise(null);
            }

            if (currentIndex < listData.exercises.length - 1) {
              setNextExercise(listData.exercises[currentIndex + 1]);
            } else {
              setNextExercise(null);
            }
          }
        } else {
          setError('Exercise not found');
        }
      } catch (err) {
        console.error('Error loading exercise:', err);
        setError('Failed to load exercise');
      } finally {
        setLoading(false);
      }
    };

    loadExercise();
  }, [user, seasonSlug, moduleSlug, exerciseSlug, getJWT]);

  // Exécuter les tests sans sauvegarder
  const handleTest = async () => {
    if (!user || !exercise) return;

    setTesting(true);
    setTestResult(null);

    try {
      // Obtenir le JWT pour l'authentification cross-domain
      const jwt = await getJWT();
      if (!jwt) {
        setTestResult({
          success: false,
          message: 'Erreur d\'authentification. Veuillez vous reconnecter.',
          isSubmission: false,
        });
        setTesting(false);
        return;
      }

      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          code: userCode,
          exerciseSlug: exercise.slug,
          testCode: exercise.testCode,
        }),
      });

      const data = await response.json();

      setTestResult({
        success: data.success,
        message: data.results?.passed
          ? 'Tests passés ! Prêt à soumettre.'
          : data.error || 'Certains tests ont échoué',
        isSubmission: false,
        results: data.results,
      });
    } catch (err) {
      console.error('Test failed:', err);
      setTestResult({
        success: false,
        message: 'Erreur lors du test',
        isSubmission: false,
      });
    } finally {
      setTesting(false);
    }
  };

  // Soumettre et sauvegarder la progression
  const handleSubmit = async () => {
    if (!user || !exercise) return;

    setSubmitting(true);
    setTestResult(null);

    try {
      // Obtenir le JWT pour l'authentification cross-domain
      const jwt = await getJWT();
      if (!jwt) {
        setTestResult({
          success: false,
          message: 'Erreur d\'authentification. Veuillez vous reconnecter.',
          isSubmission: true,
        });
        setSubmitting(false);
        return;
      }

      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          code: userCode,
          exerciseSlug: exercise.slug,
          testCode: exercise.testCode,
        }),
      });

      const data = await response.json();

      // Si les tests passent, sauvegarder la progression
      if (data.results?.passed) {
        try {
          await fetch('/api/jsbog/submissions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwt}`,
            },
            body: JSON.stringify({
              seasonSlug,
              moduleSlug,
              exerciseSlug: exercise.slug,
              code: userCode,
              testResults: data.results,
            }),
          });
        } catch (saveError) {
          console.error('Failed to save progression:', saveError);
        }
      }

      setTestResult({
        success: data.success,
        message: data.results?.passed
          ? 'Soumission validée ! Progression sauvegardée.'
          : data.error || 'Soumission échouée',
        isSubmission: true,
        results: data.results,
      });
    } catch (err) {
      console.error('Submission failed:', err);
      setTestResult({
        success: false,
        message: 'Erreur lors de la soumission',
        isSubmission: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    if (exercise) {
      setUserCode(exercise.starterCode || '// Write your code here');
      setTestResult(null);
    }
  };

  if (authLoading || (user && loading)) {
    return <ExercisePageSkeleton />;
  }

  if (!user) {
    return null;
  }

  if (error || !exercise || !season || !jsModule) {
    return (
      <div className="min-h-screen bg-[#0a0f0a] flex items-center justify-center">
        <div className="text-center p-8 border-4 border-red-500 bg-red-500/10 rounded-lg">
          <h2 className="text-2xl font-bold text-red-400 font-mono mb-4">ERREUR</h2>
          <p className="text-gray-400 mb-6">{error || 'Exercice non trouvé'}</p>
          <Link
            href={`/jsbog/${seasonSlug}/${moduleSlug}`}
            className="px-6 py-3 bg-green-500 text-black font-bold font-mono border-4 border-black hover:bg-green-400 transition-colors"
          >
            RETOUR AU MODULE
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white">
      {/* Header */}
      <div className={`border-b-4 border-black bg-gradient-to-r ${season.colors.gradient}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Breadcrumb */}
          <nav className="font-mono text-sm mb-2 text-white/70">
            <Link href="/jsbog" className="hover:text-white transition-colors">
              JSBOG
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/jsbog/${seasonSlug}`} className="hover:text-white transition-colors">
              {season.name}
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/jsbog/${seasonSlug}/${moduleSlug}`} className="hover:text-white transition-colors">
              {jsModule.name}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white font-bold">Ex{exercise.index.toString().padStart(2, '0')}</span>
          </nav>

          {/* Title and navigation */}
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white font-mono truncate">
              {exercise.title}
            </h1>

            {/* Exercise navigation */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {prevExercise ? (
                <Link
                  href={`/jsbog/${seasonSlug}/${moduleSlug}/${prevExercise.slug}`}
                  className="px-3 py-1.5 bg-black/30 text-white/80 font-mono text-sm border border-white/30 rounded hover:bg-black/50 hover:text-white transition-colors"
                  title={prevExercise.title}
                >
                  ← Préc
                </Link>
              ) : (
                <span className="px-3 py-1.5 text-white/30 font-mono text-sm">← Préc</span>
              )}

              <span className="text-white/60 font-mono text-sm px-2">
                {exercise.index + 1}
              </span>

              {nextExercise ? (
                <Link
                  href={`/jsbog/${seasonSlug}/${moduleSlug}/${nextExercise.slug}`}
                  className="px-3 py-1.5 bg-black/30 text-white/80 font-mono text-sm border border-white/30 rounded hover:bg-black/50 hover:text-white transition-colors"
                  title={nextExercise.title}
                >
                  Suiv →
                </Link>
              ) : (
                <span className="px-3 py-1.5 text-white/30 font-mono text-sm">Suiv →</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Instructions - Left */}
          <div className={`lg:col-span-5 bg-black border-4 ${colors?.border || 'border-gray-600'} rounded-lg overflow-hidden flex flex-col max-h-[calc(100vh-200px)]`}>
            <div className="p-4 border-b-2 border-gray-800 flex items-center justify-between">
              <h2 className={`font-mono font-bold ${colors?.text || 'text-gray-400'}`}>
                INSTRUCTIONS
              </h2>
              <span className="text-xs text-gray-500 font-mono">
                {jsModule.name}
              </span>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              <div className="prose prose-invert prose-sm max-w-none font-mono">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-xl font-bold text-white mb-4">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className={`text-lg font-bold ${colors?.text || 'text-cyan-400'} mb-3 mt-6`}>{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-base font-bold text-gray-300 mb-2 mt-4">{children}</h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-gray-300 mb-3 leading-relaxed text-sm">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside text-gray-300 mb-3 space-y-1 text-sm">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside text-gray-300 mb-3 space-y-1 text-sm">{children}</ol>
                    ),
                    code: ({ className, children }) => {
                      const isBlock = className?.includes('language-');
                      if (isBlock) {
                        return (
                          <pre className="bg-gray-900 border border-gray-700 p-3 rounded overflow-x-auto mb-3">
                            <code className="text-green-400 text-xs">{children}</code>
                          </pre>
                        );
                      }
                      return (
                        <code className={`bg-gray-800 ${colors?.text || 'text-yellow-400'} px-1.5 py-0.5 rounded text-xs`}>
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
          </div>

          {/* Code Editor - Right */}
          <div className="lg:col-span-7 bg-black border-4 border-yellow-400 rounded-lg overflow-hidden flex flex-col max-h-[calc(100vh-200px)]">
            {/* Editor header */}
            <div className="p-4 border-b-2 border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="font-mono font-bold text-yellow-400">CODE_EDITOR</h2>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="px-3 py-1 text-xs font-mono text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 rounded transition-colors"
              >
                RESET
              </button>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 min-h-[300px]">
              <Editor
                height="100%"
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
                  padding: { top: 16, bottom: 16 },
                }}
              />
            </div>

            {/* Action buttons: TEST + SUBMIT */}
            <div className="p-4 border-t-2 border-gray-800 flex gap-3">
              {/* Test button */}
              <button
                onClick={handleTest}
                disabled={testing || submitting}
                className={`
                  flex-1 px-6 py-4
                  bg-[#3498db] text-white text-lg font-bold uppercase
                  border-4 border-black
                  shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                  hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                  active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                  active:translate-x-[2px] active:translate-y-[2px]
                  transition-all duration-150
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-3
                  font-mono
                `}
              >
                {testing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    TEST...
                  </>
                ) : (
                  '▶ TESTER'
                )}
              </button>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={testing || submitting}
                className={`
                  flex-1 px-6 py-4
                  bg-[#2ecc71] text-black text-lg font-bold uppercase
                  border-4 border-black
                  shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                  hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                  active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                  active:translate-x-[2px] active:translate-y-[2px]
                  transition-all duration-150
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-3
                  font-mono
                `}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    SOUMISSION...
                  </>
                ) : (
                  '✓ SOUMETTRE'
                )}
              </button>
            </div>

            {/* Results */}
            {testResult && (
              <div className={`p-4 border-t-2 ${testResult.results?.passed ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className={`font-bold font-mono ${testResult.results?.passed ? 'text-green-400' : 'text-red-400'}`}>
                      {testResult.results?.passed ? '✅ TESTS PASSÉS' : '❌ TESTS ÉCHOUÉS'}
                    </h3>
                    {testResult.isSubmission && testResult.results?.passed && (
                      <span className="px-2 py-0.5 bg-green-500/20 border border-green-500 text-green-400 text-xs font-mono rounded">
                        SAUVEGARDÉ
                      </span>
                    )}
                    {!testResult.isSubmission && (
                      <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-500 text-blue-400 text-xs font-mono rounded">
                        TEST SEULEMENT
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setTestResult(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {testResult.results && (
                  <>
                    <div className="flex gap-4 text-sm font-mono mb-3">
                      <span className="text-green-400">
                        ✓ {testResult.results.passedTests}/{testResult.results.totalTests}
                      </span>
                      {testResult.results.failedTests > 0 && (
                        <span className="text-red-400">
                          ✗ {testResult.results.failedTests} échoués
                        </span>
                      )}
                    </div>

                    {testResult.results.output && (
                      <div className="max-h-32 overflow-y-auto p-3 bg-black/50 border border-gray-700 rounded text-xs font-mono">
                        {testResult.results.output.split('\n').map((line: string, i: number) => (
                          <div
                            key={i}
                            className={
                              line.includes('✓') ? 'text-green-400' :
                              line.includes('✗') ? 'text-red-400' :
                              'text-gray-400'
                            }
                          >
                            {line}
                          </div>
                        ))}
                      </div>
                    )}

                    {testResult.results.error && (
                      <div className="mt-3 p-3 bg-red-900/30 border border-red-700 rounded">
                        <pre className="text-red-400 text-xs whitespace-pre-wrap">
                          {testResult.results.error}
                        </pre>
                      </div>
                    )}
                  </>
                )}

                {/* Navigation après succès (seulement pour soumission réussie) */}
                {testResult.isSubmission && testResult.results?.passed && (
                  <div className="mt-4 flex gap-3">
                    <Link
                      href={`/jsbog/${seasonSlug}/${moduleSlug}`}
                      className="flex-1 px-4 py-2 bg-gray-800 text-white text-center font-mono text-sm border-2 border-gray-600 rounded hover:bg-gray-700 transition-colors"
                    >
                      ← Module
                    </Link>
                    {nextExercise ? (
                      <Link
                        href={`/jsbog/${seasonSlug}/${moduleSlug}/${nextExercise.slug}`}
                        className={`flex-1 px-4 py-2 ${colors?.bg || 'bg-cyan-500'} text-white text-center font-mono text-sm border-2 border-black rounded hover:opacity-90 transition-colors`}
                      >
                        Suivant →
                      </Link>
                    ) : (
                      <Link
                        href={`/jsbog/${seasonSlug}/${moduleSlug}`}
                        className="flex-1 px-4 py-2 bg-green-500 text-black text-center font-mono text-sm font-bold border-2 border-black rounded hover:bg-green-400 transition-colors"
                      >
                        Module terminé ✓
                      </Link>
                    )}
                  </div>
                )}

                {/* Suggestion de soumettre après test réussi */}
                {!testResult.isSubmission && testResult.results?.passed && (
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                    <p className="text-blue-400 text-sm font-mono">
                      💡 Tests passés ! Clique sur <strong>SOUMETTRE</strong> pour valider et débloquer la suite.
                    </p>
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
