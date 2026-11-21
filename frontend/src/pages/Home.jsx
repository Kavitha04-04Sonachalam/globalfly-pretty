import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/home/Hero';
import JobAdvertisements from '../components/home/JobAdvertisements';
import AboutNaviVisaSection from '../components/home/AboutNaviVisaSection';
import WhyChooseUs from '../components/home/WhyChooseUs';
import HowItWorks from '../components/home/HowItWorks';
import GermanStandardsSection from '../components/home/GermanStandardsSection';
import CurrentOpeningsBanner from '../components/home/CurrentOpeningsBanner';
import Testimonials from '../components/home/Testimonials';
import ContactForm from '../components/forms/ContactForm';
import { MessageSquare } from 'lucide-react';

export const Home = () => {
  return (
    <>
      <Helmet>
        <title>GLOBALFLY | Germany Overseas Recruitment &amp; Career Consultancy</title>
        <meta
          name="description"
          content="Explore simplified career pathways to Germany for Nursing, Chef, and Engineering professionals with GLOBALFLY Consultancy Pvt Ltd."
        />
      </Helmet>

      <main>
        {/* 1. Hero — full-screen dark with animated geometry */}
        <Hero />

        {/* 2. Three Core Pathways — service cards on light bg */}
        <JobAdvertisements />

        {/* 3. About GLOBALFLY — dark section */}
        <AboutNaviVisaSection />

        {/* 4. Why Choose Us — white bg feature grid */}
        <WhyChooseUs />

        {/* 5. How It Works — dark numbered steps */}
        <HowItWorks />

        {/* 6. German Standards — light preparation cards */}
        <GermanStandardsSection />

        {/* 7. Current Openings — dark section */}
        <CurrentOpeningsBanner />

        {/* 8. Testimonials — white card grid */}
        <Testimonials />

        {/* 9. Contact — dark section with live form */}
        <section id="general-contact" style={{ background: '#111111', padding: '88px 0' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="section-badge section-badge-yellow mb-5 inline-flex">
                <MessageSquare className="w-3.5 h-3.5" />
                Get In Touch
              </span>
              <h2 className="font-display font-black text-4xl sm:text-5xl mb-4 text-white">
                Contact <span style={{ color: '#FFC928' }}>GLOBALFLY</span>
              </h2>
              <p className="text-base" style={{ color: 'rgba(255,255,255,0.52)' }}>
                Have a question? Our team responds within 24 hours.
              </p>
            </div>
            <div
              className="rounded-2xl p-6 sm:p-10"
              style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
