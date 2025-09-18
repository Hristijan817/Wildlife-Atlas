import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim"; // ✅ use slim, not full

export default function ParticleBackground() {
  const init = useCallback(async (engine) => {
    // await loadFull(engine); ❌ old
    await loadSlim(engine);   // ✅ new
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={init}
      options={{
        background: { color: { value: "transparent" } },
        particles: {
          number: { value: 40 },
          size: { value: 3 },
          move: { enable: true, speed: 1 },
        },
      }}
    />
  );
}
