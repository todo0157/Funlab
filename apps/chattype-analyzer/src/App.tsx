import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { FileUploader } from './components/upload/FileUploader';
import { TargetSelector } from './components/upload/TargetSelector';
import { TierSelector } from './components/tier/TierSelector';
import { ChatTypeResultComponent } from './components/result/ChatTypeResult';
import { parseKakaoTalkChat } from './services/chatParser';
import { analyzeChatType } from './services/analysisService';
import type { AppState, ParsedChat, ChatTypeResult, AnalysisTier } from './types/chattype';

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
  const [result, setResult] = useState<ChatTypeResult | null>(null);
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

      if (parsed.participants.length < 1) {
        throw new Error('대화 참여자를 찾을 수 없어요. 올바른 카카오톡 내보내기 파일인지 확인해주세요.');
      }

      if (parsed.totalMessageCount < 30) {
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
      const analysisResult = await analyzeChatType(parsedChat, targetName, tier);
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
              카톡 <span className="gradient-text">말투 유형</span> 테스트
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
              대화 스타일을 분석해서 16가지 말투 유형 중 어디에 해당하는지 알려드려요!
            </p>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-500 flex items-center justify-center">
                <span className="text-4xl pulse-icon">💬</span>
              </div>
              <div className="absolute inset-0 rounded-full bg-fuchsia-500/30 pulse-ring" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {appState === 'parsing' ? '대화를 읽고 있어요...' : '말투를 분석하고 있어요...'}
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
          <ChatTypeResultComponent
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
          className="hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors"
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
