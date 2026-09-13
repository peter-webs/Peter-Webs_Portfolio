import { useState, useEffect, useRef } from 'react';
import HolographicWall from './components/HolographicWall.jsx';
import FloatingDock from './components/FloatingDock.jsx';
import Hero from './components/Hero.jsx';
import TechStack from './components/TechStack.jsx';
import Projects from './components/Projects.jsx';
import SectionTransition from './components/SectionTransition.jsx';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [transitionText, setTransitionText] = useState(null);
  
  const initialLoadRef = useRef(true);
  const currentSectionRef = useRef('hero');

  // Handle Theme Toggle
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  // Intersection Observer for Scroll Tracking
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          
          if (initialLoadRef.current) return;

          if (currentSectionRef.current !== sectionId) {
            currentSectionRef.current = sectionId;
            
            const textMap = {
              hero: 'Home',
              stack: 'Stack',
              projects: 'Projects'
            };
            
            setTransitionText(textMap[sectionId]);
          }
        }
      });
    }, options);

    const sections = document.querySelectorAll('section');
    sections.forEach(sec => observer.observe(sec));

    const timeout = setTimeout(() => {
      initialLoadRef.current = false;
    }, 500);

    return () => {
      sections.forEach(sec => observer.unobserve(sec));
      clearTimeout(timeout);
    };
  }, []);

  const handleNavigate = (id, label) => {
    currentSectionRef.current = id;
    setTransitionText(label);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="h-screen w-full text-text relative overflow-hidden bg-background transition-colors duration-500">

      {/* Interstitial Animation Overlay */}
      {transitionText && (
        <SectionTransition 
          text={transitionText} 
          isDark={isDark} 
          onComplete={() => setTransitionText(null)} 
        />
      )}

      {/* Background Canvas */}
      <HolographicWall radius={250} intensity={1} isDark={isDark} />

      {/* Scroll Container */}
      <div className="relative z-10 h-screen w-full overflow-y-scroll overflow-x-hidden snap-y snap-mandatory scroll-smooth">

        <section id="hero" className="h-screen w-full snap-start flex flex-col justify-center">
          <Hero isDark={isDark} />
        </section>

        <section id="stack" className="min-h-screen w-full snap-start flex flex-col justify-center">
          <TechStack isDark={isDark} />
        </section>

        <section id="projects" className="min-h-screen w-full snap-start flex flex-col justify-center">
          <Projects isDark={isDark} />
        </section>

      </div>

      {/* Floating Dock */}
      <div className="fixed bottom-6 left-0 w-full z-50 pointer-events-none flex justify-center">
        <div className="pointer-events-auto">
          <FloatingDock isDark={isDark} toggleTheme={toggleTheme} onNavigate={handleNavigate} />
        </div>
      </div>

    </div>
  );
}