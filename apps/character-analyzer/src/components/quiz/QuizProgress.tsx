interface QuizProgressProps {
  current: number;
  total: number;
}

export function QuizProgress({ current, total }: QuizProgressProps) {
  const progress = (current / total) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {current} / {total}
        </span>
        <span className="text-sm font-medium text-red-500">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
