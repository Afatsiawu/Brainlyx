import { motion } from 'framer-motion';
import { ArrowRight, Brain, Play, X } from 'lucide-react';
import { useState } from 'react';
import { ClayButton, ClayCard, ClayChip } from './ClayElements';
import { TiltCard } from './ThreeDElements';

const Hero = () => {
  const [showDemo, setShowDemo] = useState(false);

  const scrollToId = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Immersive gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/15 via-background to-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[60%] pointer-events-none">
        <div className="absolute top-10 left-[5%] w-96 h-96 bg-primary/25 rounded-full blur-3xl opacity-60 animate-blob" />
        <div className="absolute top-20 right-[5%] w-80 h-80 bg-secondary/25 rounded-full blur-3xl opacity-60 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-64 bg-accent/15 rounded-full blur-3xl opacity-50 animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="clay-chip inline-flex items-center gap-2 rounded-full px-5 py-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-success shadow-inner" />
            <span className="text-sm font-medium text-textSecondary">New: AI Study Planner is live</span>
            <ArrowRight className="h-4 w-4 text-textSecondary" />
          </div>
        </motion.div>

        {/* Title + subtitle + CTAs — split layout on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-text mb-6 leading-[0.95]">
              Master your studies with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                AI-Powered Intelligence
              </span>
            </h1>
            <p className="text-lg md:text-xl text-textSecondary mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Brainlyx transforms your learning experience with smart document analysis,
              real-time lecture recording, and personalized study plans.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <ClayButton
                variant="primary"
                onClick={() => scrollToId('waitlist')}
                className="group relative px-8 py-4 rounded-2xl font-semibold overflow-hidden w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start Learning Free
                </span>
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer" />
              </ClayButton>

              <ClayButton
                variant="white"
                onClick={() => setShowDemo(true)}
                className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold w-full sm:w-auto"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Play className="h-4 w-4 fill-current text-primary" />
                </div>
                Watch Demo
              </ClayButton>
            </div>
          </motion.div>

          {/* Clay mockup with floating cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <TiltCard className="relative rounded-[2.5rem] clay p-3 sm:p-4 shadow-2xl">
              <div className="rounded-[1.75rem] bg-gray-900 aspect-[16/9] overflow-hidden flex items-center justify-center border border-white/5">
                <div className="text-gray-500 font-medium">App Interface Mockup / Screenshot</div>
              </div>
            </TiltCard>

            <ClayCard className="absolute -left-6 -top-6 p-4 hidden lg:block max-w-[200px] animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                  <span className="text-success font-bold text-sm">A+</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-text">Physics Exam</div>
                  <div className="text-xs text-textSecondary">You crushed it!</div>
                </div>
              </div>
            </ClayCard>

            <ClayCard className="absolute -right-4 bottom-4 p-4 hidden lg:block max-w-[210px] animate-float-delayed">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-text">Study Plan Generated</div>
                  <div className="text-xs text-textSecondary">Just now</div>
                </div>
              </div>
            </ClayCard>
          </motion.div>
        </div>
      </div>

      {/* Demo modal */}
      {showDemo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-[#2B2854]/40 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowDemo(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="clay relative w-full max-w-4xl rounded-[2.5rem] p-4 sm:p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowDemo(false)}
              aria-label="Close demo"
              className="clay-chip absolute -top-3 -right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center text-text hover:brightness-95"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="rounded-[1.75rem] bg-gray-900 aspect-video overflow-hidden flex flex-col items-center justify-center gap-4 p-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-secondary to-accent shadow-2xl shadow-primary/40 flex items-center justify-center">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div className="text-white font-semibold text-lg">Brainlyx — Product Demo</div>
              <div className="text-gray-400 text-sm max-w-md text-center">
                Full walkthrough video coming soon. In the meantime, join the waitlist below and be the first to try it.
              </div>
              <ClayButton
                variant="primary"
                onClick={() => {
                  setShowDemo(false);
                  setTimeout(() => scrollToId('waitlist'), 150);
                }}
                className="mt-2 px-7 py-3.5 rounded-2xl font-semibold"
              >
                Join the Waitlist
              </ClayButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Hero;
