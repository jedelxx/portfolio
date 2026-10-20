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
  const bgOverlayRef = useRef(null); // Ref for solid dark background overlay

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
        scrub: 1.5,           
      },
    });
    
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: 250 },
      {
        opacity: 1,
        y: 0,
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C2C2C]">
          <h1 
            ref={introRef}
            className="text-white font-extrabold tracking-wider uppercase text-5xl md:text-5xl font-mono !text-white"          
          >
            jedel<span className="text-[#F2842F]">.</span>
          </h1>
        </div>
      )}

      {/* Global Full-Screen Base Light Background */}
      <div className="fixed inset-0 bg-[#FBFBFB] z-0" />

      {/* Global Full-Screen Solid Dark Background Overlay (Fades in on scroll) */}
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
        <section id="home" className="relative z-10 flex justify-center items-center min-h-screen">
          <img 
            ref={heroRef}
            src="/me.png" 
            alt="Profile" 
            className="max-w-md md:max-w-lg h-auto object-contain"
          />
        </section>

        {/* About Section */}
        <section id="about" ref={aboutRef} className="relative z-10 min-h-screen flex flex-col justify-center items-center px-6 text-[#FBFBFB]">
          <h2 className="text-3xl font-bold mb-4">About Me</h2>
          <p className="max-w-xl text-center opacity-90">
            Building high-performance web applications with React, Tailwind, and GSAP.
          </p>
        </section>
      </main>
    </>
  );
};

export default App;