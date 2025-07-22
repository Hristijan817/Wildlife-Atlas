// components/ParticleBackground.jsx
import { useCallback } from "react";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";

export default function ParticleBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="absolute inset-0 z-0"
      options={{
        fullScreen: false,
        background: { color: { value: "transparent" } },
        particles: {
          number: { value: 30 },
          color: { value: "#4ade80" },
          shape: { type: "circle" },
          opacity: { value: 0.3 },
          size: { value: { min: 2, max: 4 } },
          move: { enable: true, speed: 1, direction: "none", random: true },
        },
      }}
    />
  );
}
