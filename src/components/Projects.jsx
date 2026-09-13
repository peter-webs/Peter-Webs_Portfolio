import { useState, useMemo } from 'react';
import { ExternalLink, Search } from 'lucide-react';

// Your Custom GitHub icon
const Github = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" 
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// YOUR PROJECT DATA (Added placeholder images to match the new UI)
const PROJECTS_DATA = [
  {
    title: 'Ainergy',
    type: 'Project', // TODO: Update type (e.g., Full-Stack, Hackathon, etc.)
    description: 'TODO: Write one or two sentences explaining what Ainergy does.',
    tech: ['React', 'Tailwind', 'Node.js'], // TODO: Replace with actual tech used
    links: { github: 'https://github.com/peter-webs/Ainergy', live: '' },
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80' // Technology placeholder
  },
  {
    title: 'Shopper',
    type: 'E-Commerce', // TODO: Update type
    description: 'TODO: Write one or two sentences explaining what Shopper does.',
    tech: ['JavaScript', 'HTML', 'CSS'], // TODO: Replace with actual tech used
    links: { github: 'https://github.com/peter-webs/Shopper', live: '' },
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80' // Shopping placeholder
  },
  {
    title: 'Travel Site',
    type: 'Web Application', // TODO: Update type
    description: 'TODO: Write one or two sentences explaining what Travel Site does.',
    tech: ['JavaScript', 'HTML', 'CSS'], // TODO: Replace with actual tech used
    links: { github: 'https://github.com/peter-webs/Travel-Site', live: '' },
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80' // Travel placeholder
  },
  {
    title: 'Shokran',
    type: 'Project', // TODO: Update type
    description: 'TODO: Write one or two sentences explaining what Shokran does.',
    tech: ['React', 'Next.js'], // TODO: Replace with actual tech used
    links: { github: 'https://github.com/peter-webs/Shokran', live: '' },
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80' // Code placeholder
  },
  {
    title: 'First Login Page',
    type: 'UI Component', 
    description: 'TODO: Write one or two sentences explaining this login page.',
    tech: ['HTML', 'CSS'], // TODO: Replace with actual tech used
    links: { github: 'https://github.com/peter-webs/first-Login-page', live: '' },
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80' // Money/Lock placeholder
  }
];

export default function Projects({ isDark }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Extract all unique technologies from your data to generate the Filter Pills automatically
  const allTechnologies = useMemo(() => {
    const techs = new Set();
    PROJECTS_DATA.forEach(p => p.tech.forEach(t => techs.add(t)));
    return ['All', ...Array.from(techs)];
  }, []);

  // Search and Filter Logic
  const filteredProjects = useMemo(() => {
    return PROJECTS_DATA.filter(project => {
      const matchesSearch = 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFilter = activeFilter === 'All' || project.tech.includes(activeFilter);

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  // Design Variables matching your Hero page
  const nameColorClass = isDark 
    ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]' 
    : 'text-gray-900 drop-shadow-md';
  const themeColor = isDark ? '#fbbf24' : '#8a310a';
  const cardBg = isDark ? 'bg-zinc-800/80' : 'bg-white';
  const inputBg = isDark ? 'bg-zinc-800' : 'bg-gray-100';
  const textColor = isDark ? 'text-zinc-400' : 'text-gray-600';
  const pillBg = isDark ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-white hover:bg-gray-200';

  return (
    <section className="relative w-full min-h-screen pt-20 pb-48 px-6 sm:px-10 lg:px-24 z-10 flex flex-col items-center">
      <div className="w-full max-w-[1400px] flex flex-col gap-8">
        
        {/* --- HEADER --- */}
        <div className="text-left mt-10">
          <div 
            className="text-4xl md:text-5xl -mb-4 drop-shadow-md" 
            style={{ 
              fontFamily: '"Permanent Marker", cursive', 
              color: themeColor, 
              transform: 'rotate(-2deg)', 
              transformOrigin: 'left center' 
            }}
          >
            Selected
          </div>
          <h2 
            className={`text-6xl sm:text-7xl md:text-[8rem] font-black leading-none m-0 transition-colors duration-500 ${nameColorClass}`}
            style={{ fontFamily: "var(--font-archivo-black), sans-serif" }}
          >
            Projects
          </h2>
        </div>

        {/* --- SEARCH BAR --- */}
        <div className={`flex items-center w-full md:w-2/3 lg:w-1/2 rounded-xl px-4 py-3 transition-colors ${inputBg}`}>
          <Search className={`w-5 h-5 ${textColor} mr-3`} />
          <input 
            type="text" 
            placeholder="Search projects by title, tags, or description..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-transparent outline-none border-none font-medium ${isDark ? 'text-white' : 'text-gray-900'} placeholder:text-zinc-500`}
          />
        </div>

        {/* --- FILTERS --- */}
        <div className="flex flex-col gap-3">
          <span className={`text-xs font-bold tracking-widest uppercase ${textColor}`}>Filter View:</span>
          <div className="flex flex-wrap gap-3">
            {allTechnologies.map((tech, index) => (
              <button 
                key={index}
                onClick={() => setActiveFilter(tech)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm border 
                  ${activeFilter === tech 
                    ? `border-transparent text-black` 
                    : `${isDark ? 'border-zinc-700 text-zinc-300' : 'border-gray-300 text-gray-700'} ${pillBg}`
                  }`}
                style={activeFilter === tech ? { backgroundColor: themeColor } : {}}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        {/* --- PROJECT CARDS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredProjects.map((project, index) => (
            <div 
              key={index} 
              className={`flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${cardBg} border ${isDark ? 'border-zinc-700' : 'border-gray-200 shadow-lg'}`}
            >
              {/* Card Image Area */}
              <div className="relative w-full h-56 overflow-hidden group">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Floating Tags (Matches Screenshot) */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2 max-w-[90%]">
                  {project.tech.slice(0, 3).map((tech, i) => (
                    <span 
                      key={i} 
                      className="text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-md bg-black/60 text-white border border-white/20 uppercase tracking-wider"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech.length > 3 && (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-md bg-black/60 text-white border border-white/20 uppercase tracking-wider">
                      +{project.tech.length - 3} More
                    </span>
                  )}
                </div>
              </div>

              {/* Card Content Area */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs font-mono tracking-widest uppercase mb-1 block" style={{ color: themeColor }}>
                      {project.type}
                    </span>
                    <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {project.title}
                    </h3>
                  </div>
                  
                  {/* Links (Github & Live) */}
                  <div className="flex gap-2">
                    {project.links.github && (
                      <a href={project.links.github} className={`${textColor} hover:text-black dark:hover:text-white transition-colors`}>
                        <Github size={20} />
                      </a>
                    )}
                    {project.links.live && (
                      <a href={project.links.live} className={`${textColor} hover:text-black dark:hover:text-white transition-colors`}>
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </div>
                
                <p className={`text-sm leading-relaxed mt-2 ${textColor}`}>
                  {project.description}
                </p>
              </div>
            </div>
          ))}

          {/* Empty State if Search yields no results */}
          {filteredProjects.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <p className={textColor}>No projects found matching your search criteria.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}