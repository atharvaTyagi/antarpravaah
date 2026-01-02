export type PathType = 'bodywork' | 'energywork' | 'fcs-workshops' | 'trainings' | 'direct-conversation';

export interface QuestionOption {
  text: string;
  path: PathType[];
  weight: number;
}

export interface Question {
  number: number;
  title: string;
  subtitle?: string;
  options: QuestionOption[];
}

export const guidedJourneyQuestions: Question[] = [
  {
    number: 1,
    title: 'What brings you here today?',
    subtitle: 'Choose what resonates most with you right now.',
    options: [
      {
        text: 'I am suffering from a specific physiological condition',
        path: ['bodywork'],
        weight: 3,
      },
      {
        text: 'I am stuck in a loop. It\'s always the same thing',
        path: ['energywork'],
        weight: 3,
      },
      {
        text: 'I have tried everything, but nothing works',
        path: ['fcs-workshops'],
        weight: 3,
      },
      {
        text: 'Palliative care (also Cancer support)',
        path: ['direct-conversation'],
        weight: 5,
      },
      {
        text: 'I am looking for someone else',
        path: ['direct-conversation'],
        weight: 5,
      },
      {
        text: 'Everything seems wrong / I can\'t define it',
        path: ['direct-conversation'],
        weight: 5,
      },
    ],
  },
  {
    number: 2,
    title: 'Tell us more about what you\'re experiencing physically.',
    options: [
      {
        text: 'Pain / inflammation / discomfort',
        path: ['bodywork'],
        weight: 3,
      },
      {
        text: 'Nothing significant in the body, just random aches',
        path: ['energywork'],
        weight: 2,
      },
      {
        text: 'Low immunity / unexplained symptoms',
        path: ['fcs-workshops'],
        weight: 2,
      },
      {
        text: 'Chronic condition (Cancer, Heart disease, Arthritis, Neurological, Autoimmune)',
        path: ['fcs-workshops'],
        weight: 3,
      },
    ],
  },
  {
    number: 3,
    title: 'What are you experiencing emotionally?',
    options: [
      {
        text: 'Exhausted / tired / drained',
        path: ['bodywork'],
        weight: 2,
      },
      {
        text: 'Unhappy',
        path: ['energywork'],
        weight: 2,
      },
      {
        text: 'Anxious / Overwhelmed',
        path: ['energywork'],
        weight: 2,
      },
      {
        text: 'Angry / agitated',
        path: ['energywork', 'fcs-workshops'],
        weight: 2,
      },
      {
        text: 'Frustrated / Lonely / Isolated',
        path: ['fcs-workshops'],
        weight: 2,
      },
    ],
  },
  {
    number: 4,
    title: 'What is your burning question?',
    options: [
      {
        text: 'Is there anything you can do to help with the pain or discomfort?',
        path: ['bodywork'],
        weight: 2,
      },
      {
        text: 'What is causing this? / What am I missing?',
        path: ['energywork'],
        weight: 2,
      },
      {
        text: 'How do I overcome this?',
        path: ['energywork', 'fcs-workshops'],
        weight: 2,
      },
      {
        text: 'How do I let go?',
        path: ['fcs-workshops'],
        weight: 2,
      },
      {
        text: 'Is there more to life beyond this?',
        path: ['trainings'],
        weight: 3,
      },
    ],
  },
  {
    number: 5,
    title: 'What draws your curiosity?',
    options: [
      {
        text: 'The body',
        path: ['bodywork'],
        weight: 1,
      },
      {
        text: 'The mind',
        path: ['energywork'],
        weight: 1,
      },
      {
        text: 'The soul',
        path: ['fcs-workshops'],
        weight: 1,
      },
      {
        text: 'The Transcendental',
        path: ['trainings'],
        weight: 2,
      },
    ],
  },
  {
    number: 6,
    title: 'How deep is comfortable for you?',
    subtitle: 'This helps us recommend the right pace for your journey.',
    options: [
      {
        text: 'Curious',
        path: ['bodywork'],
        weight: 1,
      },
      {
        text: 'Concerned',
        path: ['energywork'],
        weight: 1,
      },
      {
        text: 'Committed',
        path: ['fcs-workshops'],
        weight: 1,
      },
      {
        text: 'Crossover',
        path: ['trainings'],
        weight: 2,
      },
    ],
  },
];

