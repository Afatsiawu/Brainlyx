import { motion } from 'framer-motion';
import { ArrowRight, Brain, Play, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { TiltCard, AutoRotating3D } from './ThreeDElements';

const Hero = () => {
  const [showDemo, setShowDemo] = useState(false);

  const scrollToId = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-accent/20 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 mb-8 shadow-sm hover:shadow-md transition-shadow cursor-default"
        >
          <span className="flex h-2 w-2 rounded-full bg-success"></span>
          <span className="text-sm font-medium text-textSecondary">New: AI Study Planner is live</span>
          <ArrowRight className="h-4 w-4 text-textSecondary" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-text mb-6"
        >
          Master your studies with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
            AI-Powered Intelligence
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-textSecondary mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Brainlyx transforms your learning experience with smart document analysis, 
          real-time lecture recording, and personalized study plans.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => scrollToId('waitlist')}
            className="group relative px-8 py-4 bg-primary text-white rounded-2xl font-semibold shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all overflow-hidden w-full sm:w-auto"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
            <span className="flex items-center justify-center gap-2">
              Start Learning Free
              <Sparkles className="h-5 w-5" />
            </span>
          </button>
          
          <button
            onClick={() => setShowDemo(true)}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-text border border-gray-200 rounded-2xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all w-full sm:w-auto group"
          >
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Play className="h-4 w-4 fill-current" />
            </div>
            Watch Demo
          </button>
        </motion.div>

        {/* 3D AI core that slowly orbits */}
        <AutoRotating3D className="relative mx-auto mt-16 h-52 w-52 md:h-64 md:w-64" duration={16}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-36 w-36 md:h-48 md:w-48 animate-pulse rounded-full bg-gradient-to-br from-primary via-secondary to-accent shadow-2xl shadow-primary/40" />
            <div className="absolute h-48 w-48 rounded-full border border-white/40" />
            <div className="absolute flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          {/* Orbiting satellites */}
          <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full bg-secondary shadow-lg" />
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-lg" />
          <div className="absolute left-1/2 bottom-0 h-4 w-4 -translate-x-1/2 rounded-full bg-primary shadow-lg" />
        </AutoRotating3D>

        {/* 3D mockup that tilts towards the pointer */}
        <TiltCard
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 relative mx-auto max-w-5xl"
        >
          <div className="relative rounded-3xl bg-gray-900 p-2 shadow-2xl ring-1 ring-gray-900/10">
            <div className="relative rounded-2xl bg-gray-800/50 backdrop-blur aspect-[16/9] overflow-hidden flex items-center justify-center border border-white/10">
              <div className="text-gray-500 font-medium">App Interface Mockup / Screenshot</div>
              {/* You can replace this with an actual screenshot later */}
            </div>
          </div>

          {/* Floating cards */}
          <TiltCard className="absolute -left-12 top-1/3 p-4 bg-white rounded-2xl shadow-xl border border-gray-100 hidden lg:block">
            <div className="animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold">A+</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-text">Physics Exam</div>
                  <div className="text-xs text-textSecondary">You crushed it!</div>
                </div>
              </div>
            </div>
          </TiltCard>

          <TiltCard className="absolute -right-8 bottom-1/4 p-4 bg-white rounded-2xl shadow-xl border border-gray-100 hidden lg:block">
            <div className="animate-float-delayed">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-text">Study Plan Generated</div>
                  <div className="text-xs text-textSecondary">Just now</div>
                </div>
              </div>
            </div>
          </TiltCard>
        </TiltCard>
      </div>

      {/* Demo modal */}
      {showDemo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowDemo(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="relative w-full max-w-4xl rounded-3xl bg-gray-900 p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowDemo(false)}
              aria-label="Close demo"
              className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-white text-text shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="rounded-2xl bg-gray-800/50 backdrop-blur aspect-video overflow-hidden flex flex-col items-center justify-center border border-white/10 gap-4">
              <Brain className="h-16 w-16 text-white/80" />
              <div className="text-white font-semibold text-lg">Brainlyx — Product Demo</div>
              <div className="text-gray-400 text-sm max-w-md text-center px-6">
                Full walkthrough video coming soon. In the meantime, join the waitlist below and be the first to try it.
              </div>
              <button
                onClick={() => {
                  setShowDemo(false);
                  setTimeout(() => scrollToId('waitlist'), 150);
                }}
                className="mt-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-primary/30 hover:bg-opacity-90 transition-all"
              >
                Join the Waitlist
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Hero;
