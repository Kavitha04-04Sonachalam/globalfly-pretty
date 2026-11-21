import React from 'react';
import { Star } from 'lucide-react';
import useScrollReveal from '../../hooks/useScrollReveal';

const TESTIMONIALS = [
  {
    name: 'Rohan Sharma',
    role: 'Registered Nurse',
    location: 'Frankfurt, Germany',
    text: 'The guidance provided by GLOBALFLY during my document translation and German B1 exam preparation made my journey smooth. The team gave realistic expectations at every step.',
    isSample: true,
  },
  {
    name: 'Anil Kumar',
    role: 'Specialty Chef',
    location: 'Munich, Germany',
    text: 'GLOBALFLY evaluated my culinary diploma and matched me with a high-standard employer in Bavaria. Their pre-departure orientation helped me adapt easily.',
    isSample: true,
  },
  {
    name: 'Priya Nair',
    role: 'Ausbildung Trainee (Healthcare)',
    location: 'Stuttgart, Germany',
    text: 'Joining an Ausbildung program in Germany was my dream. GLOBALFLY helped me understand the stipend structure, contract details, and embassy paperwork.',
    isSample: true,
  },
];

export const Testimonials = () => {
  const ref = useScrollReveal({ stagger: true, staggerMs: 120 });

  return (
    <section ref={ref} style={{ background: '#FFFFFF', padding: '96px 0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 reveal">
          <span className="yellow-line-center" />
          <span className="section-badge section-badge-light mb-5 inline-flex">
            Candidate Experiences
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl mb-4" style={{ color: '#111111' }}>
            Stories from Our{' '}
            <span style={{ color: '#FFC928' }}>Candidates</span>
          </h2>
          <p className="text-base" style={{ color: '#6B7280' }}>
            Read experience feedback from candidates guided through overseas career pathways.
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="reveal card-light p-8 flex flex-col justify-between relative"
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <div>
                {/* Star rating */}
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="w-4 h-4" style={{ color: '#FFC928', fill: '#FFC928' }} />
                  ))}
                </div>

                {/* Yellow quote mark */}
                <div
                  className="font-display font-black text-5xl mb-3 leading-none select-none"
                  style={{ color: '#FFC928' }}
                >
                  &ldquo;
                </div>

                <p className="text-sm leading-relaxed italic mb-6" style={{ color: '#374151' }}>
                  {t.text}
                </p>
              </div>

              <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '16px' }}>
                <div className="font-display font-bold text-sm" style={{ color: '#111111' }}>
                  {t.name}
                </div>
                <div className="text-xs mt-0.5" style={{ color: '#FFC928' }}>
                  {t.role}
                </div>
                <div className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                  {t.location}
                </div>
                {t.isSample && (
                  <div className="mt-3">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-semibold"
                      style={{ background: '#FFF8E1', color: '#7C5600' }}
                    >
                      Sample — replace with approved testimonial before launch
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
