import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, UtensilsCrossed, Wrench, ArrowRight, CheckCircle2, Globe2 } from 'lucide-react';
import useScrollReveal from '../../hooks/useScrollReveal';

const ADS = [
  {
    id: 'nursing',
    title: 'Nursing Opportunities',
    sub: 'Healthcare & Clinical Care',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
    desc: 'Openings for B.Sc. and GNM qualified nurses in German hospitals and medical centres with full qualification recognition (Anerkennung) and language preparation support.',
    points: [
      'GNM & B.Sc. Registered Nurses',
      'Hospital & clinic networks across Germany',
      'Structured B1/B2 German guidance',
      'Long-term EU career progression',
    ],
    badge: 'High Healthcare Demand',
    icon: HeartPulse,
    route: '/jobs/nursing#nursing-form',
  },
  {
    id: 'chef',
    title: 'Chef Opportunities',
    sub: 'Hospitality & Culinary Arts',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800',
    desc: 'Positions for professional chefs and culinary specialists in established German restaurants, hotel dining rooms, and European hospitality establishments.',
    points: [
      'Indian, Continental & Multi-cuisine chefs',
      'Full-time German restaurant contracts',
      'Employer work permit support',
      'Competitive industry salary scale',
    ],
    badge: 'Active Culinary Placements',
    icon: UtensilsCrossed,
    route: '/jobs/chef#chef-form',
  },
  {
    id: 'engineering',
    title: 'Other Opportunities',
    sub: 'Engineering & Technology',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    desc: 'Technical career pathways for Mechanical, Electrical, Mechatronics, Automotive, and IT Engineers seeking fast-track employment under the EU Blue Card.',
    points: [
      'Mechanical, Electrical & Mechatronics',
      'IT, DevOps & Software Engineering',
      'Fast-track EU Blue Card eligibility',
      'German industrial hubs & tech parks',
    ],
    badge: 'Skilled Tech Pathways',
    icon: Wrench,
    route: '/jobs/engineering#engineering-form',
  },
];

export const JobAdvertisements = () => {
  const ref = useScrollReveal({ stagger: true, staggerMs: 120 });

  return (
    <section ref={ref} style={{ background: '#F9F9F9', padding: '96px 0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 reveal">
          <span className="yellow-line-center" />
          <span className="section-badge section-badge-light mb-5 inline-flex">
            <Globe2 className="w-3.5 h-3.5" style={{ color: '#D40511' }} />
            Three Core Germany Pathways
          </span>
          <h2
            className="font-display font-black text-4xl sm:text-5xl lg:text-6xl mb-4"
            style={{ color: '#111111' }}
          >
            Find Your Path to{' '}
            <span style={{ color: '#FFC928' }}>Germany</span>
          </h2>
          <p className="text-base" style={{ color: '#6B7280' }}>
            Select your professional sector below to connect directly with our recruitment consultants.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ADS.map((ad, idx) => {
            const Icon = ad.icon;
            return (
              <div
                key={ad.id}
                className="reveal group card-light overflow-hidden flex flex-col"
                style={{ transitionDelay: `${idx * 0.12}s` }}
              >
                {/* Card image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(17,17,17,0.82) 0%, transparent 58%)' }}
                  />
                  {/* Sub-category badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                      style={{ background: 'rgba(17,17,17,0.72)', color: '#FFFFFF', backdropFilter: 'blur(8px)' }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: '#FFC928' }} />
                      {ad.sub}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wide"
                      style={{ background: '#2563EB', color: '#FFFFFF' }}>
                      Germany
                    </span>
                  </div>
                  {/* Badge bottom */}
                  <div className="absolute bottom-4 left-4">
                    <span
                      className="px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wide"
                      style={{ background: '#FFC928', color: '#111111' }}
                    >
                      {ad.badge}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3
                    className="font-display font-black text-2xl mb-3 transition-colors group-hover:text-[#FFC928]"
                    style={{ color: '#111111' }}
                  >
                    {ad.title}
                    {ad.id === 'engineering' && (
                      <span className="block text-xs font-semibold mt-1" style={{ color: '#6B7280' }}>
                        (Engineering & Technical Opportunities)
                      </span>
                    )}
                  </h3>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: '#6B7280' }}>
                    {ad.desc}
                  </p>
                  <ul
                    className="space-y-2 mb-6 flex-grow"
                    style={{ borderTop: '1px solid #F3F4F6', paddingTop: '16px' }}
                  >
                    {ad.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#FFC928' }} />
                        <span className="text-xs font-medium" style={{ color: '#374151' }}>{pt}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to={ad.route} className="block mt-auto w-full">
                    <button className="btn-brand btn-brand-primary w-full justify-center">
                      Enquire Now <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JobAdvertisements;
