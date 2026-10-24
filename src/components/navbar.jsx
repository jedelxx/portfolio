import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { navLinks } from '../../constants/index.js';

const Navbar = ({ isScrolled, isDarkBg }) => {
  const navRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const playHoverSound = () => {
    const audio = new Audio(`${import.meta.env.BASE_URL}select.m4a`);
    audio.volume = 0.1;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out' }
    );
  }, []);

  return (
    <>
      {/* --- MOBILE NAVBAR --- */}
      <div 
        className={`md:hidden fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center transition-colors duration-300 ${
          isDarkBg || isOpen ? 'bg-black text-white' : 'bg-[#FBFBFB] text-black'
        } ${isScrolled && !isOpen ? 'shadow-md' : ''}`}
      >
        <a href="#home" onClick={closeMenu} className="flex items-center gap-2 group z-50">
          <span className="text-[#F2842F] font-mono tracking-widest text-lg">[</span>
          <span className="font-extrabold tracking-wider uppercase text-xl transition-colors duration-500">
            jedel.exe
          </span>
          <span className="text-[#F2842F] font-mono tracking-widest text-lg">]</span>
        </a>
        
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="z-50 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
        >
          <span className={`block w-8 h-1 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2.5 bg-[#F2842F]' : (isDarkBg ? 'bg-white' : 'bg-black')}`}></span>
          <span className={`block w-8 h-1 transition-all duration-300 ${isOpen ? 'opacity-0' : (isDarkBg ? 'bg-white' : 'bg-black')}`}></span>
          <span className={`block w-8 h-1 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2.5 bg-[#F2842F]' : (isDarkBg ? 'bg-white' : 'bg-black')}`}></span>
        </button>
      </div>

      {/* --- MOBILE FULLSCREEN MENU --- */}
      <div 
        className={`md:hidden fixed inset-0 z-40 bg-black text-[#FBFBFB] flex flex-col justify-center items-center transition-transform duration-500 ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <ul className="flex flex-col gap-8 text-center mt-8 w-full px-8">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a 
                href={`#${link.id}`} 
                onClick={closeMenu}
                onMouseEnter={playHoverSound}
                className="relative flex justify-center items-center font-bold uppercase tracking-widest text-2xl py-2 group transition-all w-max mx-auto"
              >
                <span className="transition-colors duration-500 group-hover:text-[#F2842F] text-white">
                  {link.title}
                </span>
                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[#F2842F] transition-all duration-300 group-hover:w-full"></span>
              </a>
            </li>
          ))}
          
          <li className="mt-4">
            <a 
              href="#contact" 
              onClick={closeMenu}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-sm font-bold uppercase tracking-wider text-black bg-white border border-white/10 shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-[#F2842F] hover:text-white group"
            >
              <span>Let's connect!</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">&gt;</span>
            </a>
          </li>
        </ul>
      </div>

      {/* --- DESKTOP NAVBAR --- */}
      <nav 
        ref={navRef} 
        className={`hidden md:flex fixed z-50 transition-all duration-700 ease-in-out ${
          isScrolled 
            ? 'top-0 left-0 w-full h-20 flex-row items-center justify-between px-12 bg-transparent' 
            : 'top-20 left-10 h-auto w-60 flex-col py-6 px-8 bg-transparent'
        }`}
      >
        <a href="#home" className={`flex items-center gap-2 group ${isScrolled ? 'mb-0' : 'mb-8'}`}>
          <span className="text-[#F2842F] font-mono tracking-widest text-lg">[</span>
          <span className={`font-extrabold tracking-wider uppercase text-2xl group-hover:text-[#F2842F] transition-colors duration-500 ${
            isDarkBg ? 'text-white' : 'text-black'
          }`}>
            jedel.exe
          </span>
          <span className="text-[#F2842F] font-mono tracking-widest text-lg">]</span>
        </a>

        <div className={`flex ${isScrolled ? 'flex-row items-center gap-8' : 'flex-col gap-6'}`}>
          <ul className={`flex ${isScrolled ? 'flex-row gap-8' : 'flex-col gap-6'}`}>
            {navLinks.map((link) => (
              <li key={link.id}>
                <a 
                  href={`#${link.id}`} 
                  onMouseEnter={playHoverSound}
                  className="relative flex items-center font-semibold uppercase tracking-widest text-sm py-2 group transition-all"
                >
                  <span className={`absolute text-[#F2842F] transition-all duration-200 font-mono opacity-0 group-hover:opacity-100 ${
                    isScrolled ? '-top-3 left-1/2 -translate-x-1/2 text-xs' : '-left-6'
                  }`}>
                    {isScrolled ? '.' : '>'}
                  </span>
                  
                  <span className={`transition-colors duration-500 group-hover:text-[#F2842F] ${
                    isDarkBg ? 'text-white' : 'text-gray-900'
                  }`}>
                    {link.title}
                  </span>

                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#F2842F] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            ))}
          </ul>

          {!isScrolled && (
            <div className="mt-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-black bg-white border border-black/10 shadow-md transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:bg-orange hover:text-white group"
              >
                <span>Let's connect!</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">&gt;</span>
              </a>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;