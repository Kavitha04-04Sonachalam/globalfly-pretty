import React from 'react';
import { Briefcase, Clock, CheckCircle2, BellRing } from 'lucide-react';
import currentJobOpenings from '../../data/openings';
import useScrollReveal from '../../hooks/useScrollReveal';

export const CurrentOpeningsBanner = () => {
  const hasOpenings = currentJobOpenings && currentJobOpenings.length > 0;
  const ref = useScrollReveal();

  return (
    <section ref={ref} style={{ background: '#111111', padding: '80px 0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 reveal">
          <span className="yellow-line-center" />
          <span className="section-badge section-badge-yellow mb-5 inline-flex">
            <Briefcase className="w-3.5 h-3.5" />
            Germany Vacancy Registry
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl mb-4 text-white">
            Current Job <span style={{ color: '#FFC928' }}>Openings</span>
          </h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.46)' }}>
            Direct vacancy listings updated from our network of accredited German employers.
          </p>
        </div>

        {hasOpenings ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentJobOpenings.map((job) => (
              <div key={job.id} className="card-dark p-6">
                <h3 className="font-bold text-white text-lg mb-1">{job.title}</h3>
                <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {job.company} · {job.location}
                </p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.58)' }}>
                  {job.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          /* ── Intentional clean empty state ── */
          <div className="max-w-3xl mx-auto reveal">
            <div
              className="rounded-2xl p-8 sm:p-10"
              style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'rgba(255,201,40,0.1)',
                    border: '1px solid rgba(255,201,40,0.2)',
                  }}
                >
                  <BellRing className="w-7 h-7" style={{ color: '#FFC928' }} />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span
                      className="text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-md"
                      style={{ background: 'rgba(255,201,40,0.14)', color: '#FFC928' }}
                    >
                      Upcoming Batch Notice
                    </span>
                    <span
                      className="text-xs font-medium flex items-center gap-1"
                      style={{ color: 'rgba(255,255,255,0.4)' }}
                    >
                      <Clock className="w-3.5 h-3.5" /> Verified intake cycles
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl mb-2 text-white">
                    New Openings Are Updated Directly Through Employer Hiring Cycles
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.48)' }}>
                    We do not display simulated or unverified job listings. Real-time vacancies in German
                    healthcare, gastronomy, and engineering are published as employer quotas are confirmed.
                    Candidates who register below receive early candidate profiling and priority notification
                    when matching roles become available.
                  </p>
                </div>
              </div>

              {/* Quality standards */}
              <div
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
              >
                {[
                  '100% Verified German Employers',
                  'Zero Fictitious Postings',
                  'Early Pre-Screening Support',
                ].map((txt) => (
                  <div key={txt} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#FFC928' }} />
                    <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.58)' }}>
                      {txt}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CurrentOpeningsBanner;
