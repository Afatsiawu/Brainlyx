import Features from './components/Features';
import Footer from './components/Footer';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Navbar from './components/Navbar';
import Testimonials from './components/Testimonials';
import Waitlist from './components/Waitlist';
import { TiltCard } from './components/ThreeDElements';

function App() {
  return (
    <div id="top" className="min-h-screen bg-background font-sans text-text selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Waitlist />
        {/* Final CTA */}
        <section className="py-24 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Ready to transform your learning?
            </h2>
            <p className="text-lg text-textSecondary mb-8 max-w-2xl mx-auto">
              Join thousands of students already studying smarter with Brainlyx.
            </p>
            <TiltCard className="inline-block">
              <button
                onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-primary text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all"
              >
                Join Brainlyx Today
              </button>
            </TiltCard>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
