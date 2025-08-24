import IntegrationsCol from "../_components/IntegrationCol";
import ariesIcon from "../_images/aries.jpg";
import taurusIcon from "../_images/taurus.jpg";
import geminiIcon from "../_images/gemini.jpg";
import cancerIcon from "../_images/cancer.jpg";
import leoIcon from "../_images/leo.jpg";
import virgoIcon from "../_images/virgo.jpg";
import libraIcon from "../_images/libra.jpg";
import scorpioIcon from "../_images/scorpio.jpg";
import sagittariusIcon from "../_images/sagittarius.jpg";
import capricornIcon from "../_images/capricorn.jpg";
import aquariusIcon from "../_images/aquarius.jpg";
import piscesIcon from "../_images/pisces.jpg";

const integrations = [
  {
    name: "Aries",
    icon: ariesIcon,
    description:
      "Bold, ambitious, and energetic — Aries thrives on challenges and new beginnings.",
  },
  {
    name: "Taurus",
    icon: taurusIcon,
    description:
      "Grounded, reliable, and loyal — Taurus values stability, comfort, and beauty.",
  },
  {
    name: "Gemini",
    icon: geminiIcon,
    description:
      "Curious, witty, and adaptable — Gemini loves learning, communication, and variety.",
  },
  {
    name: "Cancer",
    icon: cancerIcon,
    description:
      "Nurturing, empathetic, and intuitive — Cancer values home, family, and deep bonds.",
  },
  {
    name: "Leo",
    icon: leoIcon,
    description:
      "Confident, charismatic, and creative — Leo shines in leadership and self-expression.",
  },
  {
    name: "Virgo",
    icon: virgoIcon,
    description:
      "Practical, analytical, and detail-oriented — Virgo excels in problem-solving and care.",
  },
  {
    name: "Libra",
    icon: libraIcon,
    description:
      "Charming, fair-minded, and diplomatic — Libra seeks harmony, balance, and beauty.",
  },
  {
    name: "Scorpio",
    icon: scorpioIcon,
    description:
      "Passionate, determined, and mysterious — Scorpio values depth, power, and loyalty.",
  },
  {
    name: "Sagittarius",
    icon: sagittariusIcon,
    description:
      "Adventurous, optimistic, and philosophical — Sagittarius craves freedom and exploration.",
  },
  {
    name: "Capricorn",
    icon: capricornIcon,
    description:
      "Disciplined, ambitious, and responsible — Capricorn is driven to achieve long-term success.",
  },
  {
    name: "Aquarius",
    icon: aquariusIcon,
    description:
      "Innovative, independent, and humanitarian — Aquarius values progress and originality.",
  },
  {
    name: "Pisces",
    icon: piscesIcon,
    description:
      "Compassionate, imaginative, and intuitive — Pisces is deeply connected to emotions and creativity.",
  },
];

export type IntegrationsType = typeof integrations;

export default function Integrations() {
  return (
    <section className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
      <div className="container px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
          {/* Left Content */}
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 font-sans font-bold">
              Discover the Wisdom of the Stars
            </h1>
            <p className="text-white/60 mt-4 text-base sm:text-lg">
              Explore all 12 zodiac signs and uncover their unique traits,
              strengths, and energies. Whether you&apos;re seeking guidance,
              self-discovery, or cosmic inspiration, the stars illuminate your
              path.
            </p>
          </div>

          {/* Right */}
          <div>
            <div className="h-[450px] sm:h-[600px] mt-8 lg:mt-0 overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-4 [mask-image:linear-gradient(to_bottom,transparent,black_10%,_black_90%,transparent)]">
              <IntegrationsCol integrations={integrations} />
              <IntegrationsCol
                integrations={integrations.slice().reverse()}
                reverse
                className="hidden md:flex"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
