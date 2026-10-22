import Features from './components/Features';
import Footer from './components/Footer';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Navbar from './components/Navbar';
import Testimonials from './components/Testimonials';
import Waitlist from './components/Waitlist';
import { TiltCard } from './components/ThreeDElements';
import { Routes, Route } from 'react-router-dom';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';

function App() {
  return (
    <div id="top" className="min-h-screen bg-background font-sans text-text selection:bg-primary/20 selection:text-primary">
      <Routes>
        <Route path="/" element={
          <>
            <Navbar />
            <main>
              <Hero />
              <Features />
              <HowItWorks />
              <Testimonials />
              <Waitlist />
              {/* Final CTA */}
              <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                  <h2 className="text-3xl font-extrabold mb-6">Ready to transform your learning?</h2>
                  <TiltCard className="inline-block">
                    <button
                      onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
                      className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
                    >
                      Join Brainlyx Today
                    </button>
                  </TiltCard>
                </div>
              </section>
            </main>
            <Footer />
          </>
        } />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookies" element={<CookiePolicy />} />
      </Routes>
    </div>
  );
}

export default App;
