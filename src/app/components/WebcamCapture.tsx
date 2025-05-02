'use client'

import React, { useRef, useState, useCallback } from 'react'
import Webcam from 'react-webcam'

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: 'user',
}

interface WebcamCaptureProps {
  setIsFlashing: (v: boolean) => void
}

export default function WebcamCapture({ setIsFlashing }: WebcamCaptureProps) {
  const webcamRef = useRef<Webcam>(null)
  const [captures, setCaptures] = useState<(string | null)[]>([null, null, null, null])
  const [countdown, setCountdown] = useState<number | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState("none")

  const startCountdown = useCallback(() => {
    if (captures.filter(Boolean).length >= 4 || isCapturing) return
    setIsCapturing(true)

    let count = 3
    setCountdown(count)

    const interval = setInterval(() => {
      count--
      if (count === 0) {
        clearInterval(interval)
        setCountdown(null)
        flashAndCapture()
      } else {
        setCountdown(count)
      }
    }, 1000)
  }, [captures, isCapturing])

  const flashAndCapture = () => {
    setIsFlashing(true)

    setTimeout(() => {
      setIsFlashing(false)
      const imageSrc = webcamRef.current?.getScreenshot()
      if (imageSrc) {
        const nextIndex = captures.findIndex(c => c === null)
        if (nextIndex !== -1) {
          const updated = [...captures]
          updated[nextIndex] = imageSrc
          setCaptures(updated)
        }
      }
      setIsCapturing(false)
    }, 150)
  }

  const reset = () => {
    setCaptures([null, null, null, null])
    setCountdown(null)
    setIsCapturing(false)
  }

  const deleteCapture = (index: number) => {
    const updated = [...captures]
    updated[index] = null
    setCaptures(updated)
  }

  const filters = {
    none: '',
    monolog: 'grayscale',
    sepia: 'sepia',
    vintage: 'grayscale brightness-90 contrast-125',
  }
  

  return (
    <div className="flex flex-col md:flex-row gap-6">
        {/* Webcam + Countdown */}
        <div className="relative flex flex-col items-center">
            <div className={`relative flex flex-col items-center ${filters[selectedFilter as keyof typeof filters]}`}>
            <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    className="rounded-lg shadow-md"
                    mirrored={true}
                />
            </div>


            {/* Countdown Overlay */}
            {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center text-white text-6xl font-bold z-10">
                {countdown}
            </div>
            )}

            <div className="mt-4 flex gap-2">
            <button
                onClick={startCountdown}
                disabled={captures.filter(Boolean).length >= 4 || isCapturing}
                className="px-4 py-2 bg-black text-white rounded-lg disabled:opacity-40"
            >
                {captures.filter(Boolean).length >= 4 ? "Max Reached" : "Take Photo"}
            </button>
            <button
                onClick={reset}
                className="px-4 py-2 bg-gray-300 text-black rounded-lg"
            >
                Reset
            </button>
            </div>
        </div>

        <div className="flex flex-col items-center">
            <span className="text-lg font-semibold mb-2 text-white">Captured Photos</span>
            <div className="grid grid-cols-2 gap-4 h-fit">
                {captures.map((src, index) => (
                    <div key={index} className="relative w-28 h-28 bg-gray-100 border rounded-md flex items-center justify-center overflow-hidden">
                        {src ? (
                        <>
                            <img src={src} alt={`Capture ${index + 1}`} className="object-cover w-full h-full" />
                            <div className="absolute inset-0 flex p-1 hover:opacity-100 transition w-full h-full items-start justify-end md:opacity-0">
                                <button
                                    onClick={() => deleteCapture(index)}
                                    aria-label="Delete photo"
                                    className="bg-white rounded-full p-1 shadow hover:cursor-pointer">
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 30 30"
                                    className="fill-black"
                                    >
                                    <path d="M 13 3 A 1.0001 1.0001 0 0 0 11.986328 4 L 6 4 A 1.0001 1.0001 0 1 0 6 6 L 24 6 A 1.0001 1.0001 0 1 0 24 4 L 18.013672 4 A 1.0001 1.0001 0 0 0 17 3 L 13 3 z M 6 8 L 6 24 C 6 25.105 6.895 26 8 26 L 22 26 C 23.105 26 24 25.105 24 24 L 24 8 L 6 8 z" />
                                    </svg>
                                </button>
                            </div>
                        </>
                        ) : (
                        <span className="text-gray-400 text-sm">#{index+1}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}
