export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-simpsons-pink animate-bounce" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl">🍩</span>
        </div>
      </div>
      <p className="mt-4 font-heading text-lg text-muted-foreground animate-pulse">
        Loading...
      </p>
    </div>
  );
}
