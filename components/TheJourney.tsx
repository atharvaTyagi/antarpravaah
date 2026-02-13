'use client';

import { useRef, useLayoutEffect, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { Observer } from 'gsap/dist/Observer';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(Observer);
}

interface TheJourneyProps {
  isActive?: boolean;
  onEdgeReached?: (edge: 'start' | 'end') => void;
  resetToStart?: boolean;
  resetToEnd?: boolean;
}

const journeySteps = [
  {
    title: 'Human life is a gift.',
    body: 'It is said, it takes 84 lac lives to get to a human birth. And each life is a play between light and shadow; love and loss; joy and pain. Each life, a discovery and an exploration of our self-realised selves lost under layers of complex experiences. This is the point of life.',
    alignment: 'left' as const,
  },
  {
    title: 'Easier said than done? I get it.',
    body: 'I have been there. It can be overwhelming, the hard moments - as if they\'ll never end or that you\'re walking through them alone. Or you are the only one they are happening too. An endless list of \'Why\' with no answers. But those moments aren\'t the end; they\'re a beginning. They\'re the soul\'s call for renewal, an invitation to remember your strength, your truth, and the support that surrounds you.',
    alignment: 'right' as const,
  },
  {
    title: 'And it is here that avenues for healing fit in.',
    body: 'Healing is a remembrance. It\'s not about living happily ever after — it\'s about living happily regardless. Authentic healing helps you meet life as it is, with compassion, courage, and presence.',
    alignment: 'left' as const,
  },
  {
    title: 'The journey I offer is not a quick fix. It is soul work.',
    body: 'It\'s deep, honest, sometimes uncomfortable — and profoundly transformative. In this space, we explore what it means to come home to yourself — to embrace every part of who you are, even the ones you\'ve hidden or judged. Because peace isn\'t found in perfection. It\'s found in wholeness.',
    alignment: 'right' as const,
  },
];

// Original path data from journey_step.svg
const JOURNEY_PATH = "M173.635 95.4484C151.494 97.7835 129.473 100.841 107.173 100.459C77.6762 99.9523 40.6473 66.8241 36.7986 37.2857C35.4874 27.1965 37.8259 17.0147 40.4721 7.18942C40.9709 5.31318 41.444 3.15384 40.3419 1.55936C38.5631 -1.01032 34.5789 0.0549134 31.8074 1.48525C22.2351 6.43608 13.1436 12.8906 7.10457 21.8138C-5.8487 40.9813 0.599598 69.3141 12.9403 87.0322C37.5729 122.404 77.3362 135.688 118.583 137.219C153.362 138.511 187.968 132.745 222.297 126.997C246.109 123.009 269.921 119.021 293.733 115.033C311.723 112.022 329.827 108.998 348.062 109.179C365.074 109.34 388.961 112.382 403.261 121.831C421.096 133.598 433.749 154.162 443.296 172.744C445.809 177.633 454.082 204.484 458.46 205.862C464.749 207.846 460.782 183.242 460.344 179.497C455.324 135.543 435.864 94.6478 389.272 84.1137C347.273 74.6203 306.669 80.6407 264.808 86.3663C238.426 89.9763 211.861 91.9723 185.342 94.3152C181.436 94.6599 177.543 95.0472 173.649 95.4627L173.635 95.4484Z";

// SVG connector using the original path shape with clip-path reveal animation
const ConnectorPath = ({ flip, clipId }: { flip: boolean; clipId: string }) => (
  <svg
    className="journey-connector-svg w-full h-auto"
    viewBox="0 0 462 206"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: flip ? 'scaleX(-1)' : 'none' }}
  >
    <defs>
      {/* Clip rect for reveal animation - width animated via GSAP */}
      <clipPath id={clipId}>
        <rect className="clip-rect" x="0" y="0" width="0" height="206" />
      </clipPath>
    </defs>
    {/* Animated foreground path - revealed via clip-path */}
    <path
      d={JOURNEY_PATH}
      fill="#9AC1BF"
      clipPath={`url(#${clipId})`}
    />
  </svg>
);

