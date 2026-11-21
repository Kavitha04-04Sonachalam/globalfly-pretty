import React from 'react';
import {
  GraduationCap, FileText, Languages, BookOpenCheck, Users, FolderCheck,
  ShieldAlert, ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useScrollReveal from '../../hooks/useScrollReveal';

const PILLARS = [
  {
    icon: GraduationCap,
    title: 'Professional Qualifications & Experience',
    desc: 'Evaluating formal diplomas, degrees, and verified clinical or industry experience against German labour market standards and regional occupation requirements.',
  },
  {
    icon: FileText,
    title: 'German-Style CV & Application Preparation',
    desc: 'Structuring application documents into a professional German tabular CV (Lebenslauf), complete with work certificates and transparent professional chronology.',
  },
  {
    icon: Languages,
    title: 'German Language Preparation Where Relevant',
    desc: 'Guiding candidates to appropriate CEFR language levels (A1 to B2), depending on role demands. Healthcare candidates focus on medical German terminology.',
  },
  {
    icon: BookOpenCheck,
    title: 'Qualification Recognition (Anerkennung)',
    desc: 'Providing accurate guidance on the official state-level Anerkennungsverfahren for regulated professions such as nursing, ensuring realistic expectation setting.',
  },
  {
    icon: Users,
    title: 'Employer Application & Interview Preparation',
    desc: 'Preparing candidates for structured virtual interviews with German hospital directors, head chefs, and technical hiring managers.',
  },
  {
    icon: FolderCheck,
    title: 'Documentation & Process Guidance',
    desc: 'Assistance with required sworn German translations, apostille verification, embassy checklist preparation, and work visa appointment scheduling.',
  },
];

export const GermanStandardsSection = () => {
  const ref = useScrollReveal({ stagger: true, staggerMs: 100 });

  return (
    <section ref={ref} style={{ background: '#F9F9F9', padding: '96px 0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 reveal">
          <span className="yellow-line-center" />
          <span className="section-badge section-badge-light mb-5 inline-flex">
            German Standards &amp; Compliance
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl mb-4" style={{ color: '#111111' }}>
            Preparing for Opportunities{' '}
            <span style={{ color: '#FFC928' }}>in Germany</span>
          </h2>
          <p className="text-base" style={{ color: '#6B7280' }}>
            Success in the German job market begins with thorough preparation, valid credential assessment,
            and understanding specific statutory requirements for your profession.
          </p>
        </div>

        {/* Guidance cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={i}
              className="reveal card-light p-7"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: '#111111' }}
              >
                <Icon className="w-6 h-6" style={{ color: '#FFC928' }} />
              </div>
              <h3 className="font-display font-bold text-base mb-3" style={{ color: '#111111' }}>
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* Statutory warning */}
        <div
          className="mt-10 p-5 rounded-2xl flex items-start gap-3.5 reveal"
          style={{ background: '#FFF9E6', border: '1px solid #FDE68A' }}
        >
          <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#D40511' }} />
          <div>
            <p className="font-bold text-sm mb-1" style={{ color: '#111111' }}>
              Important Statutory Information
            </p>
            <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>
              Official recognition of qualifications is determined solely by the competent regional German
              authorities (ZAB, state nursing boards, or IHK FOSA). Language prerequisites differ between
              occupations and federal states. GLOBALFLY provides professional advisory and guidance throughout
              the process; we do not issue German government certificates or make guaranteed placement promises.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center reveal">
          <Link to="/check-eligibility">
            <button className="btn-brand btn-brand-primary">
              Check Your Eligibility for Germany <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GermanStandardsSection;
