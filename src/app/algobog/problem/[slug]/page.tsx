'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import ReactMarkdown from 'react-markdown';
import dynamic from 'next/dynamic';
import AlgobogUnlockModal from '@/components/algobog/AlgobogUnlockModal';

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#1e1e1e] flex items-center justify-center text-gray-400 font-mono">
      Chargement de l&apos;éditeur...
    </div>
  ),
});

// Building images mapping
const BUILDING_IMAGES: Record<string, string> = {
  'array-tower': '/images/algobog/icons/algobog-building-arrays.png',
  'string-plaza': '/images/algobog/icons/algobog-building-strings.png',
  'hash-hub': '/images/algobog/icons/algobog-building-hashmaps.png',
  'two-pointers-bridge': '/images/algobog/icons/algobog-building-twopointers.png',
  'binary-search-center': '/images/algobog/icons/algobog-building-binarysearch.png',
  'sliding-window-mall': '/images/algobog/icons/algobog-building-slidingwindow.png',
  'sorting-station': '/images/algobog/icons/algobog-building-sorting.png',
  'stack-skyscraper': '/images/algobog/icons/algobog-building-stack.png',
  'linked-list-factory': '/images/algobog/icons/algobog-building-linkedlists.png',
  'queue-warehouse': '/images/algobog/icons/algobog-building-queues.png',
  'tree-greenhouse': '/images/algobog/icons/algobog-building-trees.png',
  'bst-laboratory': '/images/algobog/icons/algobog-building-bst.png',
  'heap-refinery': '/images/algobog/icons/algobog-building-heaps.png',
  'trie-telecom': '/images/algobog/icons/algobog-building-tries.png',
  'bfs-metro': '/images/algobog/icons/algobog-building-bfs.png',
  'dfs-tunnel': '/images/algobog/icons/algobog-building-dfs.png',
  'topo-terminal': '/images/algobog/icons/algobog-building-topsort.png',
  'union-junction': '/images/algobog/icons/algobog-building-unionfind.png',
  'shortest-path-highway': '/images/algobog/icons/algobog-building-shortestpath.png',
  'backtrack-incubator': '/images/algobog/icons/algobog-building-backtracking.png',
  'dp-datacenter': '/images/algobog/icons/algobog-building-dp.png',
  'segment-server': '/images/algobog/icons/algobog-building-segtrees.png',
  'fenwick-firewall': '/images/algobog/icons/algobog-building-fenwick.png',
  'dp2d-mainframe': '/images/algobog/icons/algobog-building-advanceddp.png',
  'greedy-lab': '/images/algobog/icons/algobog-building-greedy.png',
  'bitwise-bunker': '/images/algobog/icons/algobog-building-bits.png',
  'math-observatory': '/images/algobog/icons/algobog-building-math.png',
  'design-studio': '/images/algobog/icons/algobog-building-systemdesign.png',
  'concurrency-reactor': '/images/algobog/icons/algobog-building-concurrency.png',
  'advanced-dp-penthouse': '/images/algobog/icons/algobog-building-advanceddp.png',
  'hard-graph-helipad': '/images/algobog/icons/algobog-building-hardgraphs.png',
  'string-algo-antenna': '/images/algobog/icons/algobog-building-stringalgo.png',
  'contest-crown': '/images/algobog/icons/algobog-building-contest.png',
};

interface AlgoProblem {
  slug: string;
  title: string;
  statement: string;
  starterCode: string;
  testCode: string;
  difficulty: 'easy' | 'medium' | 'hard';
  buildingSlug: string;
  buildingName: string;
  districtSlug: string;
  districtName: string;
  order: number;
  xpReward: number;
  hints?: string[];
}

interface TestResult {
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
}

// Skeleton component
function ProblemPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white">
      <div className="h-16 bg-gray-800 animate-pulse" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 bg-black border-4 border-gray-700 p-6 rounded-lg animate-pulse h-[500px]" />
          <div className="lg:col-span-7 bg-black border-4 border-gray-700 p-6 rounded-lg animate-pulse h-[500px]" />
        </div>
      </div>
    </div>
  );
}

