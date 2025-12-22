import { SectionId } from '@/lib/themeConfig';

export interface ContentItem {
  id: SectionId;
  title: string;
  body: string;
  image: string;
}

export const contentData: ContentItem[] = [
  {
    id: 'hero',
    title: 'If we only remembered who we are',
    body: 'If we only remembered who we are, and why we are here, then life and everything that has happened in it, would make sense. We will no longer be lost or alone. We were, are and shall always be whole. That is the Antar Smaran Process.',
    image: '/images/hero.jpg',
  },
  {
    id: 'therapies',
    title: 'Therapies',
    body: 'Possibilities for Change. Combining bodywork and energy healing modalities opens powerful possibilities for healing—from acute and chronic illnesses to pain management, trauma release, and recovery from abuse.',
    image: '/images/therapies.jpg',
  },
  {
    id: 'approach',
    title: 'We Work Together',
    body: 'At Antar Pravaah, healing is a shared responsibility. We both do the work. Transformation demands commitment and persistence. It\'s not force, it\'s flow, but even in that, the commitment to follow the flow is integral to the work.',
    image: '/images/approach.jpg',
  },
  {
    id: 'immersions',
    title: 'Immersions & Trainings',
    body: 'Gather, Learn, Transform Together. Healing deepens when experienced in community. Whether you\'re exploring a theme that resonates with your journey, or stepping into the role of healer yourself, our immersions & trainings create sacred containers for collective transformation.',
    image: '/images/immersions.jpg',
  },
  {
    id: 'about',
    title: 'About Namita',
    body: 'Founder of Antar Pravaah | Healer & Facilitator | Host at Aalayam, Himachal Pradesh. I\'m Namita, a healer and facilitator with decades of experience guiding people through life\'s physical, emotional, and energetic challenges.',
    image: '/images/about.jpg',
  },
];

