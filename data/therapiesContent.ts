export interface DescriptionItem {
  heading: string;
  text: string;
}

export interface Therapy {
  id: string;
  title: string;
  subtitle: string;
  description: string | (string | DescriptionItem)[];
  bestFor: string[];
  duration: string;
  ctaText: string;
  icon: string;
  iconPosition: 'left' | 'right' | 'center';
}

export const therapies: Therapy[] = [
  {
    id: 'systemic-family-constellations',
    title: 'Systemic & Family Constellations',
    subtitle: 'Restoring Self through systemic awareness',
    description: [
      'Family Constellations is a powerful therapeutic approach that reveals how unresolved dynamics within our family systems—both past and present—can shape our current reality. Whether the issue is personal, emotional, financial, or physical, the root often lies in inherited patterns, loyalties, or unacknowledged trauma.',
      'By gently uncovering these entanglements, Constellations allow healing to unfold—offering freedom from burdens that aren\'t truly yours and creating space to live with greater clarity, choice, and peace. This work also integrates the possibility of past-life influences that may be silently shaping today\'s struggles.'
    ],
    bestFor: [
      'Unexplained fears and phobias',
      'Recurring relationship patterns',
      'Releasing blocks to growth in chosen professions',
      'Unexplained physiological conditions',
      'Persistent emotional blocks',
      'Compulsive behaviours',
      'Familial inherited diseases',
      'Ancestral healing'
    ],
    duration: '90 - 120 minutes',
    ctaText: 'Book a Systemic/ Family Constellations Session',
    icon: '/Icon - Systemic & Family Constellations.svg',
    iconPosition: 'right'
  },
  {
    id: 'transpersonal-regression',
    title: 'Transpersonal Regression Therapy',
    subtitle: 'Releasing the past to reclaim the present',
    description: [
      'Our responses today are often shaped by unprocessed experiences from the past. In Transpersonal Regression Therapy, clients are guided to explore the realm of their own subconscious and unconscious mind, to determine the origins of current emotional or behavioral patterns—whether from childhood, earlier life events, or even past lives.',
      'Without losing awareness of the present moment, this process allows subconscious memories to surface with clarity and insight. It\'s particularly effective for uncovering the root cause of persistent challenges, offering the possibility to understand, resolve, and finally let go—so you can respond to life as it is, rather than through the lens of what was.'
    ],
    bestFor: [
      'Unexplained fears and phobias',
      'Unexplained physiological conditions',
      'Childhood trauma healing',
      'Compulsive behaviours',
      'Decoding destructive cycles',
      'Patterns of financial loss or stagnant career paths',
      'Releasing emotional struggles',
      'Overcoming abuse',
      'Restoring self confidence and clarity'
    ],
    duration: '120 minutes',
    ctaText: 'Book a Regression Therapy Session',
    icon: '/Icon - Transpersonal Regression.svg',
    iconPosition: 'right'
  },
  {
    id: 'shamanism',
    title: 'Shamanism',
    subtitle: 'Ancient healing for modern times',
    description: [
      'Shamanism seeks to discover the energetic or spiritual cause of a dis-ease. It is less a modality, and more a living philosophy which has since time immemorial guided individuals to recognise the interconnection of all life- people, animals, nature, and spirit. When that connection is disrupted, imbalance and illness can occur.',
      'Shamans have existed in almost all indigenous tribes and act as a bridge, by virtue of their expanded consciousness, between the seen and unseen forces to restore balance, wholeness and harmony to individuals in times of distress.',
      'Through practices like drumming, chanting, or working with natural medicines, shamans enter expanded states of consciousness to seek insight, healing, or guidance.'
    ],
    bestFor: [
      'Soul retrieval and spiritual disconnection',
      'Clearing energetic attachments',
      'Life transitions and initiation',
      'Releasing excessive attachments',
      'Pain and illness healing'
    ],
    duration: '~60 minutes',
    ctaText: 'Book a Shamanic Journey',
    icon: '/Icon - Shamanism.svg',
    iconPosition: 'right'
  },
  {
    id: 'foot-reflexology',
    title: 'Foot Reflexology',
    subtitle: 'Restoring balance through the feet',
    description: 'Foot Reflexology stimulates specific pressure points on the feet that correspond to organs and systems throughout the body. It\'s a deeply grounding, non-invasive therapy that supports both healing and prevention.',
    bestFor: [
      'Stress relief and relaxation',
      'Pain management',
      'Hormonal balance',
      'Chronic conditions (diabetes, arthritis)',
      'Neurological issues',
      'General wellness and prevention',
      'Suitable for all ages'
    ],
    duration: '45 - 60 minutes',
    ctaText: 'Book a Reflexology Session',
    icon: '/Icon - Foot Reflexology.svg',
    iconPosition: 'right'
  },
  {
    id: 'access-consciousness',
    title: 'Access Consciousness™',
    subtitle: 'Gentle tools for powerful change',
    description: [
      {
        heading: 'Access Bars®',
        text: 'Access Bars® is a gentle hands-on technique where 32 points on the head are lightly touched. These points relate to thoughts, beliefs, emotions, and areas of life like control, creativity, money, and relationships. When activated, they help release stored limitations and mental clutter—inviting deep relaxation and more space to create life from clarity, not conditioning.'
      },
      {
        heading: 'Access Body Processes',
        text: 'Access Body Processes involve hands-on healing through specific placements on the body, each designed to activate the body\'s natural ability to repair, restore, and regenerate. Where Bars clears the mind, Body Processes work directly with the body—addressing areas where you may feel stuck physically, emotionally, or energetically. Together, these practices open up new choices and help dissolve pain, trauma, and the energetic residue of past experiences.'
      },
      {
        heading: 'Access Energetic Facelift™',
        text: 'Access Energetic Facelift™ is a deeply nurturing treatment for the face and entire body. While it softens signs of aging and refreshes the skin, its effects go much deeper—shifting the energetic imprints of judgment, stress, and stored emotions that shape how we look and feel. Clients often report changes far beyond the physical, including relief from chronic conditions and a renewed sense of vitality.'
      }
    ],
    bestFor: [],
    duration: '60 - 90 minutes',
    ctaText: 'Book an Access Consciousness Session',
    icon: '/Icon - Access Consciousness.svg',
    iconPosition: 'right'
  },
  {
    id: 'antar-smaran-process',
    title: 'Antar Smaran Process',
    subtitle: 'Our Hallmark offering just for you',
    description: [
      'The Antar Smaran Process (ASP) is the hallmark offering at AP. Combining energy and bodywork, it brings to the surface deep, unconscious, subconscious vibrational disruptions that have been creating an imbalanced life, marked by physiological, psychological or spiritual distress and starts to dissolve it. Pains long held in the body, patterns of loss, deep emotional crises, and blocks to various areas of one\'s life begin to resolve, creating space for newer possibilities.',
      'This practice is best received when you are ready—or seeking—profound change. It is, in the truest sense, an awakening. For those on the path of deep inner transformation, ASP serves as a catalyst for alignment, clarity, and conscious evolution.'
    ],
    bestFor: [],
    duration: 'Variable',
    ctaText: 'Experience the Antar Smaran Process',
    icon: '/asp_logo.svg',
    iconPosition: 'center'
  }
];

