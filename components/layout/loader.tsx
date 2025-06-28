export default function Loader() {
  return (
    <div
      className="fixed inset-0 bg-background/50 backdrop-blur-sm flex justify-center items-center z-50"
      role="status"
      aria-label="Loading"
    >
      <div className="relative flex items-center justify-center w-32 h-32">
        <span className="absolute w-24 h-24 rounded-full border-4 border-primary/50 border-t-transparent animate-spin-slow"></span>
        <span className="absolute w-18 h-18 rounded-full border-2 border-primary/70 border-b-transparent animate-spin-reverse-slow"></span>
        <span className="text-base font-bold tracking-widest text-primary/80 select-none z-10">
          TravelNxt
        </span>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
