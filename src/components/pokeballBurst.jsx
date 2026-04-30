import { useEffect } from "react";

function PokeballBurst({ x, y, onDone }) {
  useEffect(() => {
    const timer = setTimeout(() => onDone(), 700);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className="pokeball-burst"
      style={{ left: x, top: y }}
      aria-hidden="true"
    />
  );
}

export default PokeballBurst;