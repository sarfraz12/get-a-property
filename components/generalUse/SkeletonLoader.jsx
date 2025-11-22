export default function SkeletonLoader({ lines = 3, className = "" }) {
  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      {[...Array(lines)].map((_, index) => (
        <div
          key={index}
          className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"
        ></div>
      ))}
    </div>
  );
}