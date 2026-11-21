import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Clock, ArrowUp, ShieldAlert } from 'lucide-react';
import InstagramIcon from '../ui/InstagramIcon';
import siteConfig from '../../config/site';

const FacebookIcon = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const SERVICES = [
  { label: 'Nursing Opportunities',  path: '/jobs/nursing' },
  { label: 'Chef Opportunities',     path: '/jobs/chef' },
  { label: 'Engineering & Tech',     path: '/jobs/engineering' },
  { label: 'Work in Germany',        path: '/work-in-germany' },
  { label: 'Study in Germany',       path: '/study-in-germany' },
  { label: 'Ausbildung',             path: '/ausbildung' },
];

const COMPANY = [
  { label: 'About Us',          path: '/about' },
  { label: 'All Jobs',          path: '/jobs' },
  { label: 'Services',          path: '/services' },
  { label: 'Contact',           path: '/contact' },
  { label: 'Check Eligibility', path: '/check-eligibility' },
  { label: 'For Employers',     path: '/employer' },
];

const LEGAL = [
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms',           path: '/terms' },
  { label: 'Cookie Policy',   path: '/cookie-policy' },
  { label: 'Visa Disclaimer', path: '/visa-disclaimer' },
];

export const Footer = () => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <footer style={{ background: '#0D0D0D', color: '#FFFFFF', borderTop: '1px solid rgba(255,255,255,0.06)' }}>

      {/* ── Yellow CTA strip ── */}
      <div style={{ background: '#FFC928', padding: '22px 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <p className="font-display font-black text-xl" style={{ color: '#111111' }}>
              Ready to Build Your Career in Germany?
            </p>
            <p className="text-sm font-medium mt-0.5" style={{ color: 'rgba(17,17,17,0.68)' }}>
              Connect with our team for a free eligibility assessment.
            </p>
          </div>
          <Link to="/check-eligibility">
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all hover:scale-105 active:scale-95 flex-shrink-0"
              style={{ background: '#111111', color: '#FFC928' }}
            >
              Check Eligibility
              <ArrowUp className="w-4 h-4 rotate-45" />
            </button>
          </Link>
        </div>
      </div>

      {/* ── Main footer body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Brand column */}
          <div>
            {/* Original logo — unchanged */}
            <Link to="/" className="flex items-center gap-2 mb-5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#F59E0B] flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                G
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-xl tracking-tight text-white">
                  GLOBAL<span className="text-[#F59E0B]">FLY</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Consultancy Pvt Ltd
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.48)' }}>
              We are an overseas recruitment &amp; career consultancy bridging ambitious candidates
              with verified employers across Germany.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow GLOBALFLY on Facebook"
                className="p-2.5 rounded-lg transition-all hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.09)' }}
              >
                <FacebookIcon className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.55)' }} />
              </a>
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow GLOBALFLY on Instagram"
                className="p-2.5 rounded-lg transition-all hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.09)' }}
              >
                <InstagramIcon className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.55)' }} />
              </a>
            </div>
          </div>

          {/* Services column */}
          <div>
            <h4
              className="font-display font-bold text-xs uppercase tracking-widest mb-5"
              style={{ color: '#FFC928' }}
            >
              Services
            </h4>
            <ul className="space-y-3">
              {SERVICES.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm transition-colors hover:text-[#FFC928]"
                    style={{ color: 'rgba(255,255,255,0.52)' }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h4
              className="font-display font-bold text-xs uppercase tracking-widest mb-5"
              style={{ color: '#FFC928' }}
            >
              Company
            </h4>
            <ul className="space-y-3">
              {COMPANY.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm transition-colors hover:text-[#FFC928]"
                    style={{ color: 'rgba(255,255,255,0.52)' }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4
              className="font-display font-bold text-xs uppercase tracking-widest mb-5"
              style={{ color: '#FFC928' }}
            >
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#FFC928' }} />
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.52)' }}>
                  info@globalflyconsultancy.com
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#FFC928' }} />
                <div className="text-sm space-y-0.5" style={{ color: 'rgba(255,255,255,0.52)' }}>
                  <div>+91 90000 00000</div>
                  <div>+49 30 0000 0000</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#FFC928' }} />
                <div className="text-sm space-y-0.5" style={{ color: 'rgba(255,255,255,0.52)' }}>
                  <div>Monday – Saturday</div>
                  <div>9:30 AM – 6:30 PM IST</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal disclaimer notice */}
        <div
          className="mt-14 p-5 rounded-2xl flex gap-3.5 items-start"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#FFC928' }} />
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <strong className="font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Statutory Regulatory Notice:{' '}
            </strong>
            GLOBALFLY Consultancy Pvt Ltd provides overseas career advisory, document assistance and
            candidate representation. Official visa, immigration and professional recognition decisions
            rest solely with statutory German authorities (BAMF, ZAB, regional health and commerce boards).
            We do not guarantee visa issuance or automatic placement outcomes.
          </p>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} GLOBALFLY Consultancy Pvt Ltd. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-5">
            {LEGAL.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-xs transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll to top */}
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll back to top"
          className="fixed bottom-6 right-6 w-11 h-11 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 z-50"
          style={{ background: '#FFC928' }}
        >
          <ArrowUp className="w-5 h-5 stroke-[2.5]" style={{ color: '#111111' }} />
        </button>
      )}
    </footer>
  );
};

export default Footer;
