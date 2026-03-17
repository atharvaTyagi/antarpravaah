export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqSection {
  title: string;
  faqs: FaqItem[];
}

export const faqSections: FaqSection[] = [
  {
    title: 'Sessions',
    faqs: [
      {
        question: 'How do I know which therapy is right for me?',
        answer: `Everybody speaks a different language, and the right therapy is the one that resonates with you. If you're unsure, we offer a complimentary 15-minute consultation to help guide you to the modality that will serve your healing journey best. You can also read about each therapy on our <a href="/therapies" class="underline text-[#93a378] hover:text-[#474e3a]">Therapies page</a> or trust your intuition—what draws your attention is often what your body needs.`,
      },
      {
        question: 'How long is a typical session?',
        answer: `Session length varies by modality:<br/><br/>
        <ul class="list-disc pl-5 space-y-1">
          <li>Access Consciousness (Bars/Body Processes): 60-90 minutes</li>
          <li>Family Constellations: 90-120 minutes</li>
          <li>Foot Reflexology: 45-60 minutes</li>
          <li>Transpersonal Regression Therapy: 90-120 minutes</li>
          <li>Shamanic Healing: 90-120 minutes</li>
        </ul><br/>
        Your first session may be slightly longer to allow time for intake and discussion.`,
      },
      {
        question: 'How many sessions will I need?',
        answer: 'This varies greatly depending on what you\'re working with and your individual healing journey. Some people experience profound shifts in a single session, while others benefit from ongoing support over weeks or months. We\'ll discuss this during your first session and adjust as your healing unfolds. There\'s no pressure or requirement to commit to multiple sessions upfront.',
      },
      {
        question: 'What should I expect in my first session?',
        answer: 'Your first session begins with a conversation about what brought you here—your challenges, history, and what you\'re ready to transform. We\'ll explore personal and familial background to understand deeper patterns at play. Then we\'ll move into the healing work itself using the most appropriate modality. The session is unhurried and tailored to you.',
      },
      {
        question: 'What should I wear to a session?',
        answer: 'Wear comfortable, loose-fitting clothing. For most modalities, you remain fully clothed. For reflexology, you\'ll want clothing that allows easy access to arms, legs, and feet. Avoid wearing strong perfumes or scents.',
      },
      {
        question: 'Can I bring someone with me?',
        answer: 'Yes, you can. While healing is an individual journey, it\'s understandable if it\'s all too new and unfamiliar.',
      },
    ],
  },
  {
    title: 'Booking & Payment',
    faqs: [
      {
        question: 'How do I book a session?',
        answer: 'You can block a date through the modal by clicking the buttons on any page, or contact us directly via phone or email.',
      },
      {
        question: 'What is your cancellation policy?',
        answer: 'We understand that life happens. Please provide at least 24 hours notice if you need to cancel or reschedule. The session fee is payable in advance in order to book your slot. In the event you require cancellation, you can opt for another date and time.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: `We accept:<br/><br/>
        <ul class="list-disc pl-5 space-y-1">
          <li>Cash</li>
          <li>Bank Transfer (NEFT/RTGS)</li>
          <li>UPI/QR Code</li>
        </ul>`,
      },
    ],
  },
  {
    title: 'Events & Trainings',
    faqs: [
      {
        question: 'What\'s the difference between an event and a training?',
        answer: 'Events are thematic workshops and gatherings focused on exploration and group healing, typically lasting a few hours to a full day. They don\'t require prior experience and welcome anyone interested in the theme.<br/><br/>Trainings are comprehensive certification programs that teach you to practice healing modalities professionally. They range from one-day intensives to multi-month programs and result in professional certification.',
      },
      {
        question: 'Do I need prior experience to attend events?',
        answer: 'No prior experience is necessary. Events are designed to be accessible to everyone, whether you\'re completely new to healing work or have been on your journey for years.',
      },
      {
        question: 'Do you offer payment plans for trainings?',
        answer: 'Payments are offered only for select trainings, and at the discretion of the facilitator. Please contact us to discuss options.',
      },
      {
        question: 'Can I attend a training if I don\'t want to practice professionally?',
        answer: 'Absolutely! Many people take our trainings purely for personal growth and to become their own healer. The ability to work with family and friends is valuable even if you never practice professionally. The deepest healing often happens through learning to heal.',
      },
    ],
  },
  {
    title: 'The Approach',
    faqs: [
      {
        question: 'Is this spiritual or religious?',
        answer: 'Antar Pravaah is a spiritual practice rooted in ancient yogic wisdom and complemented by various healing modalities. It is not affiliated with any religion and welcomes people of all faiths and backgrounds. The work honors your individual belief system and spiritual path.',
      },
      {
        question: 'I\'m skeptical. Will this still work for me?',
        answer: 'Skepticism is natural and even healthy. The work doesn\'t require belief—it requires willingness. If you\'re willing to show up and be present with whatever arises, that\'s enough. Many of our most profound transformations have come from those who arrived skeptical but curious.',
      },
      {
        question: 'What if I\'m not "spiritual"?',
        answer: 'You don\'t need to identify as spiritual to benefit from this work. Whether you see these practices as energy work, somatic therapy, psychological exploration, or spiritual healing—all perspectives are valid. The work meets you where you are.',
      },
      {
        question: 'How is this different from therapy or counseling?',
        answer: 'While these modalities can address emotional and psychological patterns, they work through the body and energy system rather than primarily through talk therapy. Many clients work with both—they complement each other beautifully—therapy often helps process and integrate what emerges in healing sessions.',
      },
      {
        question: 'Can I continue my medical treatment while doing this work?',
        answer: 'Absolutely. These modalities complement conventional medical care—they don\'t replace it. Never discontinue prescribed treatments without consulting your physician. We work alongside your medical care to support your overall healing and wellbeing.',
      },
    ],
  },
  {
    title: 'Practical Questions',
    faqs: [
      {
        question: 'Where are you located? Do you offer online sessions?',
        answer: 'We\'re located in Chittaranjan Park, New Delhi. We offer both, in person and online sessions, based on what you are seeking.',
      },
      {
        question: 'Do you work with children?',
        answer: 'Yes, we work with children. A parent or guardian must be present for all sessions with children under 15.',
      },
      {
        question: 'Is this work trauma-informed?',
        answer: 'Yes. Namita is trained in working with trauma and creates a safe, contained space for all healing work. We work at your pace, honoring your boundaries, and ensuring you feel resourced and grounded throughout the process. You\'re always in control of how deep we go.',
      },
      {
        question: 'What if emotions come up during a session?',
        answer: 'Emotions arising during sessions are a part of the process. You\'re in a safe space to express whatever needs to move through you—tears, anger, joy, or whatever emerges. We hold space for all of it without judgment.',
      },
      {
        question: 'How do I prepare for my session?',
        answer: 'Come as you are. Eat lightly beforehand, stay hydrated, and try to arrive a few minutes early so you can settle in. If possible, avoid scheduling stressful activities immediately after your session—give yourself time to integrate. Bring any relevant medical information or history that might be helpful for us to know.',
      },
    ],
  },
];

