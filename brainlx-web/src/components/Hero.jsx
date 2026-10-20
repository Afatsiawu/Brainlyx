import { motion } from 'framer-motion';
import { ArrowRight, Brain, Play, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { ClayButton, ClayCard, ClayChip } from './ClayElements';
import { TiltCard, AutoRotating3D } from './ThreeDElements';

const Hero = () => {
  const [showDemo, setShowDemo] = useState(false);

  const scrollToId = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative pt-28 sm:pt-36 pb-20 lg:pb-32 overflow-hidden">
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
          className="clay-chip inline-flex items-center gap-2 rounded-full px-5 py-2.5 mb-8"
        >
          <span className="flex h-2.5 w-2.5 rounded-full bg-success shadow-inner"></span>
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
          <ClayButton
            variant="primary"
            onClick={() => scrollToId('waitlist')}
            className="group relative px-8 py-4 rounded-2xl font-semibold overflow-hidden w-full sm:w-auto"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Start Learning Free
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer" />
          </ClayButton>
          
          <ClayButton
            variant="white"
            onClick={() => setShowDemo(true)}
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold w-full sm:w-auto"
          >
            <ClayChip variant="primary" className="rounded-full p-1.5">
              <Play className="h-3.5 w-3.5 fill-current text-primary" />
            </ClayChip>
            Watch Demo
          </ClayButton>
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
          <div className="clay rounded-[2.5rem] p-3 sm:p-4">
            <div className="rounded-[1.75rem] bg-gray-900 aspect-[16/9] overflow-hidden flex items-center justify-center border border-white/5">
              <div className="text-gray-500 font-medium">App Interface Mockup / Screenshot</div>
              {/* You can replace this with an actual screenshot later */}
            </div>
          </div>

          {/* Floating cards */}
          <ClayCard className="absolute -left-12 top-1/3 p-4 hidden lg:block max-w-[210px]">
            <div className="animate-float">
              <div className="flex items-center gap-3">
                <ClayChip variant="success" className="rounded-full w-10 h-10 flex items-center justify-center text-sm">
                  <span className="text-success font-bold">A+</span>
                </ClayChip>
                <div>
                  <div className="text-sm font-semibold text-text">Physics Exam</div>
                  <div className="text-xs text-textSecondary">You crushed it!</div>
                </div>
              </div>
            </div>
          </ClayCard>

          <ClayCard className="absolute -right-8 bottom-1/4 p-4 hidden lg:block max-w-[210px]">
            <div className="animate-float-delayed">
              <div className="flex items-center gap-3">
                <ClayChip variant="primary" className="rounded-full w-10 h-10 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-primary" />
                </ClayChip>
                <div>
                  <div className="text-sm font-semibold text-text">Study Plan Generated</div>
                  <div className="text-xs text-textSecondary">Just now</div>
                </div>
              </div>
            </div>
          </ClayCard>
        </TiltCard>
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
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-secondary to-accent shadow-2xl shadow-primary/40 flex items-center justify-center animate-pulse">
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
