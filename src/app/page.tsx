"use client";

import { useState } from "react";
import WebcamCapture from "./components/WebcamCapture";

export default function Home() {
  const [isFlashing, setIsFlashing] = useState(false);

  return (
    <div className="relative flex flex-col items-center min-h-screen p-4 bg-[#201f1f]">
      {/* Flash Overlay */}
      {isFlashing && (
        <div className="absolute inset-0 bg-white opacity-80 animate-pulse z-50 pointer-events-none" />
      )}

      <span className="text-4xl font-semibold mb-4 text-white">Still</span>
      <div className="flex flex-row items-center mt-4 gap-4">
        <WebcamCapture setIsFlashing={setIsFlashing} />
      </div>
    </div>
  );
}
