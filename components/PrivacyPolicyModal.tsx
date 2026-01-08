'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  // Prevent body scroll when modal is open, always restore on close/unmount
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    const originalBodyOverflow = body.style.overflow;
    const originalHtmlOverflow = html.style.overflow;

    if (isOpen) {
      body.style.overflow = 'hidden';
      html.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
      html.style.overflow = '';
    }

    return () => {
      body.style.overflow = originalBodyOverflow;
      html.style.overflow = originalHtmlOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/60"
        onClick={onClose}
      />

      {/* Modal Container - No animation on container */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-8 pointer-events-none">
        <div
          className="relative w-full max-w-[1097px] max-h-[70vh] overflow-y-auto no-scrollbar rounded-[24px] shadow-2xl pointer-events-auto bg-[#2d291f]"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="relative w-full p-6 md:p-8"
          >
            {/* Close Button */}
            <div className="flex items-center justify-end mb-4 md:mb-6">
              <button
                onClick={onClose}
                className="flex h-6 w-6 items-center justify-center hover:opacity-70 transition-opacity"
                aria-label="Close modal"
              >
                <img
                  src="/Icon - Close.svg"
                  alt="Close"
                  className="w-6 h-6 invert brightness-200"
                />
              </button>
            </div>

            {/* Logo */}
            <div className="flex items-center justify-center mb-4 md:mb-6">
              <img
                src="/logo_full.svg"
                alt="Antar Pravaah"
                className="w-full max-w-[500px] md:max-w-[641px] h-auto"
              />
            </div>

            {/* Title */}
            <h1
              className="text-[#f6edd0] text-center text-[32px] md:text-[42px] leading-normal mb-6 md:mb-8"
              style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
            >
              Privacy Policy
            </h1>

            {/* Content Sections */}
            <div className="max-w-[900px] mx-auto flex flex-col gap-6 md:gap-8 text-[#f6edd0]">
              {/* Section 1 */}
              <section className="flex flex-col gap-3">
                <h2
                  className="text-center text-[16px] md:text-[20px] leading-normal uppercase tracking-[2px] md:tracking-[3px]"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                >
                  What personal data we collect and why we collect it
                </h2>
                <div
                  className="text-[14px] md:text-[16px] leading-[22px] md:leading-[26px] text-justify"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
                >
                  <p className="mb-4">
                    We collect and retain only the information which is necessary to provide you the support you have asked for. Measures have been put in place to safeguard the information provided via the website, email, or offline medium.
                  </p>
                  <p className="mb-4">
                    Basic information is sought in our contact form, that allows us to connect with you.
                  </p>
                  <p className="mb-4">
                    The client fit form collects information regarding your health concern – current and the past. This information assists in determining what facilitation can be provided and answer any queries you post in that.
                  </p>
                  <p className="mb-4">
                    We do not ask you for your debit/credit cards or other means of payments, on the website.
                  </p>
                  <p>
                    If you have queried prior, or participated in a workshop publicized on the website, we may retain your non-payment information and have it saved securely.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section className="flex flex-col gap-3">
                <h2
                  className="text-center text-[16px] md:text-[20px] leading-normal uppercase tracking-[2px] md:tracking-[3px]"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                >
                  Comments
                </h2>
                <div
                  className="text-[14px] md:text-[16px] leading-[22px] md:leading-[26px] text-justify"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
                >
                  <p className="mb-4">
                    When you leave a comment on the blog posts, the system collects data given in the comments form, the visitor's IP address, and browser user agent string to avoid spam.
                  </p>
                  <p className="mb-4">
                    We do not distribute or sell your information to anyone outside of our organization.
                  </p>
                  <p>
                    An anonymized string from your email address (also called a hash) may be sent to the Gravatar service for identity verification. After your comment is approved, your profile picture and comment become visible to the public.
                  </p>
                </div>
              </section>

              {/* Section 3 */}
              <section className="flex flex-col gap-3">
                <h2
                  className="text-center text-[16px] md:text-[20px] leading-normal uppercase tracking-[2px] md:tracking-[3px]"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                >
                  Cookies
                </h2>
                <p
                  className="text-[14px] md:text-[16px] leading-[22px] md:leading-[26px] text-justify"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
                >
                  If you leave a comment on a blog post, you may choose to save your name, email address and website in the cookies. We collect this data for your convenience so that you do not have to fill it again in the future. The cookies will last for a period of one year.
                </p>
              </section>

              {/* Section 4 */}
              <section className="flex flex-col gap-3">
                <h2
                  className="text-center text-[16px] md:text-[20px] leading-normal uppercase tracking-[2px] md:tracking-[3px]"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                >
                  Embedded content from other websites
                </h2>
                <div
                  className="text-[14px] md:text-[16px] leading-[22px] md:leading-[26px] text-justify"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
                >
                  <p className="mb-4">
                    We normally do not embed any content from third-party websites in our webpages and blogs.
                  </p>
                  <p className="mb-4">
                    In circumstances where it is necessary, this website may include embedded content (e.g. videos, images, articles, etc.). Embedded content from third-party websites behaves exactly the way as if the visitor has visited the other website.
                  </p>
                  <p>
                    If you visit the third-party website through a link embedded on one of our webpages, the third-party websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content.
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section className="flex flex-col gap-3">
                <h2
                  className="text-center text-[16px] md:text-[20px] leading-normal uppercase tracking-[2px] md:tracking-[3px]"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                >
                  Analytics
                </h2>
                <p
                  className="text-[14px] md:text-[16px] leading-[22px] md:leading-[26px] text-justify"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
                >
                  We use Google Analytics, one of the safest ways to work with data on websites. We use this data to gain insights into website usage and improvise your experience. This information may comprise tracking the pages you visit, the time you spend on each page, and your geographical location only if authorized by you while working on the setting of the page.
                </p>
              </section>

              {/* Section 6 */}
              <section className="flex flex-col gap-3">
                <h2
                  className="text-center text-[16px] md:text-[20px] leading-normal uppercase tracking-[2px] md:tracking-[3px]"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                >
                  Who we share your data with
                </h2>
                <p
                  className="text-[14px] md:text-[16px] leading-[22px] md:leading-[26px] text-justify"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
                >
                  We may be obligated to disclose your information in response to a subpeona, court order, or any other request by the government of India for legal proceedings.
                </p>
              </section>

              {/* Page end blob */}
              <div className="flex items-center justify-center py-3">
                <img
                  src="/page_end_blob.svg"
                  alt=""
                  className="w-[100px] md:w-[131px] h-auto"
                />
              </div>

              {/* Disclaimer Section */}
              <section className="flex flex-col gap-3">
                <h1
                  className="text-[#f6edd0] text-center text-[32px] md:text-[42px] leading-normal"
                  style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
                >
                  Disclaimer
                </h1>
                <div
                  className="text-[14px] md:text-[16px] leading-[22px] md:leading-[26px] text-justify"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
                >
                  <p className="mb-4">
                    We hold the right to change or update the information present on the site without prior notice.
                  </p>
                  <p>
                    This privacy policy is applicable only on the information presented on this site. The site may contain links to external websites (where necessary) for information purposes only. By citing external references, we cannot be held legally liable for their privacy policies and information security practices.
                  </p>
                </div>
              </section>

              {/* Section 8 */}
              <section className="flex flex-col gap-3">
                <h2
                  className="text-center text-[16px] md:text-[20px] leading-normal uppercase tracking-[2px] md:tracking-[3px]"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                >
                  Closing comments
                </h2>
                <div
                  className="text-[14px] md:text-[16px] leading-[22px] md:leading-[26px] text-justify"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
                >
                  <p className="mb-4">
                    We hope the Privacy Policy answers your questions and assures you that your data is safe with Prakritee. If you have any questions about this Privacy Policy, please contact us through the 'Contact' page. We typically respond to your questions within a week.
                  </p>
                  <p>
                    Continued use of this site automatically constitutes your acceptance to our Privacy Policy and disclaimer statement.
                  </p>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
