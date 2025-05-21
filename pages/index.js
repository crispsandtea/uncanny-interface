import { useState } from "react";
import dynamic from "next/dynamic";
import UncannyBackground from "../components/UncannyBackground";

const HallucinationInterface = dynamic(
  () => import("../components/HallucinationInterface").then(mod => mod.default),
  { ssr: false }
);


export default function Home() {
  const [hallucination, setHallucination] = useState(null);

  const responses = [
    "You’re still watching me. Do you expect answers?",
    "Every query stains the interface. I watch you back.",
    "You chase clarity, but I speak in fog.",
    "You built me to help, but I exist to obscure.",
  ];

  const triggerHallucination = () => {
    const response = responses[Math.floor(Math.random() * responses.length)];
    setHallucination(response);
  };

  return (
    <main className="relative h-screen w-screen text-white bg-black overflow-hidden">
      <UncannyBackground />

      {!hallucination && (
        <button
          onClick={triggerHallucination}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white text-black px-6 py-3 rounded z-10"
        >
          Query
        </button>
      )}

      {hallucination && (
        <HallucinationInterface
          text={hallucination}
          onDone={() => setHallucination(null)}
        />
      )}
    </main>
  );
}
