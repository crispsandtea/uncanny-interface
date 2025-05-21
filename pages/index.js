import dynamic from "next/dynamic";
import UncannyBackground from "../components/UncannyBackground";

const HallucinationInterface = dynamic(
  () => import("../components/HallucinationInterface"),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="relative h-screen w-screen text-white bg-black overflow-hidden">
      <UncannyBackground />
      <HallucinationInterface />
    </main>
  );
}
