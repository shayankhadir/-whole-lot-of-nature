'use client';

import { motion } from 'framer-motion';
import { Youtube, Play, Users } from 'lucide-react';

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  duration: string;
  url: string;
}

export default function YouTubeChannel() {
  // Sample YouTube videos - Replace with actual API integration
  const youtubeVideos: YouTubeVideo[] = [
    {
      id: '1',
      title: 'Complete Guide to Indoor Plant Care',
      thumbnail: 'https://via.placeholder.com/320x180?text=Video+1',
      views: 15400,
      duration: '12:34',
      url: 'https://youtube.com/@wholelotofnature',
    },
    {
      id: '2',
      title: 'Best Plants for Beginners',
      thumbnail: 'https://via.placeholder.com/320x180?text=Video+2',
      views: 28900,
      duration: '8:45',
      url: 'https://youtube.com/@wholelotofnature',
    },
    {
      id: '3',
      title: 'DIY Plant Stand Tutorial',
      thumbnail: 'https://via.placeholder.com/320x180?text=Video+3',
      views: 42300,
      duration: '15:20',
      url: 'https://youtube.com/@wholelotofnature',
    },
    {
      id: '4',
      title: 'Propagation Tips & Tricks',
      thumbnail: 'https://via.placeholder.com/320x180?text=Video+4',
      views: 31200,
      duration: '10:15',
      url: 'https://youtube.com/@wholelotofnature',
    },
  ];

  return (
    <section className="py-20 bg-[var(--surface-onyx)] relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface-onyx)] via-[var(--emerald-900)]/10 to-[var(--surface-onyx)] pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Youtube className="w-10 h-10 text-red-500" />
            <h2 className="text-4xl md:text-5xl font-bold text-cream-50 antialiased">
              Our YouTube Channel
            </h2>
          </div>
          <p className="text-xl text-cream-100 max-w-2xl mx-auto antialiased">
            Learn gardening tips, plant care guides, and DIY projects from our expert videos
          </p>
          <a
            href="https://youtube.com/@wholelotofnature"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 px-8 py-3 bg-emerald-500 text-white rounded-full font-semibold hover:bg-emerald-600 transition-all hover:shadow-lg hover:scale-105"
          >
            Subscribe Now
          </a>
        </motion.div>

        {/* Videos Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {youtubeVideos.map((video, index) => (
            <motion.a
              key={video.id}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all bg-black/20 backdrop-blur-sm border border-white/10 hover:border-white/30"
            >
              {/* Thumbnail */}
              <div className="relative h-40 overflow-hidden bg-gray-800">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center backdrop-blur-md">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all opacity-80 group-hover:opacity-100"
                  >
                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                  </motion.div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white font-semibold backdrop-blur-md">
                  {video.duration}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                  {video.title}
                </h3>
                <div className="flex items-center gap-1 text-gray-300 text-xs">
                  <Users className="w-3 h-3" />
                  <span>{(video.views / 1000).toFixed(1)}K views</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Channel Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="text-center p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-white/30 transition-all">
            <p className="text-5xl font-bold text-red-500 mb-2 antialiased">50K+</p>
            <p className="text-gray-300 font-semibold">Subscribers</p>
          </div>
          <div className="text-center p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-white/30 transition-all">
            <p className="text-5xl font-bold text-red-500 mb-2 antialiased">150+</p>
            <p className="text-gray-300 font-semibold">Videos</p>
          </div>
          <div className="text-center p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-white/30 transition-all">
            <p className="text-5xl font-bold text-red-500 mb-2 antialiased">2.5M+</p>
            <p className="text-gray-300 font-semibold">Total Views</p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <a
            href="https://youtube.com/@wholelotofnature"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-[1.02]"
          >
            Watch More Videos
          </a>
        </motion.div>
      </div>
    </section>
  );
}
