export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      {/* Coffee Cup Icon */}
      <div className="relative flex items-center justify-center">
        {/* Cup */}
        <div className="w-16 h-16 bg-amber-700 rounded-b-full relative">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-amber-900 rounded-full"></div>
        </div>

        {/* Handle */}
        <div className="absolute right-[-14px] top-6 w-6 h-6 border-4 border-amber-700 rounded-full"></div>

        {/* Steam Animation */}
        <div className="absolute -top-8 flex flex-col gap-2">
          <span className="block w-2 h-6 bg-gradient-to-b from-amber-400 to-transparent rounded-full animate-bounce"></span>
          <span className="block w-2 h-6 bg-gradient-to-b from-amber-500 to-transparent rounded-full animate-[bounce_1s_infinite_0.3s]"></span>
          <span className="block w-2 h-6 bg-gradient-to-b from-amber-600 to-transparent rounded-full animate-[bounce_1s_infinite_0.6s]"></span>
        </div>
      </div>

      {/* Text */}
      <p className="mt-8 text-lg font-semibold text-amber-800 animate-pulse">
        Brewing your coffee...
      </p>
    </div>
  );
}
