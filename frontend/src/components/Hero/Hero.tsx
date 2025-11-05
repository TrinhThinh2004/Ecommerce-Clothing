// src/components/hero/HeroNew.tsx
type HeroNewProps = {
  src?: string;
  alt?: string;
};

export default function HeroNew({
  src = "/hero.png",
  alt = "HÀNG MỚI",
}: HeroNewProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-1 sm:px-0">
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        {/* Banner của bạn ~1220/280/360 => hero ~110/140/180 */}
        <div className="h-[110px] sm:h-[140px] lg:h-[250px] w-full">
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
