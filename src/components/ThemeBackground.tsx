export default function ThemeBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[color:var(--bg-terminal-black)]" />
      <div className="absolute inset-0 micro-grid opacity-5" />
      <div
        className="absolute inset-0 bg-drift opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(520px circle at 12% 18%, rgba(255, 95, 0, 0.18), transparent 62%), radial-gradient(560px circle at 85% 12%, rgba(0, 240, 255, 0.14), transparent 64%), radial-gradient(460px circle at 78% 82%, rgba(188, 19, 254, 0.14), transparent 66%)"
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0,0,0,0) 35%, rgba(0,0,0,0.7) 78%, rgba(0,0,0,0.92) 100%)"
        }}
      />
      <div className="absolute -left-16 top-20 h-56 w-56 border border-[color:var(--accent-electric-cyan)] opacity-25" />
      <div className="absolute -right-20 bottom-12 h-64 w-64 border border-[color:var(--accent-hot-pink)] opacity-20" />
    </div>
  );
}
