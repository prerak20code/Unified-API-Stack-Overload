import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Cpu, Target } from "lucide-react"

export default function AboutSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Powered by Advanced AI Models</h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Our emotion detection system leverages three cutting-edge speech emotion recognition datasets, each trained
            on thousands of hours of emotional speech data to provide accurate and reliable results.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">RAVDESS</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Ryerson Audio-Visual Database of Emotional Speech and Song. Contains 7,356 files from 24 professional
                actors.
              </p>
              <div className="text-sm text-purple-600 font-medium">8 Emotions • High Quality • Professional Actors</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Cpu className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">CREMA-D</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Crowdsourced Emotional Multimodal Actors Dataset. Features 7,442 clips from 91 actors with diverse
                backgrounds.
              </p>
              <div className="text-sm text-blue-600 font-medium">6 Emotions • Diverse Speakers • Crowdsourced</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">EMODB</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Berlin Database of Emotional Speech. German emotional speech database with 535 utterances from 10
                speakers.
              </p>
              <div className="text-sm text-green-600 font-medium">7 Emotions • German Language • Research Grade</div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 md:p-12">
          <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Upload Audio</h4>
              <p className="text-sm text-gray-600">Upload your voice recording in WAV, MP3, or M4A format</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Select Model</h4>
              <p className="text-sm text-gray-600">Choose from RAVDESS, CREMA-D, or EMODB datasets</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">AI Analysis</h4>
              <p className="text-sm text-gray-600">Our AI processes speech patterns and acoustic features</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                4
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Get Results</h4>
              <p className="text-sm text-gray-600">Receive detailed emotion analysis with confidence scores</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
