import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Dataset } from "@/App"

interface EmotionCardsProps {
  selectedDataset: Dataset
  onDatasetChange: (dataset: Dataset) => void
}

const emotionData = {
  RAVDESS: {
    emotions: [
      { name: "neutral", emoji: "😐", color: "bg-gray-100 border-gray-300", description: "Balanced emotional state" },
      { name: "calm", emoji: "😌", color: "bg-teal-100 border-teal-300", description: "Peaceful and relaxed" },
      { name: "happy", emoji: "😄", color: "bg-yellow-100 border-yellow-300", description: "Joyful and positive" },
      { name: "sad", emoji: "😢", color: "bg-blue-100 border-blue-300", description: "Melancholy and low energy" },
      { name: "angry", emoji: "😡", color: "bg-red-100 border-red-300", description: "Frustrated and intense" },
      {
        name: "fearful",
        emoji: "😱",
        color: "bg-indigo-100 border-indigo-300",
        description: "Anxious and apprehensive",
      },
      { name: "disgust", emoji: "🤢", color: "bg-green-100 border-green-300", description: "Aversion and displeasure" },
      {
        name: "surprised",
        emoji: "😲",
        color: "bg-orange-100 border-orange-300",
        description: "Shocked and unexpected",
      },
    ],
  },
  "CREMA-D": {
    emotions: [
      { name: "disgust", emoji: "🤢", color: "bg-green-100 border-green-300", description: "Aversion and displeasure" },
      { name: "happy", emoji: "😄", color: "bg-yellow-100 border-yellow-300", description: "Joyful and positive" },
      { name: "sad", emoji: "😢", color: "bg-blue-100 border-blue-300", description: "Melancholy and low energy" },
      { name: "neutral", emoji: "😐", color: "bg-gray-100 border-gray-300", description: "Balanced emotional state" },
      { name: "fear", emoji: "😨", color: "bg-purple-100 border-purple-300", description: "Anxious and worried" },
      { name: "angry", emoji: "😡", color: "bg-red-100 border-red-300", description: "Frustrated and intense" },
    ],
  },
  EMODB: {
    emotions: [
      { name: "anger", emoji: "😠", color: "bg-red-100 border-red-300", description: "Intense frustration" },
      { name: "boredom", emoji: "🥱", color: "bg-sky-100 border-sky-300", description: "Disinterested and tired" },
      { name: "disgust", emoji: "🤢", color: "bg-green-100 border-green-300", description: "Aversion and displeasure" },
      { name: "fear", emoji: "😨", color: "bg-purple-100 border-purple-300", description: "Anxious and worried" },
      { name: "happy", emoji: "😄", color: "bg-yellow-100 border-yellow-300", description: "Joyful and positive" },
      { name: "sad", emoji: "😢", color: "bg-blue-100 border-blue-300", description: "Melancholy and low energy" },
      { name: "neutral", emoji: "😐", color: "bg-gray-100 border-gray-300", description: "Balanced emotional state" },
    ],
  },
}

export default function EmotionCards({ selectedDataset, onDatasetChange }: EmotionCardsProps) {
  const currentEmotions = emotionData[selectedDataset].emotions

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Detectable Emotions</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Each dataset specializes in detecting different emotional states. Select a dataset to see which emotions it
            can identify.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {(["RAVDESS", "CREMA-D", "EMODB"] as Dataset[]).map((dataset) => (
              <Button
                key={dataset}
                onClick={() => onDatasetChange(dataset)}
                variant={selectedDataset === dataset ? "default" : "outline"}
                className={`px-6 py-3 text-lg font-medium transition-all duration-300 ${
                  selectedDataset === dataset
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                    : "hover:bg-gray-100"
                }`}
              >
                {dataset}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentEmotions.map((emotion, index) => (
            <Card
              key={emotion.name}
              className={`${emotion.color} border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in-50 slide-in-from-bottom-4`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">{emotion.emoji}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 capitalize">{emotion.name}</h3>
                <p className="text-sm text-gray-600">{emotion.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 rounded-full border border-blue-200">
            <span className="text-blue-600 font-medium">
              {selectedDataset} can detect {currentEmotions.length} different emotions
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
