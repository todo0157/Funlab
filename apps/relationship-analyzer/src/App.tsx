import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { FileUploader } from './components/upload/FileUploader';
import { AnalysisResult } from './components/analysis/AnalysisResult';
import { TierSelector } from './components/tier/TierSelector';
import { parseKakaoTalkChat } from './services/chatParser';
import { analyzeRelationship } from './services/analysisService';
import type { RelationshipAnalysisResult, AnalysisState, ParsedChat, AnalysisTier } from './types/relationship';

const PORTAL_URL = import.meta.env.DEV ? 'http://localhost:3000' : '/';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('darkMode') === 'true' ||
        (!localStorage.getItem('darkMode') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });

  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [result, setResult] = useState<RelationshipAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [parsedChat, setParsedChat] = useState<ParsedChat | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleFileSelect = useCallback(async (content: string) => {
    setAnalysisState('parsing');
    setError(null);

    try {
      const parsed: ParsedChat = parseKakaoTalkChat(content);

      if (parsed.participants.length < 2) {
        throw new Error('대화 참여자가 2명 이상이어야 해요. 1:1 또는 그룹 대화 파일을 업로드해주세요.');
      }

      if (parsed.totalMessageCount < 20) {
        throw new Error('분석하기에 메시지가 너무 적어요. 더 많은 대화가 있는 파일을 업로드해주세요.');
      }

      setParsedChat(parsed);
      setAnalysisState('tierSelection');
    } catch (err) {
      setError(err instanceof Error ? err.message : '분석 중 오류가 발생했어요');
      setAnalysisState('error');
    }
  }, []);

  const handleTierSelect = useCallback(async (tier: AnalysisTier) => {
    if (!parsedChat) return;

    setAnalysisState('analyzing');
    setError(null);

    try {
      const analysisResult = await analyzeRelationship(parsedChat, tier);
      setResult(analysisResult);
      setAnalysisState('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : '분석 중 오류가 발생했어요');
      setAnalysisState('error');
    }
  }, [parsedChat]);

  const handleReset = useCallback(() => {
    setAnalysisState('idle');
    setResult(null);
    setError(null);
    setParsedChat(null);
  }, []);

  const isLoading = analysisState === 'parsing' || analysisState === 'analyzing';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title section */}
        {analysisState !== 'complete' && analysisState !== 'tierSelection' && (
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              <span className="gradient-text">관계 점수</span> 측정기
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
              카카오톡 대화를 AI가 분석해서 관계 케미 점수를 측정해드려요
            </p>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center">
                <span className="text-4xl pulse-icon">💕</span>
              </div>
              <div className="absolute inset-0 rounded-full bg-teal-500/30 pulse-ring" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {analysisState === 'parsing' ? '대화를 읽고 있어요...' : 'AI가 관계를 분석 중이에요...'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">잠시만 기다려주세요</p>
            </div>
          </div>
        )}

        {/* Upload section */}
        {analysisState === 'idle' && (
          <FileUploader onFileSelect={handleFileSelect} isLoading={isLoading} />
        )}

        {/* Tier selection */}
        {analysisState === 'tierSelection' && parsedChat && (
          <TierSelector
            parsedChat={parsedChat}
            onSelectTier={handleTierSelect}
            onCancel={handleReset}
            isLoading={isLoading}
          />
        )}

        {/* Error state */}
        {analysisState === 'error' && error && (
          <div className="space-y-6">
            <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-center">
              <div className="text-4xl mb-4">😢</div>
              <p className="text-red-600 dark:text-red-400 font-medium mb-4">{error}</p>
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                다시 시도하기
              </button>
            </div>
          </div>
        )}

        {/* Result section */}
        {analysisState === 'complete' && result && (
          <AnalysisResult result={result} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <a
          href={PORTAL_URL}
          className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
        >
          FunLab
        </a>
        {' · '}
        <span>&copy; 2026 All rights reserved.</span>
      </footer>
    </div>
  );
}

export default App;
