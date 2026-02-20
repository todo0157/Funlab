import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { ModeSelector } from './components/mode/ModeSelector';
import { QuizProgress } from './components/quiz/QuizProgress';
import { QuizQuestion } from './components/quiz/QuizQuestion';
import { CharacterResult } from './components/result/CharacterResult';
import { FileUploader } from './components/upload/FileUploader';
import { TargetSelector } from './components/upload/TargetSelector';
import { TierSelector } from './components/tier/TierSelector';
import { GalleryView } from './components/gallery/GalleryView';
import { CharacterDetail } from './components/gallery/CharacterDetail';
import { quizQuestions } from './data/quizQuestions';
import { analyzeQuizResult, parseResultFromUrl, reconstructResultFromShare } from './services/quizService';
import { parseKakaoTalkChat, sampleMessages, formatAllMessagesForAPI, calculatePersonStats, formatStatsForAPI } from './services/chatParser';
import { analyzeCharacter, TIER_CONFIG } from './services/analysisService';
import type { AppState, AnalysisMode, QuizAnswer, AnalysisResult, ParsedChat, AnalysisTier, Character } from './types/character';

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
  const [selectedMode, setSelectedMode] = useState<AnalysisMode | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Chat analysis state
  const [parsedChat, setParsedChat] = useState<ParsedChat | null>(null);
  const [targetName, setTargetName] = useState<string | null>(null);

  // Gallery state
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  // 공유 URL에서 결과 복원
  useEffect(() => {
    const sharedData = parseResultFromUrl();
    if (sharedData) {
      const reconstructedResult = reconstructResultFromShare(sharedData);
      if (reconstructedResult) {
        setResult(reconstructedResult);
        setAppState('result');
        // URL 파라미터 제거
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleModeSelect = useCallback((mode: AnalysisMode) => {
    setSelectedMode(mode);
    if (mode === 'quiz') {
      setAppState('quiz');
      setCurrentQuestionIndex(0);
      setQuizAnswers([]);
    } else {
      // 카톡 분석 모드
      setAppState('parsing');
    }
  }, []);

  const handleFileSelect = useCallback((content: string) => {
    try {
      const parsed = parseKakaoTalkChat(content);

      if (parsed.messages.length < 10) {
        setError('대화 메시지가 너무 적어요. 더 많은 대화가 필요합니다.');
        setAppState('error');
        return;
      }

      if (parsed.participants.length < 1) {
        setError('대화 참여자를 찾을 수 없어요. 올바른 카카오톡 대화 파일인지 확인해주세요.');
        setAppState('error');
        return;
      }

      setParsedChat(parsed);
      setAppState('selectTarget');
    } catch (err) {
      setError(err instanceof Error ? err.message : '파일 파싱 중 오류가 발생했어요');
      setAppState('error');
    }
  }, []);

  const handleSelectTarget = useCallback((name: string) => {
    setTargetName(name);
    setAppState('tierSelection');
  }, []);

  const handleSelectTier = useCallback(async (tier: AnalysisTier) => {
    if (!parsedChat || !targetName) return;

    setAppState('analyzing');

    try {
      const maxMessages = TIER_CONFIG[tier].maxMessages;
      const sampled = sampleMessages(parsedChat, maxMessages);
      const messagesText = formatAllMessagesForAPI(sampled);

      // Calculate stats for the target
      const stats = calculatePersonStats(sampled, targetName);
      const statsText = formatStatsForAPI(stats);

      const analysisResult = await analyzeCharacter({
        tier,
        targetName,
        messages: messagesText,
        stats: statsText,
      });

      setResult(analysisResult);
      setAppState('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : '분석 중 오류가 발생했어요');
      setAppState('error');
    }
  }, [parsedChat, targetName]);

  const handleQuizAnswer = useCallback((selectedIndex: number) => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedIndex,
    };

    const newAnswers = [...quizAnswers, newAnswer];
    setQuizAnswers(newAnswers);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // 퀴즈 완료 - 결과 분석
      setAppState('analyzing');
      setTimeout(() => {
        try {
          const analysisResult = analyzeQuizResult(newAnswers);
          setResult(analysisResult);
          setAppState('result');
        } catch (err) {
          setError(err instanceof Error ? err.message : '분석 중 오류가 발생했어요');
          setAppState('error');
        }
      }, 1500);
    }
  }, [currentQuestionIndex, quizAnswers]);

  const handleReset = useCallback(() => {
    setAppState('idle');
    setSelectedMode(null);
    setCurrentQuestionIndex(0);
    setQuizAnswers([]);
    setResult(null);
    setError(null);
    setParsedChat(null);
    setTargetName(null);
  }, []);

  const handleBackToTargetSelect = useCallback(() => {
    setTargetName(null);
    setAppState('selectTarget');
  }, []);

  const handleBackToUpload = useCallback(() => {
    setParsedChat(null);
    setTargetName(null);
    setAppState('parsing');
  }, []);

  const handleQuizBack = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setQuizAnswers(prev => prev.slice(0, -1));
    }
  }, [currentQuestionIndex]);

  // Gallery handlers
  const handleOpenGallery = useCallback(() => {
    setAppState('gallery');
  }, []);

  const handleSelectCharacter = useCallback((character: Character) => {
    setSelectedCharacter(character);
    setAppState('characterDetail');
  }, []);

  const handleBackToGallery = useCallback(() => {
    setSelectedCharacter(null);
    setAppState('gallery');
  }, []);

  const handleStartQuizFromDetail = useCallback(() => {
    setSelectedCharacter(null);
    setSelectedMode('quiz');
    setAppState('quiz');
    setCurrentQuestionIndex(0);
    setQuizAnswers([]);
  }, []);

  const isLoading = appState === 'analyzing';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title section */}
        {appState === 'idle' && (
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              나와 닮은 <span className="gradient-text">드라마 캐릭터</span>는?
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
              넷플릭스 인기 드라마 속 캐릭터 중 나와 가장 닮은 캐릭터를 찾아보세요!
            </p>
          </div>
        )}

        {/* Mode selection */}
        {appState === 'idle' && (
          <>
            <ModeSelector onSelectMode={handleModeSelect} />
            <div className="mt-8 text-center">
              <button
                onClick={handleOpenGallery}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                캐릭터 도감 보기
              </button>
            </div>
          </>
        )}

        {/* Gallery view */}
        {appState === 'gallery' && (
          <GalleryView
            onSelectCharacter={handleSelectCharacter}
            onBack={handleReset}
          />
        )}

        {/* Character detail */}
        {appState === 'characterDetail' && selectedCharacter && (
          <CharacterDetail
            character={selectedCharacter}
            onBack={handleBackToGallery}
            onStartQuiz={handleStartQuizFromDetail}
          />
        )}

        {/* File upload (chat mode) */}
        {appState === 'parsing' && selectedMode === 'chat' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                카카오톡 대화 분석
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                대화 스타일을 분석해서 닮은 캐릭터를 찾아드려요
              </p>
            </div>
            <FileUploader onFileSelect={handleFileSelect} />
            <button
              onClick={handleReset}
              className="mt-6 w-full py-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors text-sm"
            >
              뒤로 가기
            </button>
          </div>
        )}

        {/* Target selection */}
        {appState === 'selectTarget' && parsedChat && (
          <TargetSelector
            parsedChat={parsedChat}
            onSelectTarget={handleSelectTarget}
            onCancel={handleBackToUpload}
          />
        )}

        {/* Tier selection */}
        {appState === 'tierSelection' && targetName && (
          <TierSelector
            targetName={targetName}
            onSelectTier={handleSelectTier}
            onCancel={handleBackToTargetSelect}
          />
        )}

        {/* Quiz mode */}
        {appState === 'quiz' && (
          <div>
            <QuizProgress
              current={currentQuestionIndex + 1}
              total={quizQuestions.length}
            />
            <QuizQuestion
              question={quizQuestions[currentQuestionIndex]}
              onAnswer={handleQuizAnswer}
              onBack={handleQuizBack}
              questionNumber={currentQuestionIndex + 1}
              canGoBack={currentQuestionIndex > 0}
            />
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                <span className="text-4xl pulse-icon">🎬</span>
              </div>
              <div className="absolute inset-0 rounded-full bg-red-500/30 pulse-ring" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {selectedMode === 'chat' ? `${targetName}님의 캐릭터를 찾고 있어요...` : '캐릭터를 찾고 있어요...'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">잠시만 기다려주세요</p>
            </div>
          </div>
        )}

        {/* Result */}
        {appState === 'result' && result && (
          <CharacterResult result={result} onReset={handleReset} />
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
          className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
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