export interface PathRecommendation {
  path: PathType;
  title: string;
  message: string;
  primaryCta: string;
  secondaryCta: string;
}

export const pathRecommendations: Record<PathType, PathRecommendation> = {
  bodywork: {
    path: 'bodywork',
    title: 'Thank you for sharing this',
    message: 'Your body is calling for attention and care. Based on your responses, we recommend starting with hands-on, body-centered healing modalities that address physical symptoms while supporting your overall wellbeing.\n\nStarting something new takes courage. We honor where you are. Let\'s begin with a brief conversation to help you feel comfortable and clear about what to expect.',
    primaryCta: 'Reserve yourself a session',
    secondaryCta: 'Let me explore first',
  },
  energywork: {
    path: 'energywork',
    title: 'Thank you for sharing this',
    message: 'You\'re sensing that something deeper is at play—patterns, loops, or root causes that need to be understood and released. These energywork modalities help you explore the subconscious origins of your challenges and create profound, lasting shifts.\n\nStarting something new takes courage. We honor where you are. Let\'s begin with a brief conversation to help you feel comfortable and clear about what to expect.',
    primaryCta: 'Reserve yourself a session',
    secondaryCta: 'Let me explore first',
  },
  'fcs-workshops': {
    path: 'fcs-workshops',
    title: 'Thank you for sharing this',
    message: 'You\'re recognizing that your challenges may be connected to larger patterns—family systems, inherited dynamics, or the need for broader awareness and community support. These approaches work with systemic entanglements and collective healing energy.\n\nStarting something new takes courage. We honor where you are. Let\'s begin with a brief conversation to help you feel comfortable and clear about what to expect.',
    primaryCta: 'Reserve yourself a session',
    secondaryCta: 'Let me explore first',
  },
  trainings: {
    path: 'trainings',
    title: 'Thank you for sharing this',
    message: 'You\'re being called not just to heal, but to understand healing itself. Training programs offer comprehensive learning that transforms you while giving you the skills to support yourself, your loved ones, and potentially others professionally.\n\nWe have several introductory sessions where you can learn about various modalities, see demonstrations, and ask questions—all without any commitment to private sessions. Find one that calls to you.',
    primaryCta: 'Explore training programs',
    secondaryCta: 'Let me explore first',
  },
  'direct-conversation': {
    path: 'direct-conversation',
    title: 'Thank you for sharing this',
    message: 'Based on your responses, we think a conversation would be the best next step. This allows us to understand your specific situation and provide personalized guidance.',
    primaryCta: 'Schedule a consultation call',
    secondaryCta: 'Let me explore first',
  },
};

// Calculate the recommended path based on user answers
export function calculatePath(answers: Record<number, string>): PathType {
  const pathScores: Record<PathType, number> = {
    bodywork: 0,
    energywork: 0,
    'fcs-workshops': 0,
    trainings: 0,
    'direct-conversation': 0,
  };

  // Calculate scores for each path
  Object.entries(answers).forEach(([questionNum, answer]) => {
    const question = guidedJourneyQuestions.find((q) => q.number === parseInt(questionNum));
    if (question) {
      const option = question.options.find((opt) => opt.text === answer);
      if (option) {
        option.path.forEach((path) => {
          pathScores[path] += option.weight;
        });
      }
    }
  });

  // Find the path with the highest score
  let maxScore = 0;
  let recommendedPath: PathType = 'direct-conversation';

  (Object.entries(pathScores) as [PathType, number][]).forEach(([path, score]) => {
    if (score > maxScore) {
      maxScore = score;
      recommendedPath = path;
    }
  });

  return recommendedPath;
}

