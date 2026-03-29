/**
 * AmbientBackground — static subtle gradient treatment.
 * No animated orbs. No infinite animations. No client-side JS needed.
 */
export function AmbientBackground() {
  return (
    <div className="absolute inset-0 z-[-1] overflow-hidden bg-navy select-none">
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Navy wash */}
      <div className="absolute inset-0 bg-linear-to-b from-navy/30 via-navy/80 to-navy" />

      {/* Static central glow — trust blue */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[70vw] h-[40vw] rounded-[100%] bg-trust/[0.07] blur-[120px] pointer-events-none" />

      {/* Static subtle gold accent */}
      <div className="absolute top-[30%] left-[-5%] w-[30vw] h-[30vw] rounded-full bg-gold/[0.04] blur-[100px] pointer-events-none" />
    </div>
  );
}
