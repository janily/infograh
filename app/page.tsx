import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Pricing } from '@/components/landing/Pricing';

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Pricing />
    </main>
  );
}
