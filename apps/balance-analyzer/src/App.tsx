import { useEffect, useReducer } from 'react';
import { Header } from './components/layout/Header';
import { FileUploader } from './components/upload/FileUploader';
import { TargetSelector } from './components/upload/TargetSelector';
import { TierSelector } from './components/tier/TierSelector';
import { AnalyzingView } from './components/game/AnalyzingView';
import { GamePreview } from './components/game/GamePreview';
import { GamePlay } from './components/game/GamePlay';
import { GameResult } from './components/result/GameResult';
import { generateBalanceGame, getGameDataFromUrl, getShareUrl } from './services/analysisService';
import type { AnalysisState, ParsedChat, TierType, BalanceGameData, GameResult as GameResultType } from './types/balance';

type Action =
  | { type: 'SET_PARSED_CHAT'; payload: ParsedChat }
  | { type: 'SELECT_TARGET'; payload: string }
  | { type: 'SELECT_TIER'; payload: TierType }
  | { type: 'SET_GAME_DATA'; payload: BalanceGameData }
  | { type: 'SET_GAME_RESULT'; payload: GameResultType }
  | { type: 'START_PLAY' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'GO_BACK' }
  | { type: 'RESET' }
  | { type: 'LOAD_SHARED_GAME'; payload: BalanceGameData };

const initialState: AnalysisState = {
  step: 'upload',
  parsedChat: null,
  selectedTarget: null,
  tier: 'free',
  gameData: null,
  gameResult: null,
  error: null,
};

function reducer(state: AnalysisState, action: Action): AnalysisState {
  switch (action.type) {
    case 'SET_PARSED_CHAT':
      return { ...state, step: 'select-target', parsedChat: action.payload, error: null };
    case 'SELECT_TARGET':
      return { ...state, step: 'select-tier', selectedTarget: action.payload };
    case 'SELECT_TIER':
      return { ...state, step: 'analyzing', tier: action.payload };
    case 'SET_GAME_DATA':
      return { ...state, step: 'preview', gameData: action.payload };
    case 'SET_GAME_RESULT':
      return { ...state, step: 'result', gameResult: action.payload };
    case 'START_PLAY':
      return { ...state, step: 'play', gameResult: null };
    case 'SET_ERROR':
      return { ...state, step: 'upload', error: action.payload };
    case 'GO_BACK':
      if (state.step === 'select-target') return { ...state, step: 'upload', parsedChat: null };
      if (state.step === 'select-tier') return { ...state, step: 'select-target', selectedTarget: null };
      return state;
    case 'RESET':
      return initialState;
    case 'LOAD_SHARED_GAME':
      return { ...state, step: 'play', gameData: action.payload };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // URL에서 공유된 게임 데이터 로드
  useEffect(() => {
    const sharedGame = getGameDataFromUrl();
    if (sharedGame) {
      dispatch({ type: 'LOAD_SHARED_GAME', payload: sharedGame });
    }
  }, []);

  // 분석 실행
  useEffect(() => {
    if (state.step === 'analyzing' && state.parsedChat && state.selectedTarget) {
      generateBalanceGame(state.parsedChat.messages, state.selectedTarget, state.tier)
        .then((gameData) => {
          dispatch({ type: 'SET_GAME_DATA', payload: gameData });
        })
        .catch((error) => {
          dispatch({ type: 'SET_ERROR', payload: error.message });
        });
    }
  }, [state.step, state.parsedChat, state.selectedTarget, state.tier]);

  const handleShare = () => {
    if (state.gameData) {
      const shareUrl = getShareUrl(state.gameData);
      navigator.clipboard.writeText(shareUrl);
      alert('링크가 복사되었습니다! 친구에게 공유해보세요.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {state.error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl">
            {state.error}
          </div>
        )}

        {state.step === 'upload' && (
          <FileUploader
            onParsed={(parsed) => dispatch({ type: 'SET_PARSED_CHAT', payload: parsed })}
            onError={(error) => dispatch({ type: 'SET_ERROR', payload: error })}
          />
        )}

        {state.step === 'select-target' && state.parsedChat && (
          <TargetSelector
            participants={state.parsedChat.participants}
            onSelect={(name) => dispatch({ type: 'SELECT_TARGET', payload: name })}
            onBack={() => dispatch({ type: 'GO_BACK' })}
          />
        )}

        {state.step === 'select-tier' && state.selectedTarget && (
          <TierSelector
            targetName={state.selectedTarget}
            onSelect={(tier) => dispatch({ type: 'SELECT_TIER', payload: tier })}
            onBack={() => dispatch({ type: 'GO_BACK' })}
          />
        )}

        {state.step === 'analyzing' && state.selectedTarget && (
          <AnalyzingView targetName={state.selectedTarget} />
        )}

        {state.step === 'preview' && state.gameData && (
          <GamePreview
            gameData={state.gameData}
            onShare={handleShare}
            onPlay={() => dispatch({ type: 'START_PLAY' })}
            onReset={() => dispatch({ type: 'RESET' })}
          />
        )}

        {state.step === 'play' && state.gameData && (
          <GamePlay
            gameData={state.gameData}
            onComplete={(result) => dispatch({ type: 'SET_GAME_RESULT', payload: result })}
          />
        )}

        {state.step === 'result' && state.gameData && state.gameResult && (
          <GameResult
            gameData={state.gameData}
            result={state.gameResult}
            onReplay={() => dispatch({ type: 'START_PLAY' })}
            onReset={() => dispatch({ type: 'RESET' })}
          />
        )}
      </main>

      <footer className="py-8 text-center text-gray-500 text-sm">
        <p>FunLab - AI 기반 콘텐츠 분석 서비스</p>
      </footer>
    </div>
  );
}

export default App;
