import { 
  SiJavascript, SiReact, SiNodedotjs, SiTailwindcss, SiExpress,
  SiPython, SiTypescript, SiMongodb, SiGit, SiDocker
} from 'react-icons/si';
import { FiInstagram, FiGithub, FiLinkedin } from 'react-icons/fi';

const TECH_STACK = [
  { name: 'JavaScript', icon: SiJavascript },
  { name: 'Node.js', icon: SiNodedotjs },
  { name: 'React', icon: SiReact },
  { name: 'Firebase', icon: SiTailwindcss }, 
  { name: 'TypeScript', icon: SiTypescript },
  { name: 'Next.js', icon: SiExpress },     
  { name: 'Electron', icon: SiPython },     
  { name: 'MongoDB', icon: SiMongodb },
  { name: 'Git', icon: SiGit },
  { name: 'Docker', icon: SiDocker },
];

const SOCIAL_LINKS = [
  { name: 'Instagram', icon: FiInstagram, url: '#' },
  { name: 'GitHub', icon: FiGithub, url: '#' },
  { name: 'LinkedIn', icon: FiLinkedin, url: '#' },
];

export default function TechStack({ isDark }) {
  const nameColorClass = isDark 
    ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]' 
    : 'text-gray-900 drop-shadow-md';

  const themeColor = isDark ? '#fbbf24' : '#8a310a';

  // 1. Dynamic classes for Light/Dark mode borders and hovers
  const borderColor = isDark ? 'border-zinc-700' : 'border-zinc-400';
  const nodeColor = isDark ? 'bg-zinc-700' : 'bg-zinc-400';
  const hoverBg = isDark ? 'hover:bg-white/5' : 'hover:bg-black/5';

  return (
    <div className="relative w-full min-h-screen py-20 px-8 lg:px-56 z-10 flex flex-col justify-center items-start">
      
      <div className="flex flex-col w-full max-w-[900px] -mt-28">
        
        <div className="mb-16 text-left">
          <div 
            className="text-5xl md:text-6xl -mb-4 ml-4 drop-shadow-md" 
            style={{ 
              fontFamily: '"Permanent Marker", cursive', 
              color: themeColor, 
              transform: 'rotate(-4deg)', 
              transformOrigin: 'left center' 
            }}
          >
            My Tech
          </div>
          <h2 
            className={`text-7xl md:text-[9rem] font-black leading-none m-0 transition-colors duration-500 ${nameColorClass}`}
            style={{ fontFamily: "var(--font-archivo-black), sans-serif" }}
          >
            Stack
          </h2>
        </div>

        {/* 800px Grid Container */}
        <div className="relative shrink-0" style={{ width: '800px' }}>
          
          {/* 2. Container gets Top and Left dotted borders */}
          <div className={`grid grid-cols-5 relative transition-all duration-400 border-l border-t border-dotted ${borderColor}`} 
               style={{ gridTemplateColumns: 'repeat(5, 160px)' }}>
            
            {TECH_STACK.map((tech, index) => {
              const Icon = tech.icon;

              return (
                <div 
                  key={index}
                  // 3. Every cell gets Right and Bottom dotted borders
                  className={`flex items-center justify-center p-4 transition-all duration-300 group cursor-pointer ${hoverBg} border-r border-b border-dotted ${borderColor}`}
                  style={{ minHeight: '150px' }}
                  title={tech.name}
                >
                  <div 
                    className="text-[6rem] opacity-60 grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110"
                    style={{ color: 'var(--icon-color, #71717a)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = themeColor;
                      e.currentTarget.style.filter = `drop-shadow(0 0 20px ${themeColor}80)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#71717a';
                      e.currentTarget.style.filter = 'none';
                    }}
                  >
                    <Icon />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Anchor Nodes (Perfect squares scaled to w-3 h-3) */}
          <div className={`absolute -top-1.5 -left-1.5 w-3 h-3 ${nodeColor}`}></div>
          <div className={`absolute -top-1.5 -right-1.5 w-3 h-3 ${nodeColor}`}></div>
          <div className={`absolute -bottom-1.5 -left-1.5 w-3 h-3 ${nodeColor}`}></div>
          <div className={`absolute -bottom-1.5 -right-1.5 w-3 h-3 ${nodeColor}`}></div>
          
          <div className={`absolute -top-1.5 left-[20%] -translate-x-1/2 w-3 h-3 ${nodeColor}`}></div>
          <div className={`absolute -top-1.5 left-[40%] -translate-x-1/2 w-3 h-3 ${nodeColor}`}></div>
          <div className={`absolute -top-1.5 left-[60%] -translate-x-1/2 w-3 h-3 ${nodeColor}`}></div>
          <div className={`absolute -top-1.5 left-[80%] -translate-x-1/2 w-3 h-3 ${nodeColor}`}></div>
          
          <div className={`absolute -bottom-1.5 left-[20%] -translate-x-1/2 w-3 h-3 ${nodeColor}`}></div>
          <div className={`absolute -bottom-1.5 left-[40%] -translate-x-1/2 w-3 h-3 ${nodeColor}`}></div>
          <div className={`absolute -bottom-1.5 left-[60%] -translate-x-1/2 w-3 h-3 ${nodeColor}`}></div>
          <div className={`absolute -bottom-1.5 left-[80%] -translate-x-1/2 w-3 h-3 ${nodeColor}`}></div>
        </div>
      </div>

      <div className="hidden lg:flex absolute right-60 top-1/2 -translate-y-1/2 flex-col items-center justify-center gap-3 z-30">
        <div className={`w-px h-24 bg-gradient-to-b from-transparent mb-4 ${isDark ? 'to-zinc-500' : 'to-zinc-400'}`}></div>
        
        {SOCIAL_LINKS.map((social, index) => {
          const Icon = social.icon;
          return (
            <a 
              key={index} 
              href={social.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative flex items-center justify-center p-3 rounded-xl transition-all duration-300 group"
            >
              <div 
                className="text-4xl transition-all duration-300 text-zinc-500 group-hover:scale-110"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = themeColor;
                  e.currentTarget.style.filter = `drop-shadow(0 0 15px ${themeColor}80)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '';
                  e.currentTarget.style.filter = 'none';
                }}
              >
                <Icon />
              </div>
              
              <span className="absolute right-full mr-4 px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 bg-white text-black shadow-xl">
                {social.name}
              </span>
            </a>
          );
        })}
        
        <div className={`w-px h-24 bg-gradient-to-t from-transparent mt-4 ${isDark ? 'to-zinc-500' : 'to-zinc-400'}`}></div>
      </div>

    </div>
  );
}