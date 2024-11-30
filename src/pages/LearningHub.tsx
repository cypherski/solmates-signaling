import React from 'react';
import { motion } from 'framer-motion';
import { Book, Play, FileText, Users, Star, Clock } from 'lucide-react';

export function LearningHub() {
  const courses = [
    {
      title: "Trading Fundamentals",
      description: "Learn the basics of crypto trading and technical analysis",
      duration: "2 hours",
      level: "Beginner",
      students: 1234,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&h=400&fit=crop"
    },
    {
      title: "DeFi Masterclass",
      description: "Deep dive into decentralized finance protocols and strategies",
      duration: "4 hours",
      level: "Intermediate",
      students: 856,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop"
    },
    {
      title: "Advanced Chart Analysis",
      description: "Master technical analysis patterns and indicators",
      duration: "3 hours",
      level: "Advanced",
      students: 642,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop"
    }
  ];

  return (
    <div className="pt-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-3xl font-bold">Learning Hub</h1>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Book className="w-5 h-5" />
            My Courses
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-purple-600/90 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </button>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                <p className="text-gray-400 mb-4">{course.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <span>{course.level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span>{course.students} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{course.rating}/5.0</span>
                  </div>
                </div>

                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 transition-colors">
                  Start Learning
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}