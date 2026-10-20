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
  const bgOverlayRef = useRef(null); 
  
  // 1. Array ref to store the text lines
  const bgLinesRef = useRef([]);

  // 2. Helper function goes right here!
  const addToBgLines = (el) => {
    if (el && !bgLinesRef.current.includes(el)) {
      bgLinesRef.current.push(el);
    }
  };

  

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
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }
    )
    .to(introRef.current, { opacity: 1, duration: 0.6 })
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
        stagger: 0.25, // Staggers line by line sequentially
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
  }, [isLoaded]);

  return (
    <>
      {/* preloader */}
      {!isLoaded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[black]">
          <h1 
            ref={introRef}
            className="text-white font-extrabold tracking-wider text-5xl md:text-5xl font-mono !text-white"          
          >
            jedel<span className="text-neon-blue">.</span>
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
        {/* Changed max-w-6xl to max-w-7xl to give it more breathing room */}
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text Content (Takes up 7 out of 12 columns ≈ 58%) */}
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

          {/* Right Column: Profile Image (Takes up 5 out of 12 columns ≈ 42%) */}
          <div className="flex justify-end items-center w-full h-full pr-4 md:pr-12 md:col-span-5">
            <img 
              src={`${import.meta.env.BASE_URL}me1.jpeg`} 
              alt="portrait" 
              className="max-w-xs w-full h-auto object-cover rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        </div>
      </section>
      </main>
    </>
  );
};

export default App;