import bgImage from "../assets/beach.jpg";
import Footer from "../common/Footer";
import Header from "../common/Header";
import Features from "../components/Features";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header (sticky/nav if your Header does that) */}
      {/* <Header /> */}

      {/* Hero with full background image, no overlays or background on text */}
      <section
        style={{ backgroundImage: `url(${bgImage})` }}
        className="relative w-full min-h-[80vh] bg-cover bg-center bg-no-repeat"
      >
        <div className="flex min-h-[80vh] items-center justify-center px-6">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] sm:text-5xl md:text-6xl">
              Plan Your Perfect Adventure
            </h1>

            <p className="mx-auto mt-4 max-w-3xl text-pretty text-base leading-7 text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] sm:text-lg md:text-xl">
              Transform your travel dreams into reality with intelligent trip
              planning, real-time suggestions, and seamless journey tracking.
              Every adventure begins with a single step.
            </p>

            {/* accent underline */}
            <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-sky-400 via-fuchsia-400 to-emerald-400/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]" />
          </div>
        </div>
      </section>

      {/* Features section below the hero */}
      <section className="py-14">
        <Features />
      </section>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
}
