import Features from './components/Features';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="min-h-screen bg-background font-sans text-text selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <main>
        <Hero />
        <Features />
        {/* Placeholder for other sections like Testimonials or CTA */}
        <section className="py-20 bg-primary/5">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to transform your learning?</h2>
            <button className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all">
              Join Brainlyx Today
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
