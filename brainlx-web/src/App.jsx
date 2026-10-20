import Features from './components/Features';
import Footer from './components/Footer';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Navbar from './components/Navbar';
import Testimonials from './components/Testimonials';
import Waitlist from './components/Waitlist';
import { ClayButton, ClayCard } from './components/ClayElements';

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
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <ClayCard className="py-16 px-6">
              <h2 className="text-3xl font-extrabold mb-6">Ready to transform your learning?</h2>
              <ClayButton
                variant="primary"
                onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-2xl font-bold text-lg"
              >
                Join Brainlyx Today
              </ClayButton>
            </ClayCard>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
