import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Mic, Loader2, AlertCircle, FileAudio } from "lucide-react"
import type { Dataset, EmotionResult } from "../App"

interface UploadSectionProps {
  selectedDataset: Dataset
  selectedFile: File | null
  onFileSelect: (file: File | null) => void
  onAnalyze: (result: EmotionResult | null) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

// const emotionMappings = {
//   RAVDESS: ["neutral", "calm", "happy", "sad", "angry", "fearful", "disgust", "surprised"],
//   "CREMA-D": ["disgust", "happy", "sad", "neutral", "fear", "angry"],
//   EMODB: ["anger", "boredom", "disgust", "fear", "happy", "sad", "neutral"],
// }

export default function UploadSection({
  selectedDataset,
  selectedFile,
  onFileSelect,
  onAnalyze,
  isLoading,
  setIsLoading,
}: UploadSectionProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string>("")

  const handleFileUpload = (file: File) => {
    const validTypes = ["audio/wav"]
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid audio file (.wav)")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      setError("File size must be less than 10MB")
      return
    }

    onFileSelect(file)
    setError("")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileUpload(file)
  }
const mockAnalyze = async (): Promise<EmotionResult> => {
  const formData = new FormData();
  formData.append("file", selectedFile as Blob, selectedFile?.name || "audio.wav");
  formData.append("dataset", selectedDataset);
  // Simulate API call
  try {
    const response = await fetch("http://localhost:8000/predict/", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Upload failed");
    const data = await response.json();
    console.log("Prediction:", data);
    // Adjust this according to your backend response structure
    return {
      emotion: data.emotion || "unknown",
      confidence: data.confidence || 0,
      dataset: selectedDataset,
    };
  } catch (error) {
    console.error("Error:", error);
    // Optionally handle error or rethrow
    throw error;
  }
}

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please upload an audio file first")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const result = await mockAnalyze()
      onAnalyze(result)
    } catch (err) {
      setError("Failed to analyze emotion. Please try again.")
      onAnalyze(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Analyze Your Voice</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your audio file and let our AI analyze the emotions in your voice using the {selectedDataset} model.
          </p>
        </div>

        <Card className="max-w-3xl mx-auto border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Mic className="w-6 h-6 text-purple-600" />
              Voice Analysis Studio
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {/* Dataset Display */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-blue-700">
                <span className="font-medium">Selected Model:</span>
                <span className="px-3 py-1 bg-blue-100 rounded-full font-bold">{selectedDataset}</span>
              </div>
            </div>

            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                isDragOver
                  ? "border-purple-400 bg-purple-50 scale-105"
                  : selectedFile
                    ? "border-green-400 bg-green-50"
                    : "border-gray-300 hover:border-purple-400 hover:bg-purple-50"
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragOver(true)
              }}
              onDragLeave={() => setIsDragOver(false)}
            >
              <input
                type="file"
                accept=".wav,.mp3,.m4a"
                onChange={handleFileInput}
                className="hidden"
                id="audio-upload"
              />

              {selectedFile ? (
                <div className="space-y-4">
                  <FileAudio className="w-16 h-16 mx-auto text-green-600" />
                  <div>
                    <p className="text-xl font-bold text-green-700 mb-2">✓ {selectedFile.name}</p>
                    <p className="text-gray-600">Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p className="text-sm text-gray-500 mt-2">Ready for analysis with {selectedDataset} model</p>
                  </div>
                  <Button onClick={() => onFileSelect(null)} variant="outline" size="sm">
                    Choose Different File
                  </Button>
                </div>
              ) : (
                <label htmlFor="audio-upload" className="cursor-pointer">
                  <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <p className="text-xl font-bold text-gray-700">Drop your audio file here</p>
                    <p className="text-gray-500">
                      or <span className="text-purple-600 underline">click to browse</span>
                    </p>
                    <p className="text-sm text-gray-400">Supports WAV, MP3, M4A • Max 10MB</p>
                  </div>
                </label>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Analyze Button */}
            <div className="mt-8">
              <Button
                onClick={handleAnalyze}
                disabled={!selectedFile || isLoading}
                className="w-full py-4 text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    Analyzing Emotions...
                  </>
                ) : (
                  <>🧠 Analyze Emotions</>
                )}
              </Button>
            </div>

            {isLoading && (
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-blue-700 text-sm">Processing with {selectedDataset} model...</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
