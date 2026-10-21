import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { navLinks } from '../../constants/index.js';

const Navbar = ({ isScrolled }) => {
  const navRef = useRef(null);

  const playHoverSound = () => {
    const audio = new Audio(`${import.meta.env.BASE_URL}select.m4a`);
    audio.volume = 0.1;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out' }
    );
  }, []);

  return (
    <nav 
      ref={navRef} 
      className={`fixed z-50 transition-all duration-700 ease-in-out flex ${
        isScrolled 
          ? 'top-0 left-0 w-full h-20 flex-row items-center justify-between px-12 bg-transparent' 
          : 'top-10 left-10 h-auto w-60 flex-col py-12 px-8 bg-transparent'
      }`}
    >
      {/* Game Logo / Title */}
      <a href="#home" className={`flex items-center gap-2 group ${isScrolled ? 'mb-0' : 'mb-12'}`}>
        <span className="text-[#F2842F] font-mono tracking-widest text-lg">[</span>
        {/* Logo text turns white when scrolled, black at the top */}
        <span className={`font-extrabold tracking-wider uppercase text-2xl group-hover:text-[#F2842F] transition-colors ${
          isScrolled ? 'text-white' : 'text-black'
        }`}>
          jedel.exe
        </span>
        <span className="text-[#F2842F] font-mono tracking-widest text-lg">]</span>
      </a>

      {/* Menu Options */}
      <ul className={`flex ${isScrolled ? 'flex-row gap-8' : 'flex-col gap-6'}`}>
        {navLinks.map((link) => (
          <li key={link.id}>
            <a 
              href={`#${link.id}`} 
              onMouseEnter={playHoverSound}
              className="relative flex items-center font-semibold uppercase tracking-widest text-sm py-2 group transition-all"
            >
              {/* Hover Caret Effect */}
              <span className={`absolute text-[#F2842F] transition-all duration-200 font-mono opacity-0 group-hover:opacity-100 ${
                isScrolled ? '-top-3 left-1/2 -translate-x-1/2 text-xs' : '-left-6'
              }`}>
                {isScrolled ? '.' : '>'}
              </span>
              
              {/* Link text turns white when scrolled, dark gray at the top */}
              <span className={`transition-colors group-hover:text-[#F2842F] ${
                isScrolled ? 'text-white' : 'text-gray-700'
              }`}>
                {link.title}
              </span>

              {/* Bottom underline on hover */}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#F2842F] transition-all duration-300 group-hover:w-full"></span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;