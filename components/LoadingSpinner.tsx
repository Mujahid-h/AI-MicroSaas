interface LoadingSpinnerProps {
  color?: string;
  secondaryColor?: string;
  message?: string;
  submessage?: string;
}

export default function LoadingSpinner({
  color = "#00D4AA",
  secondaryColor = "#7C3AED",
  message = "Analyzing...",
  submessage,
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-5 py-16 px-6">
      <div className="relative">
        <div
          className="w-14 h-14 rounded-full border-[3px] border-transparent animate-spin-custom"
          style={{
            borderTopColor: color,
            borderRightColor: secondaryColor,
          }}
        />
        <div
          className="absolute inset-2 rounded-full opacity-20"
          style={{ background: `radial-gradient(circle, ${color}, transparent)` }}
        />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium mb-1" style={{ color }}>
          {message}
        </p>
        {submessage && (
          <p className="text-xs opacity-50 leading-relaxed max-w-[200px]">
            {submessage}
          </p>
        )}
      </div>
    </div>
  );
}
