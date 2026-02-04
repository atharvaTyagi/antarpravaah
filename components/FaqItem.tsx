'use client';

interface FaqItemProps {
  question: string;
  answer: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function FaqItem({ question, answer, isExpanded, onToggle }: FaqItemProps) {
  return (
    <div className="w-full border-b border-[#93a378]/20">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 p-5 text-left hover:bg-[#93a378]/5 transition-colors"
        aria-expanded={isExpanded}
      >
        <h3
          className="flex-1 text-[24px] leading-normal text-[#93a378]"
          style={{ fontFamily: 'var(--font-saphira), serif' }}
        >
          {question}
        </h3>
        <div
          className="flex-shrink-0 w-8 h-[22px] flex items-center justify-center transition-transform duration-300"
          style={{
            transform: isExpanded ? 'rotate(270deg)' : 'rotate(90deg) scaleY(-1)',
          }}
        >
          {/* Arrow icon */}
          <img
            src="/button_arrow_left.svg"
            alt=""
            className="w-[26px] h-[20px]"
            style={{
              filter:
                'brightness(0) saturate(100%) invert(64%) sepia(18%) saturate(548%) hue-rotate(46deg) brightness(91%) contrast(86%)',
            }}
          />
        </div>
      </button>
      
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isExpanded ? '1000px' : '0',
          opacity: isExpanded ? 1 : 0,
        }}
      >
        <div className="px-5 pb-5">
          <div
            className="text-[16px] leading-[24px] text-[#474e3a]"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        </div>
      </div>
    </div>
  );
}

