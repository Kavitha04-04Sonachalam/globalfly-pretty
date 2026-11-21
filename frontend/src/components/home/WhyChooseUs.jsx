import React from 'react';
import { Target, FileCheck, Languages, Send, Plane, ShieldCheck } from 'lucide-react';
import useScrollReveal from '../../hooks/useScrollReveal';

const FEATURES = [
  {
    icon: Target,
    title: 'Germany-Focused Guidance',
    desc: 'Specialized focus on German Skilled Immigration Act pathways, nursing recognition, and dual vocational training.',
  },
  {
    icon: ShieldCheck,
    title: 'Profile-Based Opportunity Matching',
    desc: 'We match candidate qualifications directly with active employer criteria, avoiding mismatch and wasted effort.',
  },
  {
    icon: FileCheck,
    title: 'Documentation Support',
    desc: 'Structured guidance on educational apostille, official translations, and recognition board submissions.',
  },
  {
    icon: Languages,
    title: 'Language Preparation Pathways',
    desc: 'Clear roadmaps for acquiring required A1, A2, B1, or B2 German language proficiency.',
  },
  {
    icon: Send,
    title: 'Application Assistance',
    desc: 'Professional CV formatting according to European standards and interview preparation.',
  },
  {
    icon: Plane,
    title: 'Pre-Departure & Relocation Support',
    desc: 'Briefing on accommodation search, German health insurance, tax registration, and cultural integration.',
  },
];

export const WhyChooseUs = () => {
  const ref = useScrollReveal({ stagger: true, staggerMs: 100 });

  return (
    <section ref={ref} style={{ background: '#FFFFFF', padding: '96px 0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 reveal">
          <span className="yellow-line-center" />
          <span className="section-badge section-badge-light mb-5 inline-flex">
            Why Choose GLOBALFLY
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl mb-4" style={{ color: '#111111' }}>
            Your Journey.{' '}
            <span style={{ color: '#FFC928' }}>Our Guidance.</span>
          </h2>
          <p className="text-base" style={{ color: '#6B7280' }}>
            Realistic, structured, and ethically grounded consultancy for candidates seeking legitimate
            employment and study opportunities in Germany.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={i}
              className="reveal card-light p-7"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(255,201,40,0.12)' }}
              >
                <Icon className="w-6 h-6" style={{ color: '#FFC928' }} />
              </div>
              <h3 className="font-display font-bold text-lg mb-3" style={{ color: '#111111' }}>
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
