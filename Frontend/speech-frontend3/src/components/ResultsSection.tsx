"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database } from "lucide-react"
import type { EmotionResult } from "../App"

interface ResultsSectionProps {
  result: EmotionResult
}

const emotionConfig: Record<string, { emoji: string; color: string; bgColor: string; description: string }> = {
  neutral: {
    emoji: "😐",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
    description: "Balanced and composed emotional state",
  },
  calm: { emoji: "😌", color: "text-teal-700", bgColor: "bg-teal-100", description: "Peaceful and relaxed demeanor" },
  happy: {
    emoji: "😄",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
    description: "Joyful and positive energy detected",
  },
  sad: {
    emoji: "😢",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    description: "Melancholy and low emotional energy",
  },
  angry: {
    emoji: "😡",
    color: "text-red-700",
    bgColor: "bg-red-100",
    description: "Intense frustration and high arousal",
  },
  fearful: {
    emoji: "😱",
    color: "text-indigo-700",
    bgColor: "bg-indigo-100",
    description: "Anxiety and apprehensive state",
  },
  disgust: {
    emoji: "🤢",
    color: "text-green-700",
    bgColor: "bg-green-100",
    description: "Aversion and displeasure detected",
  },
  surprised: {
    emoji: "😲",
    color: "text-orange-700",
    bgColor: "bg-orange-100",
    description: "Shock and unexpected reaction",
  },
  fear: { emoji: "😨", color: "text-purple-700", bgColor: "bg-purple-100", description: "Worried and anxious state" },
  anger: {
    emoji: "😠",
    color: "text-red-700",
    bgColor: "bg-red-100",
    description: "Strong frustration and irritation",
  },
  boredom: {
    emoji: "🥱",
    color: "text-sky-700",
    bgColor: "bg-sky-100",
    description: "Disinterested and low engagement",
  },
}

export default function ResultsSection({ result }: ResultsSectionProps) {
  const config = emotionConfig[result.emotion] || emotionConfig.neutral

  // const getConfidenceLevel = (confidence: number) => {
  //   if (confidence >= 90) return { level: "Excellent", color: "text-green-600", bgColor: "bg-green-100" }
  //   if (confidence >= 80) return { level: "Very Good", color: "text-blue-600", bgColor: "bg-blue-100" }
  //   if (confidence >= 70) return { level: "Good", color: "text-yellow-600", bgColor: "bg-yellow-100" }
  //   return { level: "Fair", color: "text-orange-600", bgColor: "bg-orange-100" }
  // }

  // const confidenceLevel = getConfidenceLevel(result.confidence)

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Analysis Complete! 🎉</h2>
          <p className="text-xl text-gray-600">Here's what our AI detected in your voice</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Result Card */}
          <Card
            className={`${config.bgColor} border-2 border-opacity-50 shadow-2xl mb-8 animate-in slide-in-from-bottom-8 duration-700`}
          >
            <CardContent className="p-12 text-center">
              <div className="text-8xl mb-6 animate-in zoom-in-50 duration-1000 delay-300">{config.emoji}</div>

              <h3
                className={`text-5xl font-bold mb-4 capitalize ${config.color} animate-in fade-in duration-700 delay-500`}
              >
                {result.emotion}
              </h3>

              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-in fade-in duration-700 delay-700">
                {config.description}
              </p>

              <div className="flex flex-wrap justify-center gap-4 animate-in fade-in duration-700 delay-1000">
                {/* <div className={`flex items-center gap-2 px-6 py-3 ${confidenceLevel.bgColor} rounded-full`}>
                  <Trophy className={`w-5 h-5 ${confidenceLevel.color}`} />
                  <span className={`font-bold ${confidenceLevel.color}`}>{result.confidence}% Confidence</span>
                  <span className={`text-sm ${confidenceLevel.color}`}>({confidenceLevel.level})</span>
                </div> */}

                <div className="flex items-center gap-2 px-6 py-3 bg-purple-100 rounded-full">
                  <Database className="w-5 h-5 text-purple-600" />
                  <span className="font-bold text-purple-600">{result.dataset} Model</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <div className=" md:grid-cols-3 gap-6 mb-8 flex flex-col md:flex-row items-center justify-evenly">
            {/* <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <Target className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h4 className="text-xl font-bold text-gray-800 mb-2">Accuracy</h4>
                <p className="text-3xl font-bold text-blue-600 mb-2">{result.confidence}%</p>
                <p className="text-sm text-gray-600">Detection confidence level</p>
              </CardContent>
            </Card> */}

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <Database className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <h4 className="text-xl font-bold text-gray-800 mb-2">Model Used</h4>
                <p className="text-lg font-bold text-purple-600 mb-2">{result.dataset}</p>
                <p className="text-sm text-gray-600">AI training dataset</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">{config.emoji}</div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">Emotion</h4>
                <p className={`text-lg font-bold mb-2 capitalize ${config.color}`}>{result.emotion}</p>
                <p className="text-sm text-gray-600">Primary detected state</p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="text-center">
            <Button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105"
              size="lg"
            >
              Analyze Another Recording
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
