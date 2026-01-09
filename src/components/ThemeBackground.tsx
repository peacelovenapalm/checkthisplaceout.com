export default function ThemeBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[color:var(--bg-void)]" />
      <div className="absolute inset-0 micro-grid opacity-50" />
      <div
        className="absolute inset-0 bg-drift opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(520px circle at 15% 20%, rgba(0, 255, 194, 0.15), transparent 60%), radial-gradient(480px circle at 85% 10%, rgba(189, 0, 255, 0.16), transparent 65%), radial-gradient(420px circle at 80% 80%, rgba(255, 108, 17, 0.15), transparent 65%)"
        }}
      />
      <div className="absolute inset-0 scanlines opacity-60" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0,0,0,0) 35%, rgba(0,0,0,0.7) 78%, rgba(0,0,0,0.92) 100%)"
        }}
      />
      <div className="absolute -left-20 top-16 h-60 w-60 border border-[color:var(--color-cyan)] opacity-25" />
      <div className="absolute -right-24 bottom-10 h-72 w-72 border border-[color:var(--color-violet)] opacity-20" />
    </div>
  );
}