// Total steps: 4 journey steps = 4 positions (0-3)
// CTA is now a separate section
const TOTAL_STEPS = journeySteps.length; // 4 total

export default function TheJourney({
  isActive = false,
  onEdgeReached,
  resetToStart,
  resetToEnd,
}: TheJourneyProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);
  const connectorRefs = useRef<Array<HTMLDivElement | null>>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentStep, setCurrentStep] = useState(0);
  const currentStepRef = useRef(0);
  const prevStepRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const observerRef = useRef<Observer | null>(null);
  const lastScrollTimeRef = useRef(0);
  const [isClient, setIsClient] = useState(false);

  // Cooldown between step changes
  const scrollCooldown = 500;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  // Get the scroll target position for a given step
  const getScrollPositionForStep = useCallback((stepIndex: number): number => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return 0;

    if (stepIndex === 0) {
      return 0; // First step - scroll to top
    }

    if (stepIndex < journeySteps.length) {
      // For journey steps, scroll to bring the step into view
      // We want to scroll to the connector before the step (or the step itself for step 1)
      const connector = connectorRefs.current[stepIndex - 1];
      if (connector) {
        const containerRect = scrollContainer.getBoundingClientRect();
        const connectorRect = connector.getBoundingClientRect();
        const currentScroll = scrollContainer.scrollTop;
        // Scroll so connector is at the top with some padding
        return currentScroll + connectorRect.top - containerRect.top - 20;
      }
    }

    // For the last step, scroll to the bottom
    if (stepIndex === journeySteps.length - 1) {
      return scrollContainer.scrollHeight - scrollContainer.clientHeight;
    }

    return 0;
  }, []);

  // Handle reset to start (when entering from above)
  useEffect(() => {
    if (!resetToStart || !isClient) return;
    
    // Reset to first step and set all content to initial state
    currentStepRef.current = 0;
    prevStepRef.current = 0;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentStep(0);
    lastScrollTimeRef.current = Date.now();
    
    // Reset scroll position
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    
    // Reset all visual states
    const steps = stepRefs.current.filter(Boolean) as HTMLDivElement[];
    const connectors = connectorRefs.current.filter(Boolean) as HTMLDivElement[];
    
    // Show first step, hide others
    steps.forEach((step, index) => {
      gsap.set(step, { opacity: index === 0 ? 1 : 0, y: index === 0 ? 0 : 50 });
    });
    
    // Hide all connectors
    connectors.forEach((connector) => {
      const clipRect = connector.querySelector('.clip-rect');
      if (clipRect) {
        gsap.set(clipRect, { attr: { width: 0 } });
      }
    });
  }, [resetToStart, isClient]);

  // Handle reset to end (when entering from below)
  useEffect(() => {
    if (!resetToEnd || !isClient) return;
    
    // Reset to last step (last journey step visible)
    const lastStep = TOTAL_STEPS - 1;
    currentStepRef.current = lastStep;
    prevStepRef.current = lastStep;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentStep(lastStep);
    lastScrollTimeRef.current = Date.now();
    
    // Show all content
    const steps = stepRefs.current.filter(Boolean) as HTMLDivElement[];
    const connectors = connectorRefs.current.filter(Boolean) as HTMLDivElement[];
    
    // Show all steps
    steps.forEach((step) => {
      gsap.set(step, { opacity: 1, y: 0 });
    });
    
    // Show all connectors
    connectors.forEach((connector) => {
      const clipRect = connector.querySelector('.clip-rect');
      if (clipRect) {
        gsap.set(clipRect, { attr: { width: 462 } });
      }
    });
    
    // Scroll to bottom
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [resetToEnd, isClient]);

  // Enable/disable observer based on isActive prop
  useEffect(() => {
    if (!observerRef.current) return;
    
    if (isActive) {
      // Add delay before enabling to prevent residual scroll from triggering
      const timeout = setTimeout(() => {
        observerRef.current?.enable();
        lastScrollTimeRef.current = Date.now();
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      observerRef.current.disable();
    }
  }, [isActive]);

  // Animate step transition with scroll
  const animateToStep = useCallback((newStep: number, direction: 'up' | 'down') => {
    if (isAnimatingRef.current) return;
    if (newStep < 0 || newStep >= TOTAL_STEPS) return;
    if (newStep === currentStepRef.current) return;

    isAnimatingRef.current = true;
    prevStepRef.current = currentStepRef.current;
    currentStepRef.current = newStep;
    setCurrentStep(newStep);

    const scrollContainer = scrollContainerRef.current;
    const steps = stepRefs.current.filter(Boolean) as HTMLDivElement[];
    const connectors = connectorRefs.current.filter(Boolean) as HTMLDivElement[];

    const yStart = direction === 'down' ? 50 : -50;

    // Calculate target scroll position
    const targetScroll = getScrollPositionForStep(newStep);

    // Animate scroll
    if (scrollContainer) {
      gsap.to(scrollContainer, {
        scrollTop: targetScroll,
        duration: 0.6,
        ease: 'power2.inOut',
      });
    }

    // Steps 0-3 correspond to journey steps
    if (direction === 'down') {
      // Scrolling down - reveal the next element
      // Reveal step and its preceding connector
      const step = steps[newStep];
      const connector = connectors[newStep - 1]; // Connector before this step
      
      // Animate connector first (if exists)
      if (connector && newStep > 0) {
        const clipRect = connector.querySelector('.clip-rect');
        if (clipRect) {
          gsap.to(clipRect, {
            attr: { width: 462 },
            duration: 0.5,
            ease: 'power2.out',
          });
        }
      }
      
      // Then animate step
      if (step) {
        gsap.fromTo(
          step,
          { opacity: 0, y: yStart },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            delay: connector ? 0.2 : 0,
            onComplete: () => {
              isAnimatingRef.current = false;
              lastScrollTimeRef.current = Date.now();
            },
          }
        );
      } else {
        isAnimatingRef.current = false;
        lastScrollTimeRef.current = Date.now();
      }
    } else {
      // Scrolling up - hide the current element
      const oldStep = prevStepRef.current;
      
      // Hide step and its preceding connector
      const step = steps[oldStep];
      const connector = connectors[oldStep - 1];
      
      // Animate step out
      if (step) {
        gsap.to(step, {
          opacity: 0,
          y: yStart,
          duration: 0.4,
          ease: 'power2.in',
        });
      }
      
      // Animate connector out
      if (connector && oldStep > 0) {
        const clipRect = connector.querySelector('.clip-rect');
        if (clipRect) {
          gsap.to(clipRect, {
            attr: { width: 0 },
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => {
              isAnimatingRef.current = false;
              lastScrollTimeRef.current = Date.now();
            },
          });
        }
      } else {
        setTimeout(() => {
          isAnimatingRef.current = false;
          lastScrollTimeRef.current = Date.now();
        }, 400);
      }
    }
  }, [getScrollPositionForStep]);

  // Handle scroll input
  const handleScroll = useCallback((direction: 'up' | 'down') => {
    const now = Date.now();
    if (now - lastScrollTimeRef.current < scrollCooldown) return;
    if (isAnimatingRef.current) return;

    const step = currentStepRef.current;

    if (direction === 'down') {
      if (step < TOTAL_STEPS - 1) {
        animateToStep(step + 1, 'down');
      } else {
        // At the end - notify parent
        lastScrollTimeRef.current = now;
        onEdgeReached?.('end');
      }
    } else {
      if (step > 0) {
        animateToStep(step - 1, 'up');
      } else {
        // At the start - notify parent
        lastScrollTimeRef.current = now;
        onEdgeReached?.('start');
      }
    }
  }, [animateToStep, onEdgeReached]);

  // Setup Observer-based scroll handling
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !isClient) return;

    // Create Observer for scroll handling - starts disabled
    const journeyObserver = Observer.create({
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      tolerance: 50,
      preventDefault: true,
      onDown: () => handleScroll('up'),
      onUp: () => handleScroll('down'),
    });

    // Start disabled
    journeyObserver.disable();
    observerRef.current = journeyObserver;

    // Initialize visual state
    const steps = stepRefs.current.filter(Boolean) as HTMLDivElement[];
    const connectors = connectorRefs.current.filter(Boolean) as HTMLDivElement[];

    // Set initial states - first step visible, rest hidden
    steps.forEach((step, index) => {
      gsap.set(step, { opacity: index === 0 ? 1 : 0, y: index === 0 ? 0 : 50 });
    });

    // Hide all connectors
    connectors.forEach((connector) => {
      const clipRect = connector.querySelector('.clip-rect');
      if (clipRect) {
        gsap.set(clipRect, { attr: { width: 0 } });
      }
    });

    return () => {
      journeyObserver.kill();
      observerRef.current = null;
    };
  }, [isClient, handleScroll]);

  return (
    <div
      id="journey"
      ref={sectionRef}
      className="relative w-full h-full bg-[#f6edd0] overflow-hidden"
    >
      {/* Fixed height container that fills the section */}
      <div className="h-full flex flex-col">
        {/* Section Title - Fixed at top */}
        <div className="flex-shrink-0 w-full text-center py-4 lg:py-6 px-4 bg-[#f6edd0] z-20">
          <h2
            className="text-[36px] sm:text-[42px] lg:text-[48px] leading-[1.1] text-[#354443]"
            style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
          >
            The Journey
          </h2>
        </div>

        {/* Scrollable content area - hidden scrollbar, programmatic scroll */}
        <div 
          ref={scrollContainerRef} 
          className="flex-1 overflow-y-scroll overflow-x-hidden px-4 sm:px-6 lg:px-8 pb-8 no-scrollbar"
          style={{
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none', /* IE/Edge */
          }}
        >
          <div className="mx-auto max-w-full sm:max-w-[calc(100vw-64px)] lg:max-w-[1177px]">
            {/* Journey steps with animated connectors */}
            <div className="mx-auto w-full max-w-full sm:max-w-[calc(100vw-80px)] lg:max-w-[1097px] py-4 sm:py-6 lg:py-8 flex flex-col items-center justify-center">
              {journeySteps.map((step, index) => {
                const isRight = step.alignment === 'right';
                const hasConnector = index < journeySteps.length - 1;

                return (
                  <div key={index} className="w-full">
                    {/* Text content */}
                    <div className={`flex w-full justify-center ${isRight ? 'lg:justify-end' : 'lg:justify-start'}`}>
                      <div
                        ref={(el) => {
                          stepRefs.current[index] = el;
                        }}
                        className="w-full sm:w-[340px] lg:w-[400px] text-justify journey-step px-2 sm:px-0"
                      >
                        <p
                          className="text-[24px] sm:text-[30px] lg:text-[36px] leading-[1.0] text-[#9ac1bf]"
                          style={{ fontFamily: 'var(--font-saphira), serif' }}
                        >
                          {step.title}
                        </p>
                        <p
                          className="mt-2 sm:mt-3 text-[14px] sm:text-[15px] lg:text-[16px] leading-[24px] text-[#354443]"
                          style={{ fontFamily: 'var(--font-graphik), sans-serif' }}
                        >
                          {step.body}
                        </p>
                      </div>
                    </div>

                    {/* Animated connector SVG */}
                    {hasConnector && (
                      <div
                        ref={(el) => {
                          connectorRefs.current[index] = el;
                        }}
                        className="mx-auto my-6 sm:my-8 lg:my-10 w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[462px] journey-connector"
                      >
                        <ConnectorPath flip={index % 2 !== 0} clipId={`connector-clip-${index}`} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
