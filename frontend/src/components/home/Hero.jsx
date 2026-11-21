import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Compass, HeartPulse, UtensilsCrossed,
  Wrench, GraduationCap, ChevronDown,
} from 'lucide-react';

const TRUST_ITEMS = [
  { icon: HeartPulse,       label: 'Nursing & Healthcare' },
  { icon: UtensilsCrossed,  label: 'Chef & Culinary' },
  { icon: Wrench,           label: 'Engineering & Tech' },
  { icon: GraduationCap,    label: 'Study & Ausbildung' },
];

const STATS = [
  { num: '3',    label: 'Core Career Pathways' },
  { num: 'A1–B2', label: 'German Language Support' },
  { num: '100%', label: 'Verified Employers' },
  { num: '6',    label: 'Step Recruitment Process' },
];

export const Hero = () => {
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const children = el.querySelectorAll('[data-animate]');
    children.forEach((child, i) => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(32px)';
      child.style.transition = `opacity 0.75s ease ${i * 0.15}s, transform 0.75s ease ${i * 0.15}s`;
      requestAnimationFrame(() => {
        setTimeout(() => {
          child.style.opacity = '1';
          child.style.transform = 'translateY(0)';
        }, 60);
      });
    });
  }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ background: '#111111' }}
    >
      {/* ── Geometric background decorations ── */}
      {/* Concentric rings top-right */}
      <div
        className="absolute top-[-130px] right-[-130px] w-[640px] h-[640px] rounded-full pointer-events-none animate-pulseGlow"
        style={{ border: '1px solid rgba(255,201,40,0.11)' }}
      />
      <div
        className="absolute top-[-70px] right-[-70px] w-[420px] h-[420px] rounded-full pointer-events-none animate-pulseGlow"
        style={{ border: '1px solid rgba(255,201,40,0.17)', animationDelay: '1s' }}
      />
      {/* Bottom-left ring */}
      <div
        className="absolute bottom-[-90px] left-[-90px] w-[500px] h-[500px] rounded-full pointer-events-none animate-pulseGlow"
        style={{ border: '1px solid rgba(255,201,40,0.09)', animationDelay: '1.5s' }}
      />
      {/* Rotating dashed orbit */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[820px] h-[820px] rounded-full pointer-events-none animate-rotateSlow hidden lg:block"
        style={{ border: '1px dashed rgba(255,201,40,0.055)' }}
      />
      {/* Ambient glow blobs */}
      <div
        className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none animate-floatSlow"
        style={{ background: 'rgba(255,201,40,0.055)' }}
      />
      <div
        className="absolute bottom-1/3 left-1/3 w-96 h-96 rounded-full blur-3xl pointer-events-none animate-floatSlow"
        style={{ background: 'rgba(255,201,40,0.038)', animationDelay: '2s' }}
      />

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-36 relative z-10 w-full">
        <div ref={textRef} className="max-w-5xl">

          {/* Badge */}
          <div data-animate className="mb-8">
            <span className="section-badge section-badge-yellow">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC928] animate-pulse" />
              Germany Overseas Recruitment &amp; Career Consultancy
            </span>
          </div>

          {/* Headline */}
          <h1
            data-animate
            className="font-display font-black leading-[1.04] tracking-tight mb-6 text-white"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)' }}
          >
            Your Career in{' '}
            <span className="brand-gradient-text">Germany</span>
            <br />
            Starts Here.
          </h1>

          {/* Subtitle */}
          <p
            data-animate
            className="text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl"
            style={{ color: 'rgba(255,255,255,0.62)' }}
          >
            We connect qualified nurses, chefs, engineers, and students with
            verified employers and institutions across Germany — with structured
            guidance from application to arrival.
          </p>

          {/* CTAs */}
          <div data-animate className="flex flex-wrap items-center gap-4 mb-14">
            <Link to="/jobs">
              <button className="btn-brand btn-brand-primary">
                Explore Opportunities
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link to="/check-eligibility">
              <button className="btn-brand btn-brand-outline">
                <Compass className="w-4 h-4" />
                Check Eligibility
              </button>
            </Link>
          </div>

          {/* Trust pill badges */}
          <div data-animate className="flex flex-wrap gap-3">
            {TRUST_ITEMS.map(({ icon: Icon, label }, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.055)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <Icon className="w-4 h-4" style={{ color: '#FFC928' }} />
                <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.72)' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <div
          className="mt-16 pt-12 border-t grid grid-cols-2 md:grid-cols-4 gap-8"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          {STATS.map(({ num, label }, i) => (
            <div key={i} className="text-left">
              <div
                className="font-display font-black text-3xl sm:text-4xl mb-1"
                style={{ color: '#FFC928' }}
              >
                {num}
              </div>
              <div
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: 'rgba(255,255,255,0.38)' }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-floatY">
        <span
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: 'rgba(255,255,255,0.28)' }}
        >
          Scroll
        </span>
        <ChevronDown className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.28)' }} />
      </div>
    </section>
  );
};

export default Hero;
