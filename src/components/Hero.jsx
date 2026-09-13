import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import anime from 'animejs';
import { Plus, Briefcase, Calendar } from 'lucide-react';
import darkFrameImg from '../assets/imageedit_2_4824872695.png';
import lightFrameImg from '../assets/il_570xN.6339063485_99kv-removebg-preview.png';
import myPhotoImg from '../assets/my-photo.png';

// ==========================================
// 1. HANDWRITING COMPONENT
// ==========================================
const HandwritingText = ({
    text,
    fontSize = 70,
    delay = 0,
    color = '#fbbf24',
    rotate = 0,
    isReady = true
}) => {
    const svgRef = useRef(null);

    useEffect(() => {
        if (!svgRef.current || !isReady) return;

        const letters = svgRef.current.querySelectorAll('.letter-path');
        anime.remove(letters);

        const tl = anime.timeline({
            easing: 'easeOutSine',
            autoplay: true,
        });

        letters.forEach((letter, index) => {
            const estimatedLength = fontSize * 4;

            letter.style.visibility = 'visible';
            letter.style.strokeDasharray = `${estimatedLength}`;
            letter.style.strokeDashoffset = `${estimatedLength}`;
            letter.style.fill = color;
            letter.style.fillOpacity = '0';
            letter.style.strokeOpacity = '1';
            letter.style.strokeWidth = '1.5px';
            letter.style.stroke = color;

            tl.add({
                targets: letter,
                strokeDashoffset: [estimatedLength, 0],
                fillOpacity: { value: [0, 1], duration: 250, delay: 50, easing: 'easeOutSine' },
                strokeOpacity: { value: [1, 0], duration: 200, delay: 150, easing: 'easeOutSine' },
                duration: 350,
                easing: 'easeInOutSine'
            }, index === 0 ? delay : '-=250');
        });

        return () => {
            tl.pause();
            anime.remove(letters);
        };
    }, [text, delay, fontSize, color, isReady]);

    const width = text.length * (fontSize * 0.7);
    const height = fontSize * 1.5;

    return (
        <div style={{ transform: `rotate(${rotate}deg)`, transformOrigin: 'left center', display: 'inline-block' }}>
            <svg ref={svgRef} width={width} height={height} style={{ overflow: 'visible' }}>
                <text x="0" y={fontSize} style={{ fontFamily: '"Permanent Marker", cursive', fontSize: `${fontSize}px`, paintOrder: 'stroke fill' }}>
                    {text.split('').map((char, index) => (
                        <tspan key={index} className={char === ' ' ? '' : 'letter-path'}>
                            {char === ' ' ? '\u00A0' : char}
                        </tspan>
                    ))}
                </text>
            </svg>
        </div>
    );
};

