import { useState, useRef, useEffect } from 'react';
import { Home, Layers, FolderKanban, FileText, Mail, Moon, Sun, X, MapPin, Phone, Mail as MailIcon, FileText as FileIcon, ExternalLink } from 'lucide-react';

export default function FloatingDock({ isDark, toggleTheme, onNavigate }) {
  const [isCvOpen, setIsCvOpen] = useState(false);
  
  // Ankh Animation States
  const [isAnkhRendered, setIsAnkhRendered] = useState(false);
  const [isAnkhVisible, setIsAnkhVisible] = useState(false);
  const ankhTimeoutRef = useRef(null);

  // Theme Transition Animation States
  const [isThemeAnimRendered, setIsThemeAnimRendered] = useState(false);
  const [isThemeAnimVisible, setIsThemeAnimVisible] = useState(false);
  const themeTimeoutRef = useRef(null);
  
  // Theme styling variables
  const iconClass = `group relative w-full h-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
    isDark 
      ? 'text-yellow-600 hover:text-yellow-300 hover:drop-shadow-[0_0_10px_rgba(253,224,71,0.8)]' 
      : 'text-[#8a310a] hover:text-[#b7410e] hover:drop-shadow-[0_0_10px_rgba(183,65,14,0.6)]'
  }`;

  const tooltipClass = "absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 text-sm font-medium text-white bg-[#111] border border-gray-700 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none whitespace-nowrap z-50 flex items-center gap-2 drop-shadow-xl";

  const accentText = isDark ? 'text-[#fbbf24]' : 'text-[#8a310a]';

  const handleNavClick = (id, label) => {
    if (onNavigate) {
      onNavigate(id, label);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // --- THE MAGIC ANKH LOGIC ---
  const triggerAnkh = () => {
    if (isAnkhRendered) return; 
    setIsAnkhRendered(true); 
    setTimeout(() => setIsAnkhVisible(true), 10); 
    
    ankhTimeoutRef.current = setTimeout(() => {
      setIsAnkhVisible(false);
      setTimeout(() => setIsAnkhRendered(false), 700); 
    }, 3000);
  };

  // --- THE THEME TRANSITION LOGIC ---
  const triggerThemeAnim = () => {
    if (isThemeAnimRendered) return;
    
    setIsThemeAnimRendered(true);
    
    setTimeout(() => setIsThemeAnimVisible(true), 10);
    
    setTimeout(() => {
      toggleTheme();
    }, 700);

    themeTimeoutRef.current = setTimeout(() => {
      setIsThemeAnimVisible(false);
      setTimeout(() => setIsThemeAnimRendered(false), 700);
    }, 1500);
  };

  // Cleanup timers
  useEffect(() => {
    return () => {
      clearTimeout(ankhTimeoutRef.current);
      clearTimeout(themeTimeoutRef.current);
    };
  }, []);

  return (
    <>
      <div className="fixed -bottom-6 left-1/2 -translate-x-1/2 w-[500px] max-w-[95vw] z-40 pointer-events-none">
        <div className="relative w-full h-full">
          
          <img 
            src="/solar-bark.png" 
            alt="Egyptian Solar Bark Dock" 
            className="w-full h-auto drop-shadow-2xl pointer-events-none"
          />

          <div className="absolute top-[48%] left-[13.5%] w-[73%] h-[24%] grid grid-cols-[0.8fr_1fr_1fr_1.6fr_1fr_1fr_0.8fr] items-center pointer-events-auto">
            
            <button onClick={() => handleNavClick('hero', 'Home')} className={iconClass} aria-label="Home">
              <span className={tooltipClass}><Home size={14} /> Home</span>
              <Home size={18} />
            </button>
            
            <button onClick={() => handleNavClick('stack', 'Stack')} className={iconClass} aria-label="Stack">
              <span className={tooltipClass}><Layers size={14} /> Stack</span>
              <Layers size={18} />
            </button>

            <button onClick={() => handleNavClick('projects', 'Projects')} className={iconClass} aria-label="Projects">
              <span className={tooltipClass}><FolderKanban size={14} /> Projects</span>
              <FolderKanban size={18} />
            </button>

            <button 
              onClick={triggerAnkh}
              className={`group relative w-full h-full flex items-center justify-center cursor-pointer transition-all duration-300 ${isDark ? 'hover:drop-shadow-[0_0_8px_rgba(253,224,71,0.6)]' : ''}`}
            >
              <span className={tooltipClass}>Ankh</span>
              <img 
                src="/The-Ankh-removebg-preview.png" 
                alt="Ankh" 
                className="h-[32px] w-auto object-contain transition-transform duration-300 group-hover:scale-110" 
              />
            </button>

            <button onClick={() => setIsCvOpen(true)} className={iconClass} aria-label="Digital CV">
              <span className={tooltipClass}><FileText size={14} /> Resume</span>
              <FileText size={18} />
            </button>

            <button onClick={() => window.location.href = 'mailto:peter.adel@example.com'} className={iconClass} aria-label="Contact">
              <span className={tooltipClass}><Mail size={14} /> Contact</span>
              <Mail size={18} />
            </button>

            <button onClick={triggerThemeAnim} className={iconClass} aria-label="Toggle Theme">
              <span className={tooltipClass}>
                {isDark ? <Sun size={14} /> : <Moon size={14} />} 
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </span>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

          </div>
        </div>
      </div>

      {/* --- GIANT GLOWING ANKH (FULL SCREEN BLUR) --- */}
      {isAnkhRendered && (
        <div 
          className={`fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xl transition-opacity duration-700 pointer-events-none ${
            isAnkhVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className={`transition-transform duration-700 ${isAnkhVisible ? 'scale-100' : 'scale-50'}`}>
            <img 
              src="/The-Ankh-removebg-preview.png" 
              alt="Giant Glowing Ankh" 
              className="h-[60vh] md:h-[80vh] w-auto object-contain animate-pulse"
              style={{
                filter: isDark 
                  ? 'drop-shadow(0 0 40px rgba(253,224,71,0.8)) drop-shadow(0 0 100px rgba(253,224,71,0.6))' 
                  : 'drop-shadow(0 0 40px rgba(183,65,14,0.8)) drop-shadow(0 0 100px rgba(183,65,14,0.6))'
              }}
            />
          </div>
        </div>
      )}

      {/* --- THEME TRANSITION OVERLAY --- */}
      {isThemeAnimRendered && (
        <div 
          className={`fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-2xl transition-opacity duration-700 pointer-events-none ${
            isThemeAnimVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className={`relative flex items-center justify-center transition-transform duration-1000 ${isThemeAnimVisible ? 'scale-150 rotate-[360deg]' : 'scale-50 rotate-0'}`}>
            <Sun 
              size={120} 
              className={`absolute transition-all duration-700 ${
                !isDark 
                  ? 'opacity-100 text-[#8a310a] drop-shadow-[0_0_40px_rgba(183,65,14,0.8)] scale-100 rotate-0' 
                  : 'opacity-0 text-yellow-600 scale-50 rotate-90'
              }`} 
            />
            <Moon 
              size={120} 
              className={`absolute transition-all duration-700 ${
                isDark 
                  ? 'opacity-100 text-[#fbbf24] drop-shadow-[0_0_40px_rgba(253,224,71,0.8)] scale-100 rotate-0' 
                  : 'opacity-0 text-[#8a310a] scale-50 -rotate-90'
              }`} 
            />
          </div>
        </div>
      )}

      {/* --- FLOATING CV MODAL --- */}
      {isCvOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all">
          <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 md:p-12 shadow-2xl border ${isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
            
            <div className="flex justify-between items-center mb-8">
              <div className={`flex items-center gap-2 font-bold ${accentText}`}>
                <FileIcon size={20} />
                <span>Fast Report</span>
              </div>
              <button 
                onClick={() => setIsCvOpen(false)}
                className={`p-2 rounded-full hover:bg-black/10 transition-colors ${isDark ? 'hover:bg-white/10' : ''}`}
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-2" style={{ fontFamily: "var(--font-archivo-black), sans-serif" }}>
                PETER <span className={accentText}>ADEL</span>
              </h1>
              <p className={`text-sm md:text-base font-bold tracking-widest uppercase ${accentText}`}>
                FULL-STACK DEVELOPER & ICT EDUCATOR
              </p>
              
              <div className={`flex flex-wrap gap-4 mt-4 text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                <span className="flex items-center gap-1"><MailIcon size={16} /> peter.adel@example.com</span>
                <span className="flex items-center gap-1"><Phone size={16} /> +20 100 000 0000</span>
                <span className="flex items-center gap-1"><MapPin size={16} /> Samalut, Egypt</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-12">
              <div>
                <h3 className={`text-xs font-bold tracking-widest uppercase mb-4 ${accentText}`}>OVERVIEW</h3>
                <p className={`text-sm md:text-base leading-relaxed mb-8 ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                  ICT Educator and Full-Stack Engineer based in Samalut, Egypt. Specialized in modern JavaScript and Python ecosystems, building robust backend architectures, and crafting interactive front-end experiences. Passionate about translating complex curriculum visions into engaging software systems.
                </p>

                <h3 className={`text-xs font-bold tracking-widest uppercase mb-4 ${accentText}`}>PROJECTS</h3>
                <ul className="space-y-3 font-bold uppercase tracking-tight text-lg">
                  <li>AINERGY</li>
                  <li>SHOPPER E-COMMERCE</li>
                  <li>TRAVEL SITE</li>
                  <li>SHOKRAN PLATFORM</li>
                  <li>SPEECH ASSESSMENT APP</li>
                </ul>
              </div>

              <div>
                <h3 className={`text-xs font-bold tracking-widest uppercase mb-4 ${accentText}`}>STACK</h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  {['JavaScript', 'Python', 'Node.js', 'React', 'Next.js', 'Electron', 'MongoDB', 'Git', 'Docker'].map((tech) => (
                    <span key={tech} className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-gray-100 border-gray-200 text-gray-700'}`}>
                      {tech}
                    </span>
                  ))}
                </div>

                <h3 className={`text-xs font-bold tracking-widest uppercase mb-4 ${accentText}`}>IMPACT</h3>
                <p className={`text-sm leading-relaxed mb-8 ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                  Spearheaded ICT curriculum strategy for early grades. Integrated block-coding (Scratch) with advanced text-based programming paradigms. Developed custom speech pronunciation tooling using Azure Cognitive Services.
                </p>

                <h3 className={`text-xs font-bold tracking-widest uppercase mb-4 ${accentText}`}>CONNECT</h3>
                <div className="flex flex-col gap-2">
                  <a href="#" className={`flex items-center gap-2 text-sm font-bold hover:underline ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                    <ExternalLink size={16} /> GitHub
                  </a>
                  <a href="#" className={`flex items-center gap-2 text-sm font-bold hover:underline ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                    <ExternalLink size={16} /> LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}