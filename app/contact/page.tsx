'use client';

import { useEffect, useState } from 'react';
import Section from '@/components/Section';
import Button from '@/components/Button';
import FaqItem from '@/components/FaqItem';
import PageEndBlob from '@/components/PageEndBlob';
import Footer from '@/components/Footer';
import { faqSections } from '@/data/faqContent';

// Contact page button colors
const contactButtonColors = {
  fg: '#474e3a',      // Dark green text in non-hovered state
  fgHover: '#f6edd0', // Light cream text on hover
  bgHover: '#474e3a', // Dark green background on hover
};

// Button colors for the green card section (Schedule a Free Consultation)
const cardButtonColors = {
  fg: '#474e3a',      // Dark green text in non-hovered state
  fgHover: '#93a378', // Sage green text on hover
  bgHover: '#474e3a', // Dark green background on hover
};

export default function ContactPage() {
  // Track which FAQ is expanded (format: "sectionIndex-faqIndex")
  const [expandedFaq, setExpandedFaq] = useState<string | null>('0-0');

  useEffect(() => {
    // Native scroll; no smooth scroll library needed
  }, []);

  return (
    <main className="min-h-screen bg-[#f6edd0] relative">
      {/* Introduction Section */}
      <Section
        id="contact"
        className="relative z-10 min-h-[60vh] flex flex-col items-center justify-center px-8 pt-[200px] pb-24"
      >
        <div className="max-w-[687px] mx-auto text-center flex flex-col gap-5">
          <h1
            className="text-[48px] leading-normal text-[#474e3a]"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            We're here to support your journey
          </h1>
          <p
            className="text-[24px] leading-normal text-[#474e3a]"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
          >
            Whether you have questions about our approach, need guidance choosing the right therapy,
            or want to learn more about upcoming immersions and trainings, we're here to help. Your
            healing journey begins with a conversation.
          </p>
        </div>
      </Section>

      {/* Contact Info & Map Section */}
      <Section id="contact-info" className="relative z-10 w-full px-4 sm:px-8 pb-24">
        <div className="max-w-[1347px] mx-auto">
          <div className="bg-[#93a378] rounded-[24px] p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row gap-0 lg:gap-10 items-stretch">
            {/* Contact Information */}
            <div className="flex-1 flex flex-col gap-3 sm:gap-4 lg:p-5">
              <div className="mb-1">
                <p
                  className="text-[18px] sm:text-[20px] lg:text-[24px] leading-normal text-[#474e3a]"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
                >
                  Get In Touch
                </p>
              </div>

              <h2
                className="text-[28px] sm:text-[32px] lg:text-[36px] leading-normal text-[#474e3a] mb-1 sm:mb-2"
                style={{ fontFamily: 'var(--font-saphira), serif' }}
              >
                Antar Pravaah
              </h2>

              {/* Address */}
              <div
                className="text-[#474e3a]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif' }}
              >
                <p className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[20px] sm:leading-[22px] lg:leading-[24px] mb-0" style={{ fontWeight: 500 }}>Address</p>
                <p className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[20px] sm:leading-[22px] lg:leading-[24px] mb-0" style={{ fontWeight: 400 }}>Chittaranjan Park,</p>
                <p className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[20px] sm:leading-[22px] lg:leading-[24px]" style={{ fontWeight: 400 }}>New Delhi, India</p>
              </div>

              {/* Phone */}
              <div
                className="text-[#474e3a]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif' }}
              >
                <p className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[20px] sm:leading-[22px] lg:leading-[24px] mb-0" style={{ fontWeight: 500 }}>Contact Number</p>
                <p className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[20px] sm:leading-[22px] lg:leading-[24px]" style={{ fontWeight: 400 }}>+91 98765 43210</p>
              </div>

              {/* Email */}
              <div
                className="text-[#474e3a]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif' }}
              >
                <p className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[20px] sm:leading-[22px] lg:leading-[24px] mb-0" style={{ fontWeight: 500 }}>Email</p>
                <p className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[20px] sm:leading-[22px] lg:leading-[24px]" style={{ fontWeight: 400 }}>hello@antarpravaah.com</p>
              </div>

              {/* Hours - Monday to Friday */}
              <div
                className="text-[#474e3a]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
              >
                <p className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[20px] sm:leading-[22px] lg:leading-[24px] mb-0">Monday - Friday</p>
                <p className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[20px] sm:leading-[22px] lg:leading-[24px]">10:00 AM - 7:00 PM</p>
              </div>

              {/* Hours - Saturday */}
              <div
                className="text-[#474e3a]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
              >
                <p className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[20px] sm:leading-[22px] lg:leading-[24px] mb-0">Saturday</p>
                <p className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[20px] sm:leading-[22px] lg:leading-[24px]">10:00 AM - 5:00 PM</p>
              </div>

              {/* CTA Button */}
              <div className="mt-4 sm:mt-6 lg:mt-auto pt-2 sm:pt-4 flex justify-center lg:justify-start">
                <Button
                  text="Schedule a Free Consultation"
                  size="medium"
                  colors={cardButtonColors}
                />
              </div>
            </div>

            {/* Map */}
            <div className="flex-1 mt-6 lg:mt-0 h-[280px] sm:h-[350px] lg:min-h-[600px] rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14022.234567890123!2d77.2500!3d28.5355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3e564c2e5e5%3A0x1234567890abcdef!2sChittaranjan%20Park%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Antar Pravaah Location - Chittaranjan Park, New Delhi"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section id="faq" className="relative z-10 w-full px-8 pb-24">
        <div className="max-w-[840px] mx-auto flex flex-col gap-10">
          {/* FAQ Header */}
          <div className="text-center flex flex-col gap-5">
            <h2
              className="text-[48px] leading-normal text-[#474e3a]"
              style={{ fontFamily: 'var(--font-saphira), serif' }}
            >
              Frequently Asked Questions
            </h2>
            <div
              className="text-[16px] leading-[24px] text-[#474e3a]"
              style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
            >
              <p className="mb-2">Here are answers to the questions we hear most often.</p>
              <p>If you don't find what you're looking for, please reach out—we're happy to help.</p>
            </div>
          </div>

          {/* FAQ Sections */}
          {faqSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="flex flex-col items-start w-full max-w-[637px] mx-auto">
              {/* Section Header */}
              <div className="w-full text-center py-4">
                <h3
                  className="text-[24px] leading-normal text-[#93a378]"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
                >
                  {section.title}
                </h3>
              </div>

              {/* Section Separator */}
              <div className="w-full flex items-center justify-center py-5">
                <img
                  src="/section_separator.svg"
                  alt=""
                  className="w-[34px] h-[35px]"
                  style={{
                    filter:
                      'brightness(0) saturate(100%) invert(64%) sepia(18%) saturate(548%) hue-rotate(46deg) brightness(91%) contrast(86%)',
                  }}
                />
              </div>

              {/* FAQ Items */}
              {section.faqs.map((faq, faqIndex) => {
                const faqId = `${sectionIndex}-${faqIndex}`;
                return (
                  <FaqItem
                    key={faqIndex}
                    question={faq.question}
                    answer={faq.answer}
                    isExpanded={expandedFaq === faqId}
                    onToggle={() => setExpandedFaq(expandedFaq === faqId ? null : faqId)}
                  />
                );
              })}

              {/* Page End Blob */}
              <div className="w-full flex items-center justify-center py-5">
                <PageEndBlob color="#93a378" className="w-[163px] h-auto opacity-60" />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Final CTA Section */}
      <Section id="contact-cta" className="relative z-10 w-full px-8 pb-12">
        <div className="max-w-[840px] mx-auto text-center flex flex-col gap-8 items-center">
          <h2
            className="text-[36px] leading-normal text-[#93a378]"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            We're here to help
          </h2>
          <p
            className="text-[16px] leading-[24px] text-[#93a378] max-w-[600px]"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
          >
            Can't find the answer you're looking for? We're happy to discuss any questions or
            concerns you might have about your healing journey.
          </p>
          <div className="flex flex-col gap-3 items-center">
            <Button text="Book your first session" size="large" colors={contactButtonColors} />
          </div>
        </div>
      </Section>

      {/* Footer */}
      <Section id="contact-footer" className="relative z-10 w-full">
        <Footer />
      </Section>
    </main>
  );
}
