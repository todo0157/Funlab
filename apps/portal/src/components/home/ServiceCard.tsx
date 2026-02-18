interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  isNew?: boolean;
  isComingSoon?: boolean;
  gradient: string;
}

export function ServiceCard({
  title,
  description,
  icon,
  href,
  isNew = false,
  isComingSoon = false,
  gradient,
}: ServiceCardProps) {
  const CardWrapper = isComingSoon ? 'div' : 'a';

  return (
    <CardWrapper
      href={isComingSoon ? undefined : href}
      className={`group relative block p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
        isComingSoon
          ? 'opacity-60 cursor-not-allowed'
          : 'hover:shadow-xl hover:-translate-y-1 cursor-pointer'
      }`}
    >
      {/* Background gradient on hover */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity ${gradient}`}
      />

      {/* Badge */}
      {(isNew || isComingSoon) && (
        <div className="absolute top-4 right-4">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              isNew
                ? 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}
          >
            {isNew ? 'NEW' : 'Coming Soon'}
          </span>
        </div>
      )}

      {/* Icon */}
      <div
        className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${gradient} text-white mb-4`}
      >
        {icon}
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{description}</p>

      {/* Arrow */}
      {!isComingSoon && (
        <div className="mt-4 flex items-center text-primary-600 dark:text-primary-400 font-medium text-sm group-hover:translate-x-1 transition-transform">
          바로가기
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      )}
    </CardWrapper>
  );
}
