import React from 'react';
import { Send, Camera, Mic, SkipForward, X, Users } from 'lucide-react';

const messages = [
  { text: "Looking at SOL's weekly chart", isUser: false },
  { text: "Volume's picking up nicely", isUser: true },
  { text: "What's your entry target?", isUser: false }
];

export function ChatPreview() {
  return (
    <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Video Section */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        {/* First Video Box */}
        <div className="aspect-video bg-[#1A1B1E] rounded-2xl overflow-hidden border border-gray-800 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-indigo-900/50" />
          <Users className="w-20 h-20 text-white/20" />
          <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-sm font-medium">KJ</span>
            </div>
            <span className="text-sm font-medium">Kai Jimenez</span>
          </div>
        </div>

        {/* Second Video Box */}
        <div className="aspect-video bg-[#1A1B1E] rounded-2xl overflow-hidden border border-gray-800 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-indigo-900/50" />
          <Users className="w-20 h-20 text-white/20" />
          <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-sm font-medium">AP</span>
            </div>
            <span className="text-sm font-medium">Aisha Patel</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-4">
          <button className="w-12 h-12 rounded-full bg-[#2A2B2E] flex items-center justify-center">
            <Camera className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 rounded-full bg-[#2A2B2E] flex items-center justify-center">
            <Mic className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
            <SkipForward className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Section */}
      <div className="lg:col-span-2">
        <div className="bg-[#1A1B1E] rounded-2xl overflow-hidden border border-gray-800 h-full flex flex-col">
          <div className="p-3 border-b border-gray-800">
            <h2 className="text-lg font-semibold">Chat</h2>
          </div>
          
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-2 ${
                    message.isUser
                      ? 'bg-purple-600 text-white'
                      : 'bg-[#2A2B2E] text-gray-200'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-gray-800 mt-auto">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-[#2A2B2E] rounded-xl px-4 py-2 text-gray-200 placeholder-gray-500 focus:outline-none"
              />
              <button className="bg-purple-600 p-2 rounded-full hover:bg-purple-700 transition-colors">
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}