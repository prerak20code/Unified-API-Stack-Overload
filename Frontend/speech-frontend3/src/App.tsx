import { useState } from 'react'
import './App.css'
import Header from "@/components/Header"
import AboutSection from "@/components/AboutSection"
import EmotionCards from "@/components/EmotionCards"
import InstructionsSection from "@/components/InstructionsSection"
import UploadSection from "@/components/UploadSection"
import ResultsSection from "@/components/ResultsSection"
import Footer from "@/components/Footer"

export type Dataset = "RAVDESS" | "CREMA-D" | "EMODB"

export interface EmotionResult {
  emotion: string
  confidence: number
  dataset: Dataset
}

const emotionConfig: Record<string, { emoji: string; color: string; description: string }> = {
  happy: { emoji: "😄", color: "bg-yellow-400", description: "Detected based on vocal tone and rhythm" },
  sad: { emoji: "😢", color: "bg-blue-400", description: "Identified through vocal patterns and pitch" },
  angry: { emoji: "😡", color: "bg-red-400", description: "Recognized from intensity and vocal stress" },
  neutral: { emoji: "😐", color: "bg-gray-400", description: "Balanced emotional state detected" },
  fearful: { emoji: "😱", color: "bg-indigo-400", description: "Identified through tremor and pitch changes" },
  calm: { emoji: "😌", color: "bg-teal-400", description: "Peaceful state detected in vocal patterns" },
  disgust: { emoji: "🤢", color: "bg-green-400", description: "Detected through vocal rejection patterns" },
  surprised: { emoji: "😲", color: "bg-orange-400", description: "Sudden vocal changes indicate surprise" },
  boredom: { emoji: "🥱", color: "bg-sky-300", description: "Monotone patterns suggest disinterest" },
}

export default function HomePage() {
  const [selectedDataset, setSelectedDataset] = useState<Dataset>("RAVDESS")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [result, setResult] = useState<EmotionResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // const mockAnalyzeEmotion = async (): Promise<EmotionResult> => {
  //   // Simulate API call
  //   await new Promise((resolve) => setTimeout(resolve, 3000))

  //   const emotions = Object.keys(emotionConfig)
  //   const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]
  //   const config = emotionConfig[randomEmotion]

  //   return {
  //     emotion: randomEmotion,
  //     confidence: Math.floor(Math.random() * 20) + 80, // 80-100%
  //     dataset: selectedDataset,
  //   }
  // }

  return (
    <div className=" px-0 w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      <AboutSection />
      <EmotionCards selectedDataset={selectedDataset} onDatasetChange={setSelectedDataset} />
      <InstructionsSection />
      <UploadSection
        selectedDataset={selectedDataset}
        selectedFile={selectedFile}
        onFileSelect={setSelectedFile}
        onAnalyze={setResult}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
      {result && <ResultsSection result={result} />}
      <Footer />
    </div>
  )
}
