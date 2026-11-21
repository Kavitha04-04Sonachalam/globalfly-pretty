import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Award, Users, Globe2 } from 'lucide-react';
import useScrollReveal from '../../hooks/useScrollReveal';

const PILLARS = [
  { icon: Globe2,       label: 'Germany Focused' },
  { icon: Award,        label: 'Verified Employers' },
  { icon: Users,        label: 'Candidate-First' },
];

export const AboutNaviVisaSection = () => {
  const ref = useScrollReveal();

  return (
    <section
      ref={ref}
      style={{ background: '#111111', padding: '96px 0', overflow: 'hidden' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — text content */}
          <div className="reveal-left">
            <span className="yellow-line" />
            <span className="section-badge section-badge-yellow mb-6 inline-flex">
              <ShieldCheck className="w-3.5 h-3.5" />
              Your Path to Professional Opportunities
            </span>

            <h2
              className="font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6"
              style={{ color: '#FFFFFF' }}
            >
              Connecting Talent with{' '}
              <span style={{ color: '#FFC928' }}>Careers in Germany</span>
            </h2>

            <p className="text-base leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.58)' }}>
              We're a dedicated, results-driven team of recruitment specialists who connect ambitious
              candidates with top employers across Germany. Backed by structured qualification
              recognition (Anerkennung), European CV preparation, and compliant immigration frameworks,
              we make overseas placement seamless, transparent, and human. As we grow, our mission stays
              the same: to deliver people-first guidance that helps individuals build thriving careers in Europe.
            </p>

            {/* Three mini-pillars */}
            <div className="grid grid-cols-3 gap-3 mb-10">
              {PILLARS.map(({ icon: Icon, label }, i) => (
                <div
                  key={i}
                  className="text-center p-4 rounded-xl"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: '#FFC928' }} />
                  <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.58)' }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <Link to="/about">
              <button className="btn-brand btn-brand-primary">
                About GLOBALFLY <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* Right — image with yellow border frame */}
          <div className="reveal-right relative">
            {/* Offset yellow border frame */}
            <div
              className="absolute -top-4 -right-4 w-full h-full rounded-2xl"
              style={{ border: '2px solid rgba(255,201,40,0.2)' }}
            />
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
                alt="GLOBALFLY Overseas Recruitment Team"
                className="w-full object-cover object-center"
                style={{ height: '460px' }}
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(17,17,17,0.6) 0%, transparent 50%)' }}
              />
              {/* Floating badge */}
              <div
                className="absolute bottom-6 left-6 right-6 p-4 rounded-xl"
                style={{
                  background: 'rgba(17,17,17,0.9)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: '#FFC928' }}
                  >
                    <Award className="w-5 h-5" style={{ color: '#111111' }} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Germany Recruitment Specialists</div>
                    <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.48)' }}>
                      Transparent candidate representation &amp; employer matching
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutNaviVisaSection;
