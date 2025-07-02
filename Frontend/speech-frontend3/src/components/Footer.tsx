import { Heart, Github, Twitter, Mail } from "lucide-react"

export default function Footer() {
  return (
<footer className="bg-gray-900 text-white py-16 w-full px-0">
      <div className="px-4 w-full">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Voice Emotion Analyzer</h3>
            <p className="text-gray-400 mb-4">
              Advanced AI-powered speech emotion recognition using cutting-edge deep learning models.
            </p>
            <div className="flex gap-4">
              <Github className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Mail className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Models</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white cursor-pointer transition-colors">RAVDESS</li>
              <li className="hover:text-white cursor-pointer transition-colors">CREMA-D</li>
              <li className="hover:text-white cursor-pointer transition-colors">EMODB</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white cursor-pointer transition-colors">Documentation</li>
              <li className="hover:text-white cursor-pointer transition-colors">API Reference</li>
              <li className="hover:text-white cursor-pointer transition-colors">Research Papers</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
              <li className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
              <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500" /> for advancing AI research
          </p>
          <p className="text-sm text-gray-500 mt-2">© 2024 Voice Emotion Analyzer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
