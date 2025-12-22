import logoFull from '@/app/assets/logo_full.svg';
import Button from './Button';

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Button
      href={href}
      text={label}
      size="small"
      // Footer-specific palette
      colors={{
        fg: '#93a378',
        fgHover: '#474e3a',
        bgHover: '#93a378',
      }}
      className="justify-self-center"
    />
  );
}

export default function Footer() {
  const logoFullSrc =
    (logoFull as unknown as { src?: string }).src ?? (logoFull as unknown as string);

  return (
    <footer className="w-full bg-[#474e3a] px-6 py-14 md:p-20">
      <div className="mx-auto flex max-w-[1282px] flex-col items-center gap-10">
        {/* Top row */}
        <div className="flex w-full flex-col items-center justify-center gap-10 md:flex-row md:items-start md:gap-10 md:px-5">
          {/* Quick Links */}
          <div className="flex flex-col items-center gap-4">
            <p
              className="text-center text-[24px] leading-[normal] text-[#93a378]"
              style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
            >
              Quick Links
            </p>
            <div className="grid w-full max-w-[439px] grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-3">
              <QuickLink href="/about" label="About Namita" />
              <QuickLink href="/approach" label="Approach" />
              <QuickLink href="/therapies" label="Therapies" />
              <QuickLink href="/immersions" label="Immersions" />
              <QuickLink href="/trainings" label="Trainings" />
              <QuickLink href="/faq" label="FAQ" />
            </div>
          </div>

          {/* Divider */}
          <div className="hidden h-[163px] w-px bg-[#93a378]/60 md:block" />

          {/* Contact */}
          <div className="flex flex-col items-center justify-center gap-4 text-center text-[#93a378]">
            <p
              className="text-[24px] leading-[normal]"
              style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
            >
              Get In Touch
            </p>
            <div
              className="flex flex-col gap-2 text-[12px] leading-[normal]"
              style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
            >
              <p className="w-[209px]">Email: [email address]</p>
              <p className="w-[209px]">Phone: [phone number]</p>
              <p className="w-[209px]">Location &amp; Timings: [location details]</p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden h-[163px] w-px bg-[#93a378]/60 md:block" />

          {/* Socials */}
          <div className="flex flex-col items-center justify-center gap-4 text-center text-[#93a378]">
            <p
              className="text-[24px] leading-[normal]"
              style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
            >
              Socials
            </p>
            <div
              className="flex flex-col gap-2 text-[12px] leading-[normal]"
              style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
            >
              <a
                className="hover:opacity-80"
                href="https://instagram.com/antarpravaah"
                target="_blank"
                rel="noreferrer"
              >
                IG : @antarpravaah
              </a>
              <a
                className="hover:opacity-80"
                href="https://x.com/antarpravaah"
                target="_blank"
                rel="noreferrer"
              >
                X : @antarpravaah
              </a>
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="w-full overflow-hidden">
          <img
            src={logoFullSrc}
            alt="Antar Pravaah"
            className="mx-auto block h-auto w-full max-w-[1282px]"
          />
        </div>
      </div>
    </footer>
  );
}