// ==========================================
// 2. AVAILABLE BADGE COMPONENT
// ==========================================
const AvailableBadge = ({ isDark, entryDelay = 600, isReady = true, onBook }) => {
    const badgeRef = useRef(null);
    const pulseRef = useRef(null);
    const triggerRef = useRef(null);
    const tooltipRef = useRef(null);
    const [availData, setAvailData] = useState(null);
    const [handledData, setHandledData] = useState(null);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipMounted, setTooltipMounted] = useState(false);
    const [tooltipPos, setTooltipPos] = useState({ top: 0, bottom: 'auto', left: 0, width: 320, arrowLeft: 160, flipBelow: false });
    const hideTimeoutRef = useRef(null);
    const unmountTimeoutRef = useRef(null);

    const updateTooltipPosition = () => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        const tooltipW = Math.min(320, window.innerWidth - 32); 
        const gap = 16;
        const estimatedHeight = tooltipRef.current?.offsetHeight || 260; 

        let flipBelow = false;
        let top = 'auto';
        let bottom = 'auto';

        if (rect.top > estimatedHeight + gap + 10) {
            bottom = window.innerHeight - rect.top + gap;
        } else {
            top = rect.bottom + gap;
            flipBelow = true;
        }

        const badgeCenter = rect.left + (rect.width / 2);
        let left = badgeCenter - (tooltipW / 2);
        left = Math.max(16, Math.min(left, window.innerWidth - tooltipW - 16));

        let arrowLeft = badgeCenter - left;
        arrowLeft = Math.max(24, Math.min(arrowLeft, tooltipW - 24));

        setTooltipPos({ top, bottom, left, width: tooltipW, arrowLeft, flipBelow });
    };

    const openTooltip = () => {
        if (hideTimeoutRef.current) { clearTimeout(hideTimeoutRef.current); hideTimeoutRef.current = null; }
        if (unmountTimeoutRef.current) { clearTimeout(unmountTimeoutRef.current); unmountTimeoutRef.current = null; }
        updateTooltipPosition();
        setTooltipMounted(true);
        requestAnimationFrame(() => requestAnimationFrame(() => setTooltipVisible(true)));
    };

    const closeTooltip = () => {
        setTooltipVisible(false);
        unmountTimeoutRef.current = setTimeout(() => setTooltipMounted(false), 350);
    };

    const handleMouseEnter = () => {
        if (hideTimeoutRef.current) { clearTimeout(hideTimeoutRef.current); hideTimeoutRef.current = null; }
        if (unmountTimeoutRef.current) { clearTimeout(unmountTimeoutRef.current); unmountTimeoutRef.current = null; }
        openTooltip();
    };

    const handleMouseLeave = () => {
        hideTimeoutRef.current = setTimeout(() => closeTooltip(), 250);
    };

    useEffect(() => {
        setAvailData({
            'Current Availability': '100%',
            'Current Time': new Date().toLocaleTimeString('en-US', { hour12: false, timeZone: 'Africa/Cairo' }) + ' EET'
        });
        setHandledData({
            projects: {
                "proj1": { name: "Portfolio Build", status: "Active", description: "Frontend & Backend integration", order: 1 },
                "proj2": { name: "API Architecture", status: "Completed", description: "System design", order: 2 }
            }
        });
    }, []);

    useEffect(() => {
        if (!isReady) return;

        const pulse = anime({
            targets: pulseRef.current,
            scale: [1, 1.5],
            opacity: [0.8, 0],
            duration: 1500,
            loop: true,
            easing: 'easeOutQuad'
        });

        anime({
            targets: badgeRef.current,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800,
            delay: entryDelay,
            easing: 'easeOutExpo'
        });

        return () => pulse.pause();
    }, [entryDelay, isReady]);

    useEffect(() => {
        if (!tooltipMounted) return;
        const update = () => updateTooltipPosition();
        window.addEventListener('scroll', update, true);
        window.addEventListener('resize', update);
        return () => {
            window.removeEventListener('scroll', update, true);
            window.removeEventListener('resize', update);
        };
    }, [tooltipMounted]);

    useEffect(() => () => {
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        if (unmountTimeoutRef.current) clearTimeout(unmountTimeoutRef.current);
    }, []);

    const availabilityPercent = 100;
    const currentTime = availData?.['Current Time'] || 'UTC+02:00';
    const projectsMap = handledData?.projects || {};
    const projects = Object.values(projectsMap).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const displayedProjects = projects.slice(0, 3);
    const restCount = projects.length - 3;
    const dotColor = '#22c55e';
    const slideOffset = tooltipVisible ? 0 : (tooltipPos.flipBelow ? -10 : 10);

    const tooltipElement = tooltipMounted && projects.length > 0
        ? createPortal(
            <div
                ref={tooltipRef}
                onMouseEnter={() => {
                    if (hideTimeoutRef.current) { clearTimeout(hideTimeoutRef.current); hideTimeoutRef.current = null; }
                }}
                onMouseLeave={() => {
                    hideTimeoutRef.current = setTimeout(() => closeTooltip(), 200);
                }}
                style={{
                    position: 'fixed',
                    top: typeof tooltipPos.top === 'number' ? tooltipPos.top + slideOffset : tooltipPos.top,
                    bottom: typeof tooltipPos.bottom === 'number' ? tooltipPos.bottom - slideOffset : tooltipPos.bottom,
                    left: tooltipPos.left,
                    width: tooltipPos.width,
                    zIndex: 60,
                    opacity: tooltipVisible ? 1 : 0,
                    transition: tooltipVisible
                        ? 'opacity 0s, top 0.3s cubic-bezier(0.32, 0.72, 0, 1), bottom 0.3s cubic-bezier(0.32, 0.72, 0, 1)'
                        : 'opacity 0.3s cubic-bezier(0.32, 0.72, 0, 1), top 0.3s cubic-bezier(0.32, 0.72, 0, 1), bottom 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
                    pointerEvents: tooltipVisible ? 'auto' : 'none',
                    borderRadius: 28,
                    padding: window.innerWidth <= 380 ? 16 : 24,
                    background: isDark
                        ? 'linear-gradient(160deg, rgba(25, 25, 40, 0.7) 0%, rgba(10, 10, 15, 0.88) 100%)'
                        : 'linear-gradient(160deg, rgba(255, 255, 255, 0.72) 0%, rgba(240, 240, 255, 0.9) 100%)',
                    backdropFilter: 'blur(80px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(80px) saturate(200%)',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.06)',
                    boxShadow: isDark
                        ? '0 32px 80px rgba(0, 0, 0, 0.55), inset 0 0.5px 0 rgba(255, 255, 255, 0.08)'
                        : '0 32px 80px rgba(0, 0, 0, 0.1), inset 0 0.5px 0 rgba(255, 255, 255, 0.65)',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        left: tooltipPos.arrowLeft,
                        transform: 'translateX(-50%) rotate(45deg)',
                        width: 14,
                        height: 14,
                        ...(tooltipPos.flipBelow
                            ? { top: -7, borderLeft: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.06)', borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.06)' }
                            : { bottom: -7, borderRight: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.06)', borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.06)' }
                        ),
                        background: isDark ? 'rgba(12, 12, 20, 0.88)' : 'rgba(242, 242, 255, 0.9)',
                        backdropFilter: 'blur(80px)',
                    }}
                />
                <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)' }}>
                    <Briefcase size={15} className="text-info" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted">Availability Status</span>
                </div>
                <div className="flex flex-col gap-4">
                    {displayedProjects.map((p, i) => (
                        <div key={i} className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-[14px] font-bold text-primary tracking-tight">{p.name || 'Project'}</span>
                                <span
                                    className="text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest border"
                                    style={{
                                        backgroundColor: (p.status || '').toLowerCase() === 'completed' ? 'rgba(16, 185, 129, 0.15)' : (p.status || '').toLowerCase() === 'pending' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                                        color: (p.status || '').toLowerCase() === 'completed' ? '#10b981' : (p.status || '').toLowerCase() === 'pending' ? '#f59e0b' : '#3b82f6',
                                        borderColor: (p.status || '').toLowerCase() === 'completed' ? 'rgba(16, 185, 129, 0.3)' : (p.status || '').toLowerCase() === 'pending' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(59, 130, 246, 0.3)'
                                    }}
                                >
                                    {p.status || 'Active'}
                                </span>
                            </div>
                            {p.description && (
                                <p className="text-[12px] text-muted leading-snug italic font-medium">
                                    {p.description}
                                </p>
                            )}
                        </div>
                    ))}
                    {restCount > 0 && (
                        <div className="flex items-center justify-center gap-2 mt-1 pt-3 text-muted hover:text-sec transition-all" style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)' }}>
                            <Plus size={14} strokeWidth={3} />
                            <span className="text-[12px] font-black">{restCount} rest managed</span>
                        </div>
                    )}
                </div>
            </div>,
            document.body
        )
        : null;

    return (
        <div ref={badgeRef} className="flex items-center gap-4 opacity-0 flex-wrap justify-center relative">
            <div
                ref={triggerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="group cursor-default transition-all active:scale-[0.98] flex items-center gap-3 px-7 py-3.5 rounded-full relative z-[100]"
                style={{
                    background: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(30px)',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                    boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.2)' : '0 8px 32px rgba(0, 0, 0, 0.05)'
                }}
            >
                <div className="relative">
                    <div className="size-[12px] rounded-full transition-slow" style={{ backgroundColor: dotColor }}></div>
                    <div ref={pulseRef} className="absolute inset-0 size-[12px] rounded-full transition-slow" style={{ backgroundColor: dotColor }}></div>
                </div>
                <span className="text-[15px] font-bold text-primary tracking-tight">Available</span>
            </div>

            <div className="px-6 py-3 rounded-full font-semibold text-[15px] shadow-lg transition-all" style={{
                background: isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--section-border)',
                color: 'var(--text-primary)'
            }}>
                {currentTime.split(' ')[0]}
            </div>
        </div>
    );
};

