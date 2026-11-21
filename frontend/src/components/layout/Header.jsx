import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, ChevronDown, Globe2 } from 'lucide-react';

import InstagramIcon from '../ui/InstagramIcon';
import siteConfig from '../../config/site';

const GERMANY_PATHWAYS = [
  { label: 'Work in Germany',   path: '/work-in-germany',  desc: 'Employment pathways & work permits' },
  { label: 'Study in Germany',  path: '/study-in-germany', desc: 'University & degree programmes' },
  { label: 'Ausbildung',        path: '/ausbildung',       desc: 'Vocational dual training' },
];

const JOB_SECTORS = [
  { label: 'Nursing & Healthcare', path: '/jobs/nursing' },
  { label: 'Chef & Culinary',      path: '/jobs/chef' },
  { label: 'Engineering & Tech',   path: '/jobs/engineering' },
  { label: 'All Jobs',             path: '/jobs' },
];

const MOBILE_NAV = [
  { label: 'Home',              path: '/' },
  { label: 'All Jobs',          path: '/jobs' },
  { label: 'Nursing',           path: '/jobs/nursing' },
  { label: 'Chef',              path: '/jobs/chef' },
  { label: 'Engineering',       path: '/jobs/engineering' },
  { label: 'Work in Germany',   path: '/work-in-germany' },
  { label: 'Study in Germany',  path: '/study-in-germany' },
  { label: 'Ausbildung',        path: '/ausbildung' },
  { label: 'Services',          path: '/services' },
  { label: 'About Us',          path: '/about' },
  { label: 'Contact',           path: '/contact' },
];

export const Header = () => {
  const [isScrolled, setIsScrolled]     = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdown, setDropdown]         = useState(null); // 'jobs' | 'germany' | null
  const location = useLocation();
  const navRef   = useRef(null);

  /* Scroll detection */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close everything on route change */
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdown(null);
  }, [location]);

  /* Close dropdowns when clicking outside */
  useEffect(() => {
    const onClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setDropdown(null);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const isActive = (path) => location.pathname === path;
  const toggle   = (key) => setDropdown((prev) => (prev === key ? null : key));

  return (
    <>
      {/* Yellow top-stripe accent */}
      <div
        className="fixed top-0 left-0 right-0 z-50 h-[3px]"
        style={{ background: 'linear-gradient(to right, #FFC928, #E6B400, #FFC928)' }}
      />

      <header
        className="fixed left-0 right-0 z-40"
        style={{
          top: '3px',
          transition: 'background 0.3s ease, box-shadow 0.3s ease, border-bottom 0.3s ease',
          background: isScrolled ? 'rgba(15,23,42,0.97)' : 'rgba(15,23,42,0.88)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
          boxShadow: isScrolled ? '0 4px 24px rgba(0,0,0,0.3)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo (original unchanged) ── */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#F59E0B] flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                G
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-display">
                  GLOBAL<span className="text-[#F59E0B]">FLY</span>
                </span>
                <span className="text-[10px] uppercase font-semibold text-[#94A3B8] tracking-widest -mt-1">
                  Consultancy Pvt Ltd
                </span>
              </div>
            </Link>

            {/* ── Desktop nav ── */}
            <nav className="hidden lg:flex items-center gap-0.5" ref={navRef}>

              {/* Home */}
              <Link
                to="/"
                className={`nav-link px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
                  isActive('/') ? 'text-[#FFC928]' : 'text-white/80 hover:text-white'
                }`}
              >
                Home
              </Link>

              {/* Jobs dropdown */}
              <div className="relative">
                <button
                  className={`nav-link px-3 py-2 text-sm font-semibold flex items-center gap-1 transition-colors duration-200 ${
                    location.pathname.startsWith('/jobs') ? 'text-[#FFC928]' : 'text-white/80 hover:text-white'
                  }`}
                  onClick={() => toggle('jobs')}
                >
                  Jobs
                  <ChevronDown
                    className="w-3.5 h-3.5 transition-transform duration-200"
                    style={{ transform: dropdown === 'jobs' ? 'rotate(180deg)' : 'none' }}
                  />
                </button>
                {dropdown === 'jobs' && (
                  <div
                    className="absolute top-full left-0 mt-2 w-52 rounded-xl overflow-hidden shadow-2xl animate-fadeIn"
                    style={{ background: '#1A1A2E', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    {JOB_SECTORS.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="block px-4 py-3 text-sm font-semibold transition-colors hover:text-[#FFC928] hover:bg-white/5"
                        style={{ color: 'rgba(255,255,255,0.72)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Germany Pathways dropdown */}
              <div className="relative">
                <button
                  className={`nav-link px-3 py-2 text-sm font-semibold flex items-center gap-1 transition-colors duration-200 ${
                    ['/work-in-germany', '/study-in-germany', '/ausbildung'].includes(location.pathname)
                      ? 'text-[#FFC928]'
                      : 'text-white/80 hover:text-white'
                  }`}
                  onClick={() => toggle('germany')}
                >
                  <Globe2 className="w-3.5 h-3.5" />
                  Germany
                  <ChevronDown
                    className="w-3.5 h-3.5 transition-transform duration-200"
                    style={{ transform: dropdown === 'germany' ? 'rotate(180deg)' : 'none' }}
                  />
                </button>
                {dropdown === 'germany' && (
                  <div
                    className="absolute top-full left-0 mt-2 w-64 rounded-xl overflow-hidden shadow-2xl animate-fadeIn"
                    style={{ background: '#1A1A2E', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    {GERMANY_PATHWAYS.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="block px-4 py-3.5 group transition-colors hover:bg-white/5"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                      >
                        <div className="text-sm font-semibold text-white/88 group-hover:text-[#FFC928] transition-colors">
                          {item.label}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                          {item.desc}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Services */}
              <Link
                to="/services"
                className={`nav-link px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
                  isActive('/services') ? 'text-[#FFC928]' : 'text-white/80 hover:text-white'
                }`}
              >
                Services
              </Link>

              {/* About */}
              <Link
                to="/about"
                className={`nav-link px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
                  isActive('/about') ? 'text-[#FFC928]' : 'text-white/80 hover:text-white'
                }`}
              >
                About
              </Link>

              {/* Contact */}
              <Link
                to="/contact"
                className={`nav-link px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
                  isActive('/contact') ? 'text-[#FFC928]' : 'text-white/80 hover:text-white'
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* ── Desktop right CTAs ── */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit GLOBALFLY on Instagram"
                className="p-2 rounded-lg transition-all hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <InstagramIcon className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.68)' }} />
              </a>
              <Link to="/check-eligibility">
                <button className="btn-brand btn-brand-primary text-sm px-5 py-2.5">
                  Check Eligibility
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>

            {/* ── Mobile actions ── */}
            <div className="flex items-center gap-2 lg:hidden">
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit GLOBALFLY on Instagram"
                className="p-2 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <InstagramIcon className="w-5 h-5 text-white" />
              </a>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-white"
                style={{ background: 'rgba(255,255,255,0.08)' }}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-[67px]" />

      {/* ── Mobile menu overlay ── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-x-0 top-[67px] z-39 lg:hidden shadow-2xl animate-fadeIn"
          style={{ background: '#0F172A', borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-1">
            {MOBILE_NAV.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  color:      isActive(item.path) ? '#FFC928' : 'rgba(255,255,255,0.78)',
                  background: isActive(item.path) ? 'rgba(255,201,40,0.09)' : 'transparent',
                }}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 mt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <Link to="/check-eligibility" className="block w-full">
                <button className="btn-brand btn-brand-primary w-full justify-center">
                  Check Eligibility <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
