interface LoadingIndicatorProps {
  className?: string;
}

export default function LoadingIndicator({
  className = "",
}: LoadingIndicatorProps) {
  return (
    <div className={`flex gap-4 mb-6 ${className}`}>
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-2xl">
        🤖
      </div>
      <div className="bg-gray-50 px-5 py-4 rounded-[18px_18px_18px_4px]">
        <div className="flex gap-1 py-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
