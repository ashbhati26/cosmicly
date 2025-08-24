import { TextScroll } from "./_components/TextScroll";
import Faqs from "./_sections/FAQs";
import { HeroSection } from "./_sections/HeroSection";
import Integrations from "./_sections/Integrations";
import PricingPlan from "./_sections/PricingPlan";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TextScroll
        className="font-display text-center text-3xl font-semibold tracking-tighter md:text-6xl md:leading-[4rem] bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-400"
        text="Guided by the Stars ● "
        default_velocity={5}
      />
      <Integrations />
      <PricingPlan />
      <Faqs />
    </>
  );
}
