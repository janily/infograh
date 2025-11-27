import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Pricing } from '@/components/landing/Pricing';
import { FEATURE_FLAGS } from '@/config/feature-flags';

export default function Home() {
  return (
    <main>
      <Hero />
      {FEATURE_FLAGS.SHOW_HOW_IT_WORKS && <HowItWorks />}
      {FEATURE_FLAGS.SHOW_PRICING && <Pricing />}
    </main>
  );
}
