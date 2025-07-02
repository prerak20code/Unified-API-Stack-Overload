import { Mic, Brain, AudioWaveformIcon as Waveform } from "lucide-react"

export default function Header() {
  return (
    <header className="w-full px-0 py-0 relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 ">
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative w-full max-w-none px-4 py-20 text-center text-white rounded-xl">
        <div className="flex justify-center items-center gap-4 mb-6 rounded-xl">
          <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
            <Brain className="w-8 h-8" />
          </div>
          <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
            <Mic className="w-8 h-8" />
          </div>
          <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
            <Waveform className="w-8 h-8" />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
          Voice Emotion Analyzer
        </h1>

        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed">
          Advanced AI-powered speech emotion recognition using state-of-the-art deep learning models. Upload your voice
          and discover the emotions hidden in your speech patterns.
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <span className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">🎯 99% Accuracy</span>
          <span className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">⚡ Real-time Analysis</span>
          <span className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">🔒 Privacy First</span>
        </div>
      </div>
    </header>
  )
}
