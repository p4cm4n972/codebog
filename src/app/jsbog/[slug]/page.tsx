"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { databases } from '@/lib/appwrite/client';
import { Query, ID } from 'appwrite';
import ReactMarkdown from 'react-markdown';
import Editor from '@monaco-editor/react';

interface Exercise {
  $id: string;
  title: string;
  slug: string;
  statement: string;
  starterCode?: string;
  testCode?: string;
}

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = 'exercises';

function extractInstructions(statement: string): string {
  // Extract from "## Instructions" to before "## Tests"
  const lines = statement.split('\n');
  const instructionsIndex = lines.findIndex(line => line.trim() === '## Instructions');
  const testsIndex = lines.findIndex(line => line.trim() === '## Tests');

  if (instructionsIndex === -1) {
    return statement; // Return full statement if no Instructions section found
  }

  // If Tests section exists, exclude it
  if (testsIndex !== -1 && testsIndex > instructionsIndex) {
    return lines.slice(instructionsIndex, testsIndex).join('\n');
  }

  return lines.slice(instructionsIndex).join('\n');
}

export default function ExerciseDetailPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userCode, setUserCode] = useState('');
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
    const fetchExercise = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError('');
        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID,
          [Query.equal('slug', slug)]
        );

        if (response.documents.length === 0) {
          setError('Exercise not found');
          return;
        }

        const exerciseData = response.documents[0] as unknown as Exercise;
        setExercise(exerciseData);
        setUserCode(exerciseData.starterCode || '// Write your code here');
      } catch (err: any) {
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

    fetchExercise();
  }, [user, slug]);

  const handleSubmit = async () => {
    if (!user || !exercise) return;

    setSubmitting(true);
    setSubmitResult(null);

    try {
      // Execute code and run tests
      const executeResponse = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: userCode,
          exerciseSlug: exercise.slug,
          testCode: exercise.testCode,
        }),
      });

      const executeData = await executeResponse.json();

      if (!executeData.success) {
        setSubmitResult({
          success: false,
          message: 'Échec des tests',
          results: executeData.results,
        });
        return;
      }

      // Save submission to Appwrite with test results
      await databases.createDocument(
        DATABASE_ID,
        'submissions',
        ID.unique(),
        {
          userId: user.$id,
          exerciseId: exercise.$id,
          exerciseSlug: exercise.slug,
          code: userCode,
          submittedAt: new Date().toISOString(),
          passed: executeData.results.passed,
          testResults: JSON.stringify(executeData.results),
        }
      );

      setSubmitResult({
        success: true,
        message: executeData.results.passed ? '✅ Tous les tests sont passés !' : '❌ Certains tests ont échoué',
        results: executeData.results,
      });
    } catch (err: any) {
      console.error('Submission failed:', err);
      setSubmitResult({
        success: false,
        message: err.message || 'Erreur lors de la soumission',
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0f0a] font-mono text-white">
        <p className="text-green-400">Chargement de la mission...</p>
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
            onClick={() => router.push('/jsbog')}
            className="mt-6 px-6 py-3 bg-green-500 text-black font-bold border-4 border-black hover:bg-green-400"
          >
            RETOUR AUX MISSIONS
          </button>
        </div>
      </div>
    );
  }

  const instructions = extractInstructions(exercise.statement);

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/jsbog')}
            className="mb-4 px-4 py-2 bg-green-500 text-black font-mono font-bold border-4 border-black hover:bg-green-400 transition-colors"
          >
            ← RETOUR
          </button>
          <h1 className="text-4xl font-bold text-yellow-400 font-mono">
            {exercise.title}
          </h1>
          <p className="text-green-400 font-mono mt-2">/{exercise.slug}</p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Instructions Section - Left */}
          <div className="lg:col-span-4 bg-black border-4 border-green-500 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-200px)]">
            <div className="prose prose-invert prose-green max-w-none font-mono">
              <ReactMarkdown
                components={{
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold text-yellow-400 mb-4 mt-6">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-bold text-green-400 mb-3 mt-4">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-green-300 mb-4 leading-relaxed">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside text-green-300 mb-4 space-y-2">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside text-green-300 mb-4 space-y-2">{children}</ol>
                  ),
                  code: ({ className, children }) => {
                    const isBlock = className?.includes('language-');
                    if (isBlock) {
                      return (
                        <pre className="bg-black border-2 border-green-700 p-4 rounded overflow-x-auto mb-4">
                          <code className="text-green-400 text-sm">{children}</code>
                        </pre>
                      );
                    }
                    return (
                      <code className="bg-green-900/30 text-yellow-400 px-2 py-1 rounded text-sm">
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {instructions}
              </ReactMarkdown>
            </div>
          </div>

          {/* Code Editor Section - Right */}
          <div className="lg:col-span-8 bg-black border-4 border-yellow-400 p-6 md:p-8 flex flex-col max-h-[calc(100vh-200px)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-yellow-400 font-mono">CODE_EDITOR</h2>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-grow border-2 border-green-700 rounded overflow-hidden">
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
                }}
              />
            </div>

            {/* Submit Button and Results */}
            <div className="mt-4 space-y-3">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full px-6 py-4 bg-[#2ecc71] text-black text-xl font-bold uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150 rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'SOUMISSION...' : 'SOUMETTRE'}
              </button>

              {submitResult && (
                <div className={`p-4 border-4 ${submitResult.results?.passed ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'} rounded space-y-3`}>
                  <p className={`font-bold text-lg ${submitResult.results?.passed ? 'text-green-400' : 'text-red-400'}`}>
                    {submitResult.message}
                  </p>

                  {submitResult.results && (
                    <>
                      <div className="flex gap-4 text-sm font-mono">
                        <span className="text-green-400">
                          ✓ Tests réussis: {submitResult.results.passedTests}/{submitResult.results.totalTests}
                        </span>
                        {submitResult.results.failedTests > 0 && (
                          <span className="text-red-400">
                            ✗ Tests échoués: {submitResult.results.failedTests}
                          </span>
                        )}
                      </div>

                      {submitResult.results.output && (
                        <div className="mt-3 p-3 bg-black/50 border border-gray-700 rounded">
                          <p className="text-xs text-gray-400 mb-1">Sortie:</p>
                          <pre className="text-sm text-green-300 whitespace-pre-wrap">
                            {submitResult.results.output}
                          </pre>
                        </div>
                      )}

                      {submitResult.results.error && (
                        <div className="mt-3 p-3 bg-red-900/20 border border-red-700 rounded">
                          <p className="text-xs text-red-400 mb-1">Erreur:</p>
                          <pre className="text-sm text-red-300 whitespace-pre-wrap">
                            {submitResult.results.error}
                          </pre>
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
    </div>
  );
}
