'use client';
import Button from './Button';
import PageEndBlob from './PageEndBlob';
interface ReadyToBeginProps {
  onBeginJourney?: () => void;
}

export default function ReadyToBegin({ onBeginJourney }: ReadyToBeginProps) {
  return (
    <div
      id="ready-to-begin"
      className="relative w-full h-full bg-[#f6edd0] flex flex-col items-center justify-center"
    >
      <div className="mx-auto w-full max-w-full sm:max-w-[calc(100vw-64px)] lg:max-w-[1177px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col items-center gap-5 sm:gap-6 lg:gap-8 py-10 sm:py-14 lg:py-20">
          <div className="flex items-center justify-center py-2 sm:py-3 lg:py-4">
            <PageEndBlob color="#474e3a" className="h-8 sm:h-9 lg:h-10 w-auto" />
          </div>
          <p
            className="text-center text-[26px] sm:text-[36px] lg:text-[48px] leading-[1.2] text-[#93a378] px-4 max-w-[90%] sm:max-w-[80%]"
            style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
          >
            Ready to begin your own transformation?
          </p>
          <div className="pt-2 sm:pt-4">
            <Button
              text="Begin Your Journey"
              size="large"
              mode="light"
              colors={{
                fg: '#474e3a',
                fgHover: '#f6edd0',
                bgHover: '#474e3a',
              }}
              onClick={onBeginJourney}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