const DIFFICULTY_COLORS = {
  easy: {
    text: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500',
    badge: 'bg-green-500/20 border-green-500/50 text-green-400',
  },
  medium: {
    text: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500',
    badge: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
  },
  hard: {
    text: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500',
    badge: 'bg-red-500/20 border-red-500/50 text-red-400',
  },
};

interface LockedProblemInfo {
  slug: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  order: number;
}

export default function AlgoProblemPage() {
  const { user, isLoading: authLoading, getJWT } = useAuth();
  const router = useRouter();
  const params = useParams();
  const problemSlug = params.slug as string;

  const [problem, setProblem] = useState<AlgoProblem | null>(null);
  const [userCode, setUserCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [testing, setTesting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [lockedProblem, setLockedProblem] = useState<LockedProblemInfo | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  const loadProblem = useCallback(async () => {
    if (!user || !problemSlug) return;

    try {
      setLoading(true);
      setError('');
      setLockedProblem(null);

      const jwt = await getJWT();
      if (!jwt) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/algobog/problems?slug=${problemSlug}`, {
        headers: {
          'Authorization': `Bearer ${jwt}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle 403 locked problem with unlock option
        if (response.status === 403 && data.problem) {
          setLockedProblem({
            slug: data.problem.slug,
            title: data.problem.title,
            difficulty: data.problem.difficulty,
            order: data.problem.order,
          });
          setLoading(false);
          return;
        }

        setError(data.error || 'Failed to load problem');
        setLoading(false);
        return;
      }

      if (!data.problem) {
        setError('Problem not found');
        setLoading(false);
        return;
      }

      const loadedProblem: AlgoProblem = {
        slug: data.problem.slug,
        title: data.problem.title,
        statement: data.problem.statement || `## ${data.problem.title}\n\nSolve this problem.`,
        starterCode: data.problem.starterCode || `// Solution for ${data.problem.title}\n\nfunction solution() {\n  // Your code here\n}\n\nmodule.exports = { solution };`,
        testCode: data.problem.testCode || '',
        difficulty: data.problem.difficulty,
        buildingSlug: data.problem.buildingSlug,
        buildingName: data.problem.buildingName,
        districtSlug: data.problem.districtSlug,
        districtName: data.problem.districtName,
        order: data.problem.order,
        xpReward: data.problem.xpReward || 10,
        hints: data.problem.hints || [],
      };

      setProblem(loadedProblem);
      setUserCode(loadedProblem.starterCode);
    } catch (err) {
      console.error('Error loading problem:', err);
      setError('Failed to load problem');
    } finally {
      setLoading(false);
    }
  }, [user, problemSlug, getJWT]);

  useEffect(() => {
    loadProblem();
  }, [loadProblem]);

  const handleTest = async () => {
    if (!user || !problem) return;

    setTesting(true);
    setTestResult(null);

    try {
      const jwt = await getJWT();
      if (!jwt) {
        setTestResult({
          success: false,
          message: 'Erreur d\'authentification',
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
          exerciseSlug: problem.slug,
          testCode: problem.testCode,
          type: 'algobog',
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

  const handleSubmit = async () => {
    if (!user || !problem) return;

    setSubmitting(true);
    setTestResult(null);

    try {
      const jwt = await getJWT();
      if (!jwt) {
        setTestResult({
          success: false,
          message: 'Erreur d\'authentification',
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
          exerciseSlug: problem.slug,
          testCode: problem.testCode,
          type: 'algobog',
        }),
      });

      const data = await response.json();

      // Save submission if tests pass
      if (data.results?.passed) {
        try {
          await fetch('/api/algobog/submissions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwt}`,
            },
            body: JSON.stringify({
              problemSlug: problem.slug,
              buildingSlug: problem.buildingSlug,
              districtSlug: problem.districtSlug,
              code: userCode,
              passed: true,
              xpEarned: problem.xpReward,
            }),
          });
        } catch (saveError) {
          console.error('Failed to save submission:', saveError);
        }
      }

      setTestResult({
        success: data.success,
        message: data.results?.passed
          ? `Soumission validée ! +${problem.xpReward} XP`
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
    if (problem) {
      setUserCode(problem.starterCode);
      setTestResult(null);
    }
  };

  if (authLoading || (user && loading)) {
    return <ProblemPageSkeleton />;
  }

  if (!user) {
    return null;
  }

  // Locked problem screen with unlock option
  if (lockedProblem) {
    const lockedDiffColors = DIFFICULTY_COLORS[lockedProblem.difficulty];
    return (
      <div className="min-h-screen bg-[#0a0f0a] flex items-center justify-center">
        <div className="text-center p-8 border-4 border-purple-500 bg-purple-500/10 rounded-lg max-w-md w-full mx-4">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-purple-400 font-mono mb-2">PROBLÈME VERROUILLÉ</h2>
          <p className="text-white font-bold text-lg mb-1">{lockedProblem.title}</p>
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className={`px-2 py-0.5 text-xs font-mono rounded border ${lockedDiffColors.badge}`}>
              {lockedProblem.difficulty.toUpperCase()}
            </span>
            <span className="text-gray-500 text-sm font-mono">#{lockedProblem.order}</span>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            Complétez le problème précédent ou débloquez-le avec des gemmes.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShowUnlockModal(true)}
              className="w-full px-6 py-3 bg-purple-600 text-white font-bold font-mono border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              💎 DÉBLOQUER AVEC GEMMES
            </button>
            <Link
              href="/algobog"
              className="px-6 py-3 bg-gray-800 text-gray-300 font-bold font-mono border-4 border-black hover:bg-gray-700 transition-colors text-center"
            >
              RETOUR À ALGOBOG
            </Link>
          </div>
        </div>

        <AlgobogUnlockModal
          isOpen={showUnlockModal}
          onClose={() => setShowUnlockModal(false)}
          targetType="problem"
          targetSlug={lockedProblem.slug}
          targetTitle={lockedProblem.title}
          difficulty={lockedProblem.difficulty}
          onUnlocked={() => {
            setShowUnlockModal(false);
            loadProblem();
          }}
        />
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen bg-[#0a0f0a] flex items-center justify-center">
        <div className="text-center p-8 border-4 border-red-500 bg-red-500/10 rounded-lg">
          <h2 className="text-2xl font-bold text-red-400 font-mono mb-4">ERREUR</h2>
          <p className="text-gray-400 mb-6">{error || 'Problème non trouvé'}</p>
          <Link
            href="/algobog"
            className="px-6 py-3 bg-purple-500 text-white font-bold font-mono border-4 border-black hover:bg-purple-400 transition-colors"
          >
            RETOUR À ALGOBOG
          </Link>
        </div>
      </div>
    );
  }

  const diffColors = DIFFICULTY_COLORS[problem.difficulty];

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white">
      {/* Header */}
      <div className={`border-b-4 border-black ${diffColors.bg}`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* Breadcrumb */}
          <nav className="font-mono text-sm mb-2 text-gray-400">
            <Link href="/algobog" className="hover:text-purple-400 transition-colors">
              ALGOBOG
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/algobog/district/${problem.districtSlug}`} className="hover:text-purple-400 transition-colors">
              {problem.districtName}
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/algobog/district/${problem.districtSlug}/${problem.buildingSlug}`} className="hover:text-purple-400 transition-colors">
              {problem.buildingName}
            </Link>
            <span className="mx-2">/</span>
            <span className={diffColors.text}>#{problem.order}</span>
          </nav>

          {/* Title row */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Building icon */}
              <div className="relative w-10 h-10 rounded overflow-hidden border border-white/20 hidden sm:block">
                <Image
                  src={BUILDING_IMAGES[problem.buildingSlug] || '/images/algobog/icons/algobog-downtown-icon.png'}
                  alt={problem.buildingName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white font-mono">
                  {problem.title}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 text-xs font-mono rounded border ${diffColors.badge}`}>
                    {problem.difficulty.toUpperCase()}
                  </span>
                  <span className="text-gray-500 text-xs font-mono">
                    +{problem.xpReward} XP
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              <Link
                href={`/algobog/district/${problem.districtSlug}/${problem.buildingSlug}`}
                className="px-3 py-1.5 bg-black/30 text-gray-400 font-mono text-sm border border-gray-700 rounded hover:text-white hover:border-gray-500 transition-colors"
              >
                ← Building
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Instructions - Left */}
          <div className={`lg:col-span-5 bg-black border-4 ${diffColors.border} rounded-lg overflow-hidden flex flex-col max-h-[calc(100vh-180px)]`}>
            <div className="p-4 border-b-2 border-gray-800 flex items-center justify-between">
              <h2 className={`font-mono font-bold ${diffColors.text}`}>
                INSTRUCTIONS
              </h2>
              {problem.hints && problem.hints.length > 0 && (
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="text-xs font-mono text-gray-500 hover:text-yellow-400 transition-colors"
                >
                  {showHints ? '🙈 Masquer indices' : '💡 Indices'}
                </button>
              )}
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              <div className="prose prose-invert prose-sm max-w-none font-mono">
                <ReactMarkdown
                  components={{
                    h2: ({ children }) => (
                      <h2 className={`text-lg font-bold ${diffColors.text} mb-3 mt-6`}>{children}</h2>
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
                        <code className={`bg-gray-800 ${diffColors.text} px-1.5 py-0.5 rounded text-xs`}>
                          {children}
                        </code>
                      );
                    },
                    strong: ({ children }) => (
                      <strong className="text-white font-bold">{children}</strong>
                    ),
                  }}
                >
                  {problem.statement}
                </ReactMarkdown>
              </div>

              {/* Hints section */}
              {showHints && problem.hints && (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <h4 className="text-yellow-400 font-mono text-sm font-bold mb-2">💡 Indices</h4>
                  <ul className="space-y-2">
                    {problem.hints.map((hint, i) => (
                      <li key={i} className="text-gray-400 text-xs font-mono">
                        {i + 1}. {hint}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Code Editor - Right */}
          <div className="lg:col-span-7 bg-black border-4 border-purple-500 rounded-lg overflow-hidden flex flex-col max-h-[calc(100vh-180px)]">
            {/* Editor header */}
            <div className="p-4 border-b-2 border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="font-mono font-bold text-purple-400">CODE_EDITOR</h2>
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

            {/* Action buttons */}
            <div className="p-4 border-t-2 border-gray-800 flex gap-3">
              <button
                onClick={handleTest}
                disabled={testing || submitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white text-lg font-bold uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-mono"
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

              <button
                onClick={handleSubmit}
                disabled={testing || submitting}
                className="flex-1 px-6 py-3 bg-green-500 text-black text-lg font-bold uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-mono"
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
                        +{problem.xpReward} XP
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

                {/* Success navigation */}
                {testResult.isSubmission && testResult.results?.passed && (
                  <div className="mt-4 flex gap-3">
                    <Link
                      href={`/algobog/district/${problem.districtSlug}/${problem.buildingSlug}`}
                      className="flex-1 px-4 py-2 bg-gray-800 text-white text-center font-mono text-sm border-2 border-gray-600 rounded hover:bg-gray-700 transition-colors"
                    >
                      ← Retour au Building
                    </Link>
                    <Link
                      href={`/algobog/district/${problem.districtSlug}/${problem.buildingSlug}`}
                      className="flex-1 px-4 py-2 bg-purple-500 text-white text-center font-mono text-sm border-2 border-black rounded hover:bg-purple-400 transition-colors"
                    >
                      Problème Suivant →
                    </Link>
                  </div>
                )}

                {/* Suggest submit after successful test */}
                {!testResult.isSubmission && testResult.results?.passed && (
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                    <p className="text-blue-400 text-sm font-mono">
                      💡 Tests passés ! Clique sur <strong>SOUMETTRE</strong> pour valider et gagner {problem.xpReward} XP.
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
