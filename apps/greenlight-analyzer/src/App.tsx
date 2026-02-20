import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { FileUploader } from './components/upload/FileUploader';
import { TargetSelector } from './components/upload/TargetSelector';
import { TierSelector } from './components/tier/TierSelector';
import { GreenlightResultComponent } from './components/result/GreenlightResult';
import { parseKakaoTalkChat } from './services/chatParser';
import { analyzeGreenlight } from './services/analysisService';
import type { AppState, ParsedChat, GreenlightResult, AnalysisTier } from './types/greenlight';

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

  const [appState, setAppState] = useState<AppState>('idle');
  const [parsedChat, setParsedChat] = useState<ParsedChat | null>(null);
  const [targetName, setTargetName] = useState<string>('');
  const [result, setResult] = useState<GreenlightResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    setAppState('parsing');
    setError(null);

    try {
      const parsed = parseKakaoTalkChat(content);

      if (parsed.participants.length < 2) {
        throw new Error('1:1 대화방의 파일을 업로드해주세요. (2명의 참여자 필요)');
      }

      if (parsed.totalMessageCount < 50) {
        throw new Error('분석하기에 메시지가 너무 적어요. 더 많은 대화가 있는 파일을 업로드해주세요.');
      }

      setParsedChat(parsed);
      setAppState('selectTarget');
    } catch (err) {
      setError(err instanceof Error ? err.message : '파일 분석 중 오류가 발생했어요');
      setAppState('error');
    }
  }, []);

  const handleTargetSelect = useCallback((name: string) => {
    setTargetName(name);
    setAppState('tierSelection');
  }, []);

  const handleTierSelect = useCallback(async (tier: AnalysisTier) => {
    if (!parsedChat || !targetName) return;

    setAppState('analyzing');
    setError(null);

    try {
      const analysisResult = await analyzeGreenlight(parsedChat, targetName, tier);
      setResult(analysisResult);
      setAppState('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : '분석 중 오류가 발생했어요');
      setAppState('error');
    }
  }, [parsedChat, targetName]);

  const handleReset = useCallback(() => {
    setAppState('idle');
    setParsedChat(null);
    setTargetName('');
    setResult(null);
    setError(null);
  }, []);

  const isLoading = appState === 'parsing' || appState === 'analyzing';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title section */}
        {(appState === 'idle' || appState === 'error') && (
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              <span className="gradient-text">그린라이트</span> 판독기
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
              카카오톡 대화를 분석해서 상대방의 그린라이트와 레드플래그를 찾아드려요!
            </p>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <span className="text-4xl pulse-icon">🚦</span>
              </div>
              <div className="absolute inset-0 rounded-full bg-green-500/30 pulse-ring" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {appState === 'parsing' ? '대화를 읽고 있어요...' : '그린라이트를 판독하고 있어요...'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">잠시만 기다려주세요</p>
            </div>
          </div>
        )}

        {/* Upload section */}
        {appState === 'idle' && (
          <FileUploader onFileSelect={handleFileSelect} isLoading={isLoading} />
        )}

        {/* Target selection */}
        {appState === 'selectTarget' && parsedChat && (
          <TargetSelector
            parsedChat={parsedChat}
            onSelectTarget={handleTargetSelect}
            onCancel={handleReset}
          />
        )}

        {/* Tier selection */}
        {appState === 'tierSelection' && (
          <TierSelector
            targetName={targetName}
            onSelectTier={handleTierSelect}
            onCancel={() => setAppState('selectTarget')}
            isLoading={isLoading}
          />
        )}

        {/* Result */}
        {appState === 'result' && result && (
          <GreenlightResultComponent
            result={result}
            onReset={handleReset}
          />
        )}

        {/* Error state */}
        {appState === 'error' && error && (
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
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <a
          href={PORTAL_URL}
          className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
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
