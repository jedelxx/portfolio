import React, { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/all';
import gsap from 'gsap';
import Navbar from './components/navbar';
import './style.css';

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const introRef = useRef(null);
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const skillsRef = useRef(null); // Ref for the new skills section animation
  const experienceRef = useRef(null);
  const bgOverlayRef = useRef(null); 
  
  // Hacker Glitch Text State
  const [displayText, setDisplayText] = useState('j3d3l.3x3');
  const [isStabilized, setIsStabilized] = useState(false);

  // 1. Array ref to store the text lines
  const bgLinesRef = useRef([]);

  // 2. Helper function goes right here!
  const addToBgLines = (el) => {
    if (el && !bgLinesRef.current.includes(el)) {
      bgLinesRef.current.push(el);
    }
  };

  //  Glitch & Text Scramble Effect during Preloader
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
        setIsStabilized(true); // Locks into the clean final font style
        clearInterval(interval);
      }

      iteration += 1 / 3; // Speed of the text decoding resolution
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Cinematic Intro Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoaded(true);
      }
    });

    tl.fromTo(
      introRef.current,
      { opacity: 0, 
        scale: 0.9 
      },
      { opacity: 1, 
        scale: 1, 
        duration: 1.2, 
        ease: 'power3.out' 
      })
    .to(introRef.current, { 
      opacity: 1,
      duration: 0.8 
      }) 
    .to(introRef.current, {
      opacity: 0,
      scale: 1.1,
      duration: 1,
      ease: 'power3.in',
    });
  }, []);
      
  useEffect(() => {
    if (!isLoaded) return;

    ScrollTrigger.create({
      trigger: aboutRef.current,
      start: 'top center',
      onEnter: () => setIsScrolled(true),
      onLeaveBack: () => setIsScrolled(false),
    });

    // Smoothly fade in the solid dark background across the entire screen
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
      bgLinesRef.current,
      { 
        opacity: 0, 
        x: -100 
      }, 
      {
        opacity: 1,
        x: 0, 
        duration: 1.4,
        ease: 'power3.out',
        stagger: 0.25, 
        delay: 0.7,
      }
    );
    
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, 
        x: -250 
      },
      {
        opacity: 1,
        x: 0,
        duration: 1.5,
        ease: 'circ.inOut',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );

    gsap.fromTo(
      aboutRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: aboutRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );

    // --- NEW SKILLS SECTION SCROLLTRIGGER ANIMATION ---
    gsap.fromTo(
      skillsRef.current,
      { opacity: 0, 
        y: 60, 
        scale: 0.95 
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: skillsRef.current,
          start: 'top 85%',
          toggleActions: 'play reverse play reverse',
        },
      }
    );
    // --- EXPERIENCE SECTION SCROLLTRIGGER ---
    if (experienceRef.current) {
      gsap.fromTo(
        experienceRef.current.children,
        { opacity: 0, 
          y: 40 
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2, // Cascades the animation across the header, line, and cards
          ease: 'power3.out',
          scrollTrigger: {
            trigger: experienceRef.current,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse',
          },
        }
      );
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
      <main className={`relative min-h-screen transition-all duration-700 z-10 ${
        isScrolled ? 'ml-0 w-full' : 'ml-72 w-[calc(100vw-18rem)]'
      } ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        
        <Navbar isScrolled={isScrolled} />
        
        {/* Hero Section */}
        <section id="home" className="relative flex justify-center items-center min-h-screen overflow-hidden">
          
        {/* Big Bold Background Text - 3 Clean Lines */}
        <h1 className="absolute z-0 top-[10%] left-[2%] text-6xl md:text-8xl lg:text-9xl font-black uppercase text-neon-blue select-none tracking-tighter text-left w-full px-8 md:px-16 max-w-7xl leading-none">
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

          {/* Foreground Profile Image */}
          <img 
            ref={heroRef}
            src={`${import.meta.env.BASE_URL}me.png`}
            alt="Profile" 
            className="relative z-10 max-w-md md:max-w-lg h-auto object-contain pointer-events-none"
          />
        </section>

      {/* About Section */}
      <section id="about" ref={aboutRef} className="relative z-10 min-h-screen flex items-center px-8 md:px-16 text-[#FBFBFB] py-20">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          <div className="text-left space-y-6 md:col-span-7 pl-4 md:pl-8">
            <h2 className="text-4xl md:text-5xl font-extrabold text-neon-blue tracking-wide">
              Hi! I’m Jenn (aka Jedel)!
            </h2>
            
            <p className="text-base md:text-xl font-semibold text-white/90 leading-relaxed">
              A third-year Information Technology student specializing in Information Systems Development at Polytechnic University of the Philippines – Manila.
            </p>

            <p className="text-base md:text-lg text-white/70 leading-relaxed">
              Currently, I’m diving deep into the world of front-end development, blending logic with design to build clean, intuitive user experiences.
            </p>

            <p className="text-base md:text-lg text-white/70 leading-relaxed">
              Beyond tech, I have a passion for videography, video editing, and gaming. When I’m not coding or designing, you’ll likely find me hanging out with street cats—my ultimate stress relievers!
            </p>
          </div>

          <div className="flex justify-end items-center w-full h-full pr-4 md:pr-12 md:col-span-5">
            <img 
              src={`${import.meta.env.BASE_URL}me1.jpeg`} 
              alt="portrait" 
              className="max-w-xs w-full h-auto object-cover rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        </div>
      </section>

      {/* --- SKILLS SECTION --- */}
      <section id="skills" className="relative z-10 min-h-screen flex items-center px-8 md:px-16 text-[#FBFBFB] py-20">
        <div ref={skillsRef} className="w-full max-w-7xl mx-auto text-left space-y-8 pl-4 md:pl-8">
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
      <section id="experience" className="relative z-10 min-h-screen flex items-center px-8 md:px-16 text-[#FBFBFB] py-20">
        <div ref={experienceRef} className="w-full max-w-7xl mx-auto text-left space-y-8 pl-4 md:pl-8">
          
          <h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-wider flex items-center gap-3">
            Experiences<span className="text-neon-blue">.</span>
          </h2>
          <div className="w-full h-[2px] bg-white/20"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl font-mono">
            <div className="experience-card p-6 rounded-xl bg-white/5 border border-white/10 hover:border-neon-blue/50 transition-all duration-300 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-neon-blue mb-1">Operations Associate</h3>
              <h4 className="text-lg text-white/90 mb-3">Google Developer Groups on Campus - PUP</h4>
              <p className="text-base text-white/70 leading-relaxed">Documented community events and software tutorials while managing event logistics to ensure seamless team access to critical materials.
              </p>
              {/* Year & Tech Stack Container */}
              <div className="flex flex-col gap-3 mt-auto">
                <div className="flex">
                  <span className="px-3 py-1 mt-6 text-sm font-semibold bg-white/10 text-white/80 border border-white/20 rounded-md">
                    Nov 2024 - Oct 2025
                  </span>
                </div>
              </div>
            </div>

            <div className="experience-card p-6 rounded-xl bg-white/5 border border-white/10 hover:border-neon-blue/50 transition-all duration-300 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-neon-blue mb-1">Operations Documentation Head</h3>
              <h4 className="text-lg text-white/90 mb-3">Kalikasan Kilos Kabataan - NSTP</h4>
              <p className="text-base text-white/70 leading-relaxed">Organized key social media assets to boost communications and directed the documentation team for the main NSTP event.
              </p>
              {/* Year & Tech Stack Container */}
              <div className="flex flex-col gap-3 mt-auto">
                <div className="flex">
                  <span className="px-3 py-1 mt-6 text-sm font-semibold bg-white/10 text-white/80 border border-white/20 rounded-md">
                    Dec 2024 - Jun 2025
                  </span>
                </div>
              </div>
            </div>

            <div className="experience-card p-6 rounded-xl bg-white/5 border border-white/10 hover:border-neon-blue/50 transition-all duration-300 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-neon-blue mb-1">Programming Cadet</h3>
              <h4 className="text-lg text-white/90 mb-3">Cisco NetConnect PUP - Manila</h4>
              <p className="text-base text-white/70 leading-relaxed">Continuous learner across diverse tech stacks and methodologies, building practical software solutions and providing cross-project technical support.
              </p>
              {/* Year & Tech Stack Container */}
              <div className="flex flex-col gap-3 mt-auto">
                <div className="flex">
                  <span className="px-3 py-1 mt-6 text-sm font-semibold bg-white/10 text-white/80 border border-white/20 rounded-md">
                    Nov 2025 - Mar 2026
                  </span>
                </div>
              </div>
            </div>

            <div className="experience-card p-6 rounded-xl bg-white/5 border border-white/10 hover:border-neon-blue/50 transition-all duration-300 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-neon-blue mb-1">UI/UX Cadet</h3>
              <h4 className="text-lg text-white/90 mb-3">Google Developer Groups on Campus - PUP</h4>
              <p className="text-base text-white/70 leading-relaxed">Applied UI/UX best practices learned through technical coursework to design and iterate on interactive projects in Figma.
              </p>
              {/* Year & Tech Stack Container */}
              <div className="flex flex-col gap-3 mt-auto">
                <div className="flex">
                  <span className="px-3 py-1 mt-6 text-sm font-semibold bg-white/10 text-white/80 border border-white/20 rounded-md">
                    Nov 2025 - Jun 2026
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="px-3 py-1 text-xs font-medium bg-neon-blue/10 text-neon-blue border border-neon-blue/30 rounded-md">
                    Figma
                  </span>
                </div>
              </div>
            </div>

            <div className="experience-card p-6 rounded-xl bg-white/5 border border-white/10 hover:border-neon-blue/50 transition-all duration-300 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-neon-blue mb-1">Front-End Developer</h3>
              <h4 className="text-lg text-white/90 mb-3">Information Management Course Project</h4>
              <p className="text-base text-white/70 leading-relaxed">Developed the front-end for a co-working space booking system, collaborating with cross-functional roles to design, deploy, and present the final application.
              </p>
              {/* Year & Tech Stack Container */}
              <div className="flex flex-col gap-3 mt-auto">
                <div className="flex">
                  <span className="px-3 py-1 mt-6 text-sm font-semibold bg-white/10 text-white/80 border border-white/20 rounded-md">
                    Feb 2026 - Jun 2026
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="px-3 py-1 text-xs font-medium bg-yellow/10 text-yellow border border-yellow/30 rounded-md">
                    HTML
                  </span>
                  <span className="px-3 py-1 text-xs font-medium bg-green/10 text-green border border-green/30 rounded-md">
                    CSS
                  </span>
                  <span className="px-3 py-1 text-xs font-medium bg-pink/10 text-pink border border-pink/30 rounded-md">
                    JS
                  </span>
                  <span className="px-3 py-1 text-xs font-medium bg-light-orange/10 text-light-orange border border-light-orange/30 rounded-md">
                    Gemini
                  </span>
                  <span className="px-3 py-1 text-xs font-medium bg-neon-blue/10 text-neon-blue border border-neon-blue/30 rounded-md">
                    GitHub
                  </span>
                </div>
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