// ==========================================
// 3. MAIN HERO COMPONENT
// ==========================================
export default function Hero({ isDark }) {
    const titleRef = useRef(null);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowWidth < 768;
    const isSmallMobile = windowWidth < 400;

    const topSloganSize = isSmallMobile ? 45 : (isMobile ? 55 : 85);
    const bottomSloganSize = isSmallMobile ? 35 : (isMobile ? 45 : 75);

    // Fast animation timings
    const timing = {
        slogan1: 0,
        name: 100,
        slogan2: 300,
        rest: 600
    };

    const nameColorClass = isDark 
        ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]' 
        : 'text-gray-900 drop-shadow-md';

    const themeColor = isDark ? '#fbbf24' : '#8a310a';

    useEffect(() => {
        const nameAnim = anime({
            targets: '.name-char',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 600,
            delay: anime.stagger(50, { start: timing.name }),
            easing: 'easeOutQuart'
        });

        return () => {
            nameAnim.pause();
            anime.remove('.name-char');
        };
    }, [timing.name]);

    return (
        <section className="relative w-full min-h-screen flex items-center justify-center px-8 z-10 pointer-events-none overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-[90vw] lg:max-w-[1400px] gap-12 mt-10">

                {/* --- LEFT SIDE: TEXT --- */}
                <div className="flex-1 flex flex-col items-start text-left relative z-20 pointer-events-auto gap-4">
                    
                    <div className="ml-2 md:ml-8 z-20">
                        <HandwritingText
                            key="slogan-1"
                            text="THIS IS"
                            fontSize={topSloganSize}
                            delay={timing.slogan1}
                            rotate={-4}
                            color={themeColor}
                        />
                    </div>

                    <h1 ref={titleRef} className={`z-10 uppercase flex flex-col w-full m-0 transition-colors duration-500 ${nameColorClass}`} style={{
                        fontWeight: 900,
                        fontFamily: "var(--font-archivo-black), sans-serif",
                        lineHeight: '0.95'
                    }}>
                        <span aria-hidden="true" className="text-6xl sm:text-7xl md:text-8xl lg:text-[9.5rem] tracking-tighter self-start flex">
                            {"PETER".split('').map((char, i) => (
                                <span key={`first-${i}`} className="name-char opacity-0 inline-block">{char}</span>
                            ))}
                        </span>
                        <span aria-hidden="true" className="text-6xl sm:text-7xl md:text-8xl lg:text-[9.5rem] tracking-tighter self-start ml-16 md:ml-32 lg:ml-48 flex">
                            {"ADEL".split('').map((char, i) => (
                                <span key={`last-${i}`} className="name-char opacity-0 inline-block">{char === ' ' ? '\u00A0' : char}</span>
                            ))}
                        </span>
                    </h1>

                    <div className="self-start md:self-start ml-4 md:ml-24 z-20 mt-2">
                        <HandwritingText
                            key="slogan-2"
                            text="FULL-STACK DEVELOPER"
                            fontSize={bottomSloganSize}
                            delay={timing.slogan2}
                            rotate={-2}
                            color={themeColor}
                        />
                    </div>

                    <div className="mt-8 z-[5000]">
                        <AvailableBadge isDark={isDark} entryDelay={timing.rest} />
                    </div>

                </div>

                {/* --- RIGHT SIDE: SHIFTED LEFT --- */}
                <div className="relative w-[450px] flex-shrink-0 z-10 flex items-center justify-center pointer-events-auto animate-float mt-8 md:mt-0 md:-translate-x-12 lg:-translate-x-24">
                    <img
                        src={isDark ? darkFrameImg : lightFrameImg}
                        alt="Cartouche Frame"
                        className={`relative w-full h-auto object-contain pointer-events-none z-10 transition-all duration-500 ${
                            isDark ? 'drop-shadow-[0_0_25px_rgba(251,191,36,0.25)]' : 'drop-shadow-2xl'
                        }`}
                    />
                    <img 
                        src={myPhotoImg} 
                        alt="Profile" 
                        className="absolute top-[3%] left-[26%] w-[48%] h-[90%] object-cover rounded-full z-0"
                    />
                </div>

            </div>
        </section>
    );
}