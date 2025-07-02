import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, } from "lucide-react"

export default function InstructionsSection() {
  const dos = [
    "Use clear, high-quality audio recordings",
    "Ensure recording length is at least 3-5 seconds",
    "Record in a quiet environment with minimal background noise",
    "Speak naturally and expressively",
    "Use supported formats: WAV, MP3, or M4A",
    "Maintain consistent volume levels",
    "Record at 16kHz or higher sample rate for best results",
  ]

  const donts = [
    "Don't use heavily compressed or low-quality audio",
    "Avoid recordings shorter than 2 seconds",
    "Don't record in noisy environments",
    "Avoid monotone or robotic speech",
    "Don't use unsupported file formats",
    "Avoid extremely loud or quiet recordings",
    "Don't use audio with heavy background music",
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Recording Guidelines</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Follow these best practices to ensure accurate emotion detection results. Quality audio input leads to more
            reliable analysis.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-green-700">
                <CheckCircle className="w-6 h-6" />
                Do's - Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-4">
                {dos.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-red-700">
                <XCircle className="w-6 h-6" />
                Don'ts - Avoid These
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-4">
                {donts.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-8">
  <div className="flex flex-col md:flex-row items-center gap-4">
    <div className="w-full">
      
      <h3 className="text-xl font-bold text-blue-800 mb-3 text-center"> Pro Tips for Better Results</h3>
      <div className="grid md:grid-cols-2 gap-4 text-blue-700 justify-items-center text-center">
        <div>
          <h4 className="font-semibold mb-2">📱 Mobile Recording:</h4>
          <p className="text-sm">Hold phone 6-8 inches from mouth, use voice memo apps</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">🎤 Professional Setup:</h4>
          <p className="text-sm">Use external microphone for studio-quality results</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">🎭 Expression:</h4>
          <p className="text-sm">Exaggerate emotions slightly for better detection</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">⏱️ Duration:</h4>
          <p className="text-sm">5-10 second clips provide optimal analysis</p>
        </div>
      </div>
    </div>
  </div>
</CardContent>
        </Card>
      </div>
    </section>
  )
}
