import { useState } from 'react';
import { motion } from 'framer-motion';
import { QuizData, QuizQuestion } from '../../types/mockexam';

interface QuizEditorProps {
  quizData: QuizData;
  onSave: (updatedQuiz: QuizData) => void;
  onCancel: () => void;
}

export function QuizEditor({ quizData, onSave, onCancel }: QuizEditorProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(quizData.questions);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleQuestionChange = (index: number, field: keyof QuizQuestion, value: string | number | string[]) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    const newOptions = [...updated[questionIndex].options];
    newOptions[optionIndex] = value;
    updated[questionIndex] = { ...updated[questionIndex], options: newOptions };
    setQuestions(updated);
  };

  const handleCorrectAnswerChange = (questionIndex: number, answerIndex: number) => {
    const updated = [...questions];
    updated[questionIndex] = { ...updated[questionIndex], correctAnswer: answerIndex };
    setQuestions(updated);
  };

  const handleSave = () => {
    onSave({ ...quizData, questions });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          <span className="text-pink-500">{quizData.targetName}</span> 모의고사 편집
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          AI가 생성한 문제를 검토하고 수정하세요
        </p>
      </div>

      <div className="space-y-4">
        {questions.map((question, qIndex) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: qIndex * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="flex items-center justify-center w-8 h-8 bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 rounded-full font-bold text-sm">
                {qIndex + 1}
              </span>
              <button
                onClick={() => setEditingIndex(editingIndex === qIndex ? null : qIndex)}
                className="text-sm text-pink-500 hover:text-pink-600 font-medium"
              >
                {editingIndex === qIndex ? '완료' : '수정'}
              </button>
            </div>

            {/* Question */}
            {editingIndex === qIndex ? (
              <textarea
                value={question.question}
                onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-pink-500 dark:focus:border-pink-500 outline-none text-gray-900 dark:text-white resize-none"
                rows={2}
              />
            ) : (
              <p className="text-gray-900 dark:text-white font-medium mb-4">
                {question.question}
              </p>
            )}

            {/* Options */}
            <div className="space-y-2 mt-4">
              {question.options.map((option, oIndex) => (
                <div
                  key={oIndex}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    question.correctAnswer === oIndex
                      ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700'
                      : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent'
                  }`}
                >
                  <button
                    onClick={() => handleCorrectAnswerChange(qIndex, oIndex)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      question.correctAnswer === oIndex
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 dark:border-gray-500'
                    }`}
                  >
                    {question.correctAnswer === oIndex && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  {editingIndex === qIndex ? (
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white"
                    />
                  ) : (
                    <span className="text-gray-700 dark:text-gray-300">{option}</span>
                  )}

                  {question.correctAnswer === oIndex && (
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                      정답
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <motion.button
          onClick={handleSave}
          className="flex-1 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          저장하고 공유하기
        </motion.button>
        <button
          onClick={onCancel}
          className="py-4 px-6 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          다시 생성
        </button>
      </div>
    </motion.div>
  );
}
