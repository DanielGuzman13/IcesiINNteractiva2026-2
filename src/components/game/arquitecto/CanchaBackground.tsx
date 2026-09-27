interface CanchaBackgroundProps {
  children: React.ReactNode;
}

export default function CanchaBackground({ children }: CanchaBackgroundProps) {
  return (
    <div className="relative h-full min-h-[500px] w-full overflow-hidden rounded-2xl">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, #237a3c 0%, #2b8a43 55%, #1f8f45 100%)",
        }}
      >
        <div className="absolute inset-0 flex">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={`h-full flex-1 ${i % 2 === 0 ? "bg-white/5" : "bg-transparent"}`}
            />
          ))}
        </div>

        <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-white/60" />
        <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white/60" />
        <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90" />

        <div className="absolute left-0 top-1/2 h-[60%] w-[15%] -translate-y-1/2 border-b-4 border-r-4 border-t-4 border-white/60" />
        <div className="absolute right-0 top-1/2 h-[60%] w-[15%] -translate-y-1/2 border-b-4 border-l-4 border-t-4 border-white/60" />

        <div className="absolute left-0 top-1/2 h-[35%] w-[7%] -translate-y-1/2 border-b-4 border-r-4 border-t-4 border-white/60" />
        <div className="absolute right-0 top-1/2 h-[35%] w-[7%] -translate-y-1/2 border-b-4 border-l-4 border-t-4 border-white/60" />
      </div>

      <div className="relative z-10 h-full w-full p-3">
        <div className="h-full max-h-full w-full min-h-[480px] overflow-auto rounded-xl bg-white/85 p-3 shadow-xl backdrop-blur-sm sm:p-4">
          {children}
        </div>
      </div>
    </div>
  );
}