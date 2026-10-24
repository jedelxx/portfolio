import React, { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/all';
import gsap from 'gsap';
import Navbar from './components/navbar';
import './style.css';

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkBg, setIsDarkBg] = useState(false);
  
  // NEW: State to check if the device is mobile
  const [isMobile, setIsMobile] = useState(false);

  const introRef = useRef(null);
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const skillsRef = useRef(null); 
  const experienceRef = useRef(null);
  const certificationsRef = useRef(null); 
  const bgOverlayRef = useRef(null); 
  const [displayText, setDisplayText] = useState('j3d3l.3x3');
  const [isStabilized, setIsStabilized] = useState(false);
  const bgLinesRef = useRef([]);

  // NEW: Effect to listen to window resizing and set mobile state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Set initial value
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = (e) => {
    // Disable effect entirely on mobile to save performance
    if (!heroRef.current || isMobile) return; 
    
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    heroRef.current.style.setProperty('--mouse-x', `${x}px`);
    heroRef.current.style.setProperty('--mouse-y', `${y}px`);
  };
  
  bgLinesRef.current = [];

  const addToBgLines = (el) => {
    if (el && !bgLinesRef.current.includes(el)) {
      bgLinesRef.current.push(el);
    }
  };

  useEffect(() => {
    const targetText = 'jedel.';
    const chars = 'FAITHHIJKLMFAITHVWHOLLYcdefghijklmnopqrstuvwxyz0123456789@#$%&*-_<>[]/\\';
    let iteration = 0;

    const interval = setInterval(() => {
      setDisplayText(
        targetText
          .split('')
          .map((letter, index) => {
            if (index < iteration) {
              return targetText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= targetText.length) {
        setIsStabilized(true); 
        clearInterval(interval);
      }

      iteration += 1 / 3; 
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    window.scrollTo({ 
      top: 0, 
      left: 0, 
      behavior: 'instant' 
    });

    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoaded(true);
      }
    });

    tl.fromTo(
      introRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }
    )
    .to(introRef.current, { opacity: 1, duration: 0.6 }) 
    .to(introRef.current, { opacity: 0, scale: 1.1, duration: 0.8, ease: 'power3.in' });
  }, []);
      
  useEffect(() => {
    if (!isLoaded) return;

    ScrollTrigger.create({
      trigger: aboutRef.current,
      start: 'top center',
      endTrigger: experienceRef.current,
      end: 'bottom center',
      onEnter: () => {
        setIsScrolled(true);
        setIsDarkBg(true);
      },
      onLeaveBack: () => {
        setIsScrolled(false);
        setIsDarkBg(false);
      },
      onLeave: () => setIsDarkBg(false),      
      onEnterBack: () => setIsDarkBg(true),   
    });

    gsap.to(bgOverlayRef.current, {
      opacity: 1,
      scrollTrigger: {
        trigger: aboutRef.current,
        start: 'top 90%', 
        end: 'top 10%',   
        scrub: 1.2,        
      },
    });

    gsap.fromTo(
      bgOverlayRef.current,
      { opacity: 1 },
      {
        opacity: 0,
        immediateRender: false, 
        scrollTrigger: {
          trigger: certificationsRef.current,
          start: 'top 90%', 
          end: 'top 70%',   
          scrub: 1.2,        
        },
      }
    );

    gsap.fromTo(
      bgLinesRef.current,
      { opacity: 0, x: -100 }, 
      { opacity: 1, x: 0, duration: 1.4, ease: 'power3.out', stagger: 0.25, delay: 0.3 }
    );
    
    // FIX 2: Removed the broken heroRef GSAP ScrollTrigger animation 
    // that was setting the parent section opacity to 0 and failing on mobile.

    gsap.fromTo(
      aboutRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out', scrollTrigger: { trigger: aboutRef.current, start: 'top 85%', toggleActions: 'play none none none' } }
    );

    gsap.fromTo(
      skillsRef.current,
      { opacity: 0, y: 60, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out', stagger: 0.2, scrollTrigger: { trigger: skillsRef.current, start: 'top 85%', toggleActions: 'play reverse play reverse' } }
    );

    // --- EXPERIENCE SECTION SCROLLTRIGGER ---
    if (experienceRef.current) {
      const header = experienceRef.current.children[0];
      const divider = experienceRef.current.children[1];
      const cards = gsap.utils.toArray(experienceRef.current.querySelectorAll('.experience-card'));

      gsap.fromTo(
        [header, divider],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: experienceRef.current,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse',
          }
        }
      );

      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              toggleActions: 'play none play reverse',
            }
          }
        );
      });
    }

    // --- CERTIFICATIONS SECTION SCROLLTRIGGER ---
    if (certificationsRef.current) {
      const certHeader = certificationsRef.current.children[0];
      const certDivider = certificationsRef.current.children[1];
      const certCards = gsap.utils.toArray(certificationsRef.current.querySelectorAll('.cert-card'));

      gsap.fromTo(
        [certHeader, certDivider],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: certificationsRef.current,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse',
          }
        }
      );

      certCards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 100%',
              toggleActions: 'play none play reverse',
            }
          }
        );
      });
    }

  }, [isLoaded]);

  return (
    <>
      {/* Hacker Glitch Preloader */}
      {!isLoaded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[black]">
          <h1 
            ref={introRef}
            className={`font-extrabold tracking-wider text-5xl md:text-6xl font-mono transition-all duration-100 ${
              isStabilized ? 'text-white' : 'text-neon-blue animate-pulse'
            }`}       
          >
            {displayText}
          </h1>
        </div>
      )}

      {/* Global Full-Screen Base Light Background */}
      <div className="fixed inset-0 bg-[#FBFBFB] z-0" />

      {/* Global Full-Screen Solid Dark Background Overlay */}
      <div 
        ref={bgOverlayRef}
        className="fixed inset-0 bg-black opacity-0 pointer-events-none z-0"
      />

      {/* Main Portfolio Content */}
      <main className={`relative min-h-screen transition-all duration-700 z-10 pt-16 md:pt-0 ${
        isScrolled ? 'ml-0 w-full' : 'md:ml-72 w-full md:w-[calc(100vw-18rem)]'
      } ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        
        <Navbar isScrolled={isScrolled} isDarkBg={isDarkBg} />

      <section 
        id="home" 
        ref={heroRef} 
        onMouseMove={handleMouseMove}
        className="relative flex flex-col justify-center items-start min-h-screen px-6 md:px-16 overflow-hidden"
      >
        <h1 
          className={`z-0 text-[13vw] md:text-[9.5vw] lg:text-[9vw] font-bold uppercase text-neon-blue select-none tracking-tighter text-left leading-none font-gugi ${
            !isMobile ? 'cursor-color-reveal' : ''
          }`}
        >
          <span ref={addToBgLines} className="block">
            EMPOWER
          </span>
          <span ref={addToBgLines} className="block">
            GIRLS, BUILD
          </span>
          <span ref={addToBgLines} className="block">
            TECHNOLOGY.
          </span>
        </h1>
      </section>
      
      {/* About Section */}
      <section id="about" ref={aboutRef} className="relative z-10 min-h-screen flex items-center px-6 md:px-16 text-[#FBFBFB] py-20">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          <div className="text-left space-y-6 md:col-span-7 px-2 md:px-0">
            <h2 className="text-4xl md:text-5xl font-extrabold text-neon-blue tracking-wide">
              Hi! I’m Jenn (aka Jedel)!
            </h2>
            
            <p className="text-base md:text-xl font-semibold text-white/90 leading-relaxed">
              A third-year Information Technology student specializing in Information Systems Development and consistent Dean's Lister at Polytechnic University of the Philippines – Manila.
            </p>

            <p className="text-base md:text-lg text-white/70 leading-relaxed">
            Passionate front-end developer bridging the gap between logic and design to create sleek, easy-to-use digital experiences.
            </p>

            <p className="text-base md:text-lg text-white/70 leading-relaxed">
              Beyond tech, I have a passion for videography, video editing, and gaming. When I’m not coding or designing, you’ll likely find me hanging out with street cats—my ultimate stress relievers!
            </p>
          </div>

          <div className="relative w-full md:w-[450px] mx-auto overflow-hidden shadow-2xl px-2 md:px-0">
            {/* DESKTOP VIEW: Full portrait image */}
            <img 
              src={`${import.meta.env.BASE_URL}me1.jpeg`} 
              alt="photo" 
              className="hidden md:block w-full h-[400px] rounded-xl object-cover object-center"
            />

            {/* MOBILE VIEW: Centered/adjusted frame focusing on your face */}
            <div className="block md:hidden w-full h-[300px] overflow-hidden relative rounded-3xl">
              <img 
                src={`${import.meta.env.BASE_URL}me1.jpeg`} 
                alt="photo" 
                className="absolute w-[160%] max-w-none -top-4 -left-[25%] h-[120%] object-cover"
              />
            </div>
          </div>    
        </div>
      </section>

      {/* --- SKILLS SECTION --- */}
      <section id="skills" className="relative z-10 min-h-screen flex items-center px-6 md:px-16 text-[#FBFBFB] py-20">
        <div ref={skillsRef} className="w-full max-w-7xl mx-auto text-left space-y-8 px-2 md:px-0">
          <h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-wider flex items-center gap-3">
            Skills<span className="text-neon-blue">.</span>
          </h2>
          <div className="w-full h-[2px] bg-white/20"></div>
          
          <div className="space-y-6 max-w-4xl font-mono">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-neon-blue/50 transition-all duration-300 backdrop-blur-sm">
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                <span className="font-bold text-neon-blue">&gt; Hard_Skills:</span> Canva, Figma, Adobe Premiere Pro, COBOL, C, Java, SQL, Python, React, TailWind CSS, GSAP, GitHub
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-neon-blue/50 transition-all duration-300 backdrop-blur-sm">
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                <span className="font-bold text-neon-blue">&gt; Soft_Skills:</span> Attention to Detail, Creativity, Critical Thinking, Team Collaboration, Problem Analysis, Time Management, Organizational Skills
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- EXPERIENCE SECTION --- */}
      <section id="experience" className="relative z-10 min-h-screen flex items-center px-6 md:px-16 text-[#FBFBFB] py-20">
        <div ref={experienceRef} className="w-full max-w-7xl mx-auto text-left space-y-8 px-2 md:px-0">
          
          <h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-wider flex items-center gap-3">
            Experiences<span className="text-neon-blue">.</span>
          </h2>
          <div className="w-full h-[2px] bg-white/20"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl font-mono">
            <div className="experience-card flex flex-col p-6 rounded-xl bg-white/5 border border-white/10 hover:border-neon-blue/50 transition-all duration-300 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-neon-blue mb-1">Operations Associate</h3>
              <h4 className="text-lg text-white/90 mb-3">Google Developer Groups on Campus - PUP</h4>
              <p className="text-base text-white/70 leading-relaxed">Documented community events and software tutorials while managing event logistics to ensure seamless team access to critical materials.</p>
              <div className="flex flex-col gap-3 mt-auto">
                <div className="flex">
                  <span className="px-3 py-1 mt-6 text-sm font-semibold bg-white/10 text-white/80 border border-white/20 rounded-md">Nov 2024 - Oct 2025</span>
                </div>
              </div>
            </div>

            <div className="experience-card flex flex-col p-6 rounded-xl bg-white/5 border border-white/10 hover:border-neon-blue/50 transition-all duration-300 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-neon-blue mb-1">Operations Documentation Head</h3>
              <h4 className="text-lg text-white/90 mb-3">Kalikasan Kilos Kabataan - NSTP</h4>
              <p className="text-base text-white/70 leading-relaxed">Organized key social media assets to boost communications and directed the documentation team for the main NSTP event.</p>
              <div className="flex flex-col gap-3 mt-auto">
                <div className="flex">
                  <span className="px-3 py-1 mt-6 text-sm font-semibold bg-white/10 text-white/80 border border-white/20 rounded-md">Dec 2024 - Jun 2025</span>
                </div>
              </div>
            </div>

            <div className="experience-card flex flex-col p-6 rounded-xl bg-white/5 border border-white/10 hover:border-neon-blue/50 transition-all duration-300 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-neon-blue mb-1">Programming Cadet</h3>
              <h4 className="text-lg text-white/90 mb-3">Cisco NetConnect PUP - Manila</h4>
              <p className="text-base text-white/70 leading-relaxed">Continuous learner across diverse tech stacks and methodologies, building practical software solutions and providing cross-project technical support.</p>
              <div className="flex flex-col gap-3 mt-auto">
                <div className="flex">
                  <span className="px-3 py-1 mt-6 text-sm font-semibold bg-white/10 text-white/80 border border-white/20 rounded-md">Nov 2025 - Mar 2026</span>
                </div>
              </div>
            </div>

            <div className="experience-card flex flex-col p-6 rounded-xl bg-white/5 border border-white/10 hover:border-neon-blue/50 transition-all duration-300 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-neon-blue mb-1">UI/UX Cadet</h3>
              <h4 className="text-lg text-white/90 mb-3">Google Developer Groups on Campus - PUP</h4>
              <p className="text-base text-white/70 leading-relaxed">Applied UI/UX best practices learned through technical coursework to design and iterate on interactive projects in Figma.</p>
              <div className="flex flex-col gap-3 mt-auto">
                <div className="flex">
                  <span className="px-3 py-1 mt-6 text-sm font-semibold bg-white/10 text-white/80 border border-white/20 rounded-md">Nov 2025 - Jun 2026</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="px-3 py-1 text-xs font-medium bg-neon-blue/10 text-neon-blue border border-neon-blue/30 rounded-md">Figma</span>
                </div>
              </div>
            </div>

            <div className="experience-card flex flex-col p-6 rounded-xl bg-white/5 border border-white/10 hover:border-neon-blue/50 transition-all duration-300 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-neon-blue mb-1">Front-End Developer</h3>
              <h4 className="text-lg text-white/90 mb-3">Information Management Course Project</h4>
              <p className="text-base text-white/70 leading-relaxed">Developed the front-end for a co-working space booking system, collaborating with cross-functional roles to design, deploy, and present the final application.</p>
              <div className="flex flex-col gap-3 mt-auto">
                <div className="flex">
                  <span className="px-3 py-1 mt-6 text-sm font-semibold bg-white/10 text-white/80 border border-white/20 rounded-md">Feb 2026 - Jun 2026</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="px-3 py-1 text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 rounded-md">HTML</span>
                  <span className="px-3 py-1 text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/30 rounded-md">CSS</span>
                  <span className="px-3 py-1 text-xs font-medium bg-pink-500/10 text-pink-500 border border-pink-500/30 rounded-md">JS</span>
                  <span className="px-3 py-1 text-xs font-medium bg-orange-400/10 text-orange-400 border border-orange-400/30 rounded-md">Gemini</span>
                  <span className="px-3 py-1 text-xs font-medium bg-neon-blue/10 text-neon-blue border border-neon-blue/30 rounded-md">GitHub</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CERTIFICATIONS SECTION --- */}
      <section id="certifications" className="relative z-10 min-h-screen flex items-center px-6 md:px-16 text-gray-900 py-20 transition-colors duration-500">
        <div ref={certificationsRef} className="w-full max-w-7xl mx-auto text-left space-y-8 px-2 md:px-0">
          
          <h2 className="text-4xl md:text-6xl font-black uppercase text-black tracking-wider flex items-center gap-3">
            Certifications<span className="text-neon-blue">.</span>
          </h2>
          <div className="w-full h-[2px] bg-black/20"></div>
          
          <div className="grid grid-cols-1 gap-6 max-w-5xl font-mono">
            <div className="cert-card flex flex-col md:flex-row p-6 rounded-xl bg-black/5 border border-black/10 hover:border-neon-blue/50 transition-all duration-300 backdrop-blur-sm gap-6">
              <div className="flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-neon-blue mb-1">From Ideas to Investment: VC Webinar for Startups</h3>
                <h4 className="text-lg text-gray-800 mb-3 mt-2">Department of Information and Communications Technology</h4>
                <p className="text-base text-gray-700 leading-relaxed">Gained actionable insights into venture capital (VC) funding lifecycles and the core metrics investors evaluate when assessing early-stage tech startups.</p>
                <div className="flex flex-col gap-3 mt-auto">
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="px-3 py-1 mt-6 text-sm font-semibold bg-yellow/10 text-orange-400 border border-yellow rounded-md">Issued: Mar 2026</span>
                    <a href="https://drive.google.com/file/d/1aWdQfD3hPc30NzZYbt_1E2aGEb_f8rLd/view" target="_blank" rel="noopener noreferrer" className="px-3 py-1 mt-6 text-sm font-semibold bg-pink/20 text-pink/60 border border-pink rounded-md">Check Credential</a>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-48 lg:w-64 h-auto border-dashed border-black/20 rounded-lg flex items-center justify-center shrink-0 overflow-hidden mt-2 md:mt-0">
                <img src={`${import.meta.env.BASE_URL}01.png`} 
                      alt="certificate"
                      className="w-full h-auto object-contain rounded-lg shadow-sm"      
                />
              </div>
            </div>
            
            <div className="cert-card flex flex-col md:flex-row p-6 rounded-xl bg-black/5 border border-black/10 hover:border-neon-blue/50 transition-all duration-300 backdrop-blur-sm gap-6">
              <div className="flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-neon-blue mb-1">Data to Insights: Introduction to Business Intelligence with Power BI</h3>
                <h4 className="text-lg text-gray-800 mb-3 mt-2">Department of Information and Communications Technology</h4>
                <p className="text-base text-gray-700 leading-relaxed">Completed a 4-hour technical training focused on foundational Business Intelligence concepts and data visualization using Microsoft Power BI. Learned to transform raw dataset structures into interactive dashboards and visual reports to support data-driven decision-making.</p>
                <div className="flex flex-col gap-3 mt-auto">
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="px-3 py-1 mt-6 text-sm font-semibold bg-yellow/10 text-orange-400 border border-yellow rounded-md">Issued: Feb 2026</span>
                    <a href="https://sites.google.com/dict.gov.ph/ilcd-r9basulta/2026/february/26sul-dwi02-022716?pli=1&authuser=0" target="_blank" rel="noopener noreferrer" className="px-3 py-1 mt-6 text-sm font-semibold bg-pink/20 text-pink/60 border border-pink rounded-md">Check Credential</a>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-48 lg:w-64 h-auto border-dashed border-black/20 rounded-lg flex items-center justify-center shrink-0 overflow-hidden mt-2 md:mt-0">
                <img src={`${import.meta.env.BASE_URL}02.jpg`} 
                      alt="certificate" 
                      className="w-full h-auto object-contain rounded-lg shadow-sm"      
                />
              </div>
            </div>

            <div className="cert-card flex flex-col md:flex-row p-6 rounded-xl bg-black/5 border border-black/10 hover:border-neon-blue/50 transition-all duration-300 backdrop-blur-sm gap-6">
              <div className="flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-neon-blue mb-1">Java Fundamentals</h3>
                <h4 className="text-lg text-gray-800 mb-3 mt-2">DataCamp</h4>
                <p className="text-base text-gray-700 leading-relaxed">Completed a comprehensive 20-hour skill track focused on foundational Java programming and core software development concepts. Developed core logic and algorithmic thinking by mastering control flow structures, loops, method declarations, and array manipulations.</p>
                <div className="flex flex-col gap-3 mt-auto">
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="px-3 py-1 mt-6 text-sm font-semibold bg-yellow/10 text-orange-400 border border-yellow rounded-md">Issued: Jan 2026</span>
                    <a href="https://www.datacamp.com/completed/statement-of-accomplishment/track/81389061fd2afec4db7a62f8325fbf7a04e9e873" target="_blank" rel="noopener noreferrer" className="px-3 py-1 mt-6 text-sm font-semibold bg-pink/20 text-pink/60 border border-pink rounded-md">Check Credential</a>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-48 lg:w-64 h-auto border-dashed border-black/20 rounded-lg flex items-center justify-center shrink-0 overflow-hidden mt-2 md:mt-0">
                <img src={`${import.meta.env.BASE_URL}03.png`} 
                      alt="certificate" 
                      className="w-full h-auto object-contain rounded-lg shadow-sm"      
                />
              </div>
            </div>

            <div className="cert-card flex flex-col md:flex-row p-6 rounded-xl bg-black/5 border border-black/10 hover:border-neon-blue/50 transition-all duration-300 backdrop-blur-sm gap-6">
              <div className="flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-neon-blue mb-1">Intermediate Java</h3>
                <h4 className="text-lg text-gray-800 mb-3 mt-2">DataCamp</h4>
                <p className="text-base text-gray-700 leading-relaxed">Completed a 4-hour course focused on deepening core Object-Oriented Programming (OOP) concepts in Java. Learned key software design principles, including inheritance, polymorphism, abstract classes, and interfaces to build modular application structures.</p>
                <div className="flex flex-col gap-3 mt-auto">
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="px-3 py-1 mt-6 text-sm font-semibold bg-yellow/10 text-orange-400 border border-yellow rounded-md">Issued: Nov 2025</span>
                    <a href="https://www.datacamp.com/completed/statement-of-accomplishment/course/1bb9372d223619574aa564bd1a9939972a989b82" target="_blank" rel="noopener noreferrer" className="px-3 py-1 mt-6 text-sm font-semibold bg-pink/20 text-pink/60 border border-pink rounded-md">Check Credential</a>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-48 lg:w-64 h-auto border-dashed border-black/20 rounded-lg flex items-center justify-center shrink-0 overflow-hidden mt-2 md:mt-0">
                <img src={`${import.meta.env.BASE_URL}06.png`} 
                      alt="certificate" 
                      className="w-full h-auto object-contain rounded-lg shadow-sm"      
                />
              </div>
            </div>

            <div className="cert-card flex flex-col md:flex-row p-6 rounded-xl bg-black/5 border border-black/10 hover:border-neon-blue/50 transition-all duration-300 backdrop-blur-sm gap-6">
              <div className="flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-neon-blue mb-1">Intermediate SQL</h3>
                <h4 className="text-lg text-gray-800 mb-3 mt-2">DataCamp</h4>
                <p className="text-base text-gray-700 leading-relaxed">Completed a 4-hour hands-on course focusing on advanced relational database querying and data filtering techniques. Learned multi-table joins (INNER, LEFT, RIGHT, FULL), set operations, and relational data querying across complex database structures.</p>
                <div className="flex flex-col gap-3 mt-auto">
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="px-3 py-1 mt-6 text-sm font-semibold bg-yellow/10 text-orange-400 border border-yellow rounded-md">Issued: Dec 2025</span>
                    <a href="https://www.datacamp.com/completed/statement-of-accomplishment/course/0e69c3172867a0e7d0a12bf64507489419833bde" target="_blank" rel="noopener noreferrer" className="px-3 py-1 mt-6 text-sm font-semibold bg-pink/20 text-pink/60 border border-pink rounded-md">Check Credential</a>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-48 lg:w-64 h-auto border-dashed border-black/20 rounded-lg flex items-center justify-center shrink-0 overflow-hidden mt-2 md:mt-0">
                <img src={`${import.meta.env.BASE_URL}04.png`} 
                      alt="certificate" 
                      className="w-full h-auto object-contain rounded-lg shadow-sm"      
                />
              </div>
            </div>

            <div className="cert-card flex flex-col md:flex-row p-6 rounded-xl bg-black/5 border border-black/10 hover:border-neon-blue/50 transition-all duration-300 backdrop-blur-sm gap-6">
              <div className="flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-neon-blue mb-1">Introduction to UI and UX Design Course</h3>
                <h4 className="text-lg text-gray-800 mb-3 mt-2">Codecademy</h4>
                <p className="text-base text-gray-700 leading-relaxed">Mastered foundational User Interface (UI) and User Experience (UX) design concepts, user research methodologies, and wireframing techniques. Practiced designing user-centered digital interfaces focusing on usability, visual hierarchy, information architecture, and accessibility standards.</p>
                <div className="flex flex-col gap-3 mt-auto">
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="px-3 py-1 mt-6 text-sm font-semibold bg-yellow/10 text-orange-400 border border-yellow rounded-md">Issued: Nov 2025</span>
                    <a href="https://www.codecademy.com/profiles/cloud6377250821/certificates/4ccef8d532484ea2aeec3b3b3dbb4f9c" target="_blank" rel="noopener noreferrer" className="px-3 py-1 mt-6 text-sm font-semibold bg-pink/20 text-pink/60 border border-pink rounded-md">Check Credential</a>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-48 lg:w-64 h-auto border-dashed border-black/20 rounded-lg flex items-center justify-center shrink-0 overflow-hidden mt-2 md:mt-0">
                <img src={`${import.meta.env.BASE_URL}05.png`} 
                      alt="certificate" 
                      className="w-full h-auto object-contain rounded-lg shadow-sm"      
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>
    </>
  );
};

export default App;