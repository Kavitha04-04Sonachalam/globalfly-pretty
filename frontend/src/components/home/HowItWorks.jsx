import React from 'react';
import useScrollReveal from '../../hooks/useScrollReveal';

const STEPS = [
  {
    num: '01',
    title: 'Profile Assessment',
    desc: 'Submit your CV and details via our online portal or eligibility checker for initial review.',
  },
  {
    num: '02',
    title: 'Opportunity Matching',
    desc: 'Our consultants evaluate your qualification alignment with current Germany employer demand.',
  },
  {
    num: '03',
    title: 'Application & Documentation',
    desc: 'Prepare European format CV, document translations, and educational recognition files.',
  },
  {
    num: '04',
    title: 'Employer / Institution Process',
    desc: 'Interview coordination with partner German employers, healthcare networks, or vocational schools.',
  },
  {
    num: '05',
    title: 'Visa & Permit Guidance',
    desc: 'Step-by-step preparation for German Embassy / VFS appointments and document checklists.',
  },
  {
    num: '06',
    title: 'Pre-Departure Support',
    desc: 'Relocation briefing, health insurance guidance, and initial arrival coordination.',
  },
];

export const HowItWorks = () => {
  const ref = useScrollReveal({ stagger: true, staggerMs: 100 });

  return (
    <section ref={ref} style={{ background: '#111111', padding: '96px 0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 reveal">
          <span className="yellow-line-center" />
          <span className="section-badge section-badge-yellow mb-5 inline-flex">
            Structured Workflow
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl mb-4 text-white">
            How the Recruitment{' '}
            <span style={{ color: '#FFC928' }}>Process Works</span>
          </h2>
          <p className="text-base" style={{ color: 'rgba(255,255,255,0.48)' }}>
            A transparent six-step journey from your initial profile submission to onboarding in Germany.
          </p>
        </div>

        {/* Step cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STEPS.map(({ num, title, desc }, i) => (
            <div
              key={i}
              className="reveal card-dark p-7 relative overflow-hidden"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              {/* Faint large number background */}
              <div
                className="absolute -top-4 -right-2 font-display font-black text-8xl pointer-events-none select-none"
                style={{ color: 'rgba(255,201,40,0.055)', lineHeight: 1 }}
              >
                {num}
              </div>

              {/* Yellow step number (prominent) */}
              <div
                className="font-display font-black text-5xl mb-4 leading-none"
                style={{ color: 'rgba(255,201,40,0.22)' }}
              >
                {num}
              </div>

              {/* Yellow divider */}
              <div className="w-8 h-0.5 mb-5" style={{ background: '#FFC928' }} />

              <h3 className="font-display font-bold text-lg mb-3 text-white">{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.48)' }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
