"use client";
import React, { useState, useEffect } from 'react';
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import Dolphin from '@/components/system/dolphin';
import HorizontalScrollCarousel from '@/components/system/horizontal-scroll-carousel';
import TestimonialSection from '@/components/system/testimonial';
import FAQ from '@/components/system/faq';
import { TextAnimate } from '@/components/system/text-animate';

export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isModelLoading, setIsModelLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setScrollProgress(Math.max(0, Math.min(1, p)));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Easing for smoothness
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const lerp = (a, b, t) => a + (b - a) * t;

  // ⬇️ Keyframes: edit these to place the whale for each phase/section
  // x: left(-) / right(+), y: up(+)/down(-), z: depth (smaller negative = closer to camera behind? depends on your scene)
const KF = [
  { pos: [0.0, -0.6, 1.0], rot: [0, 0 * Math.PI, 0] },  // start (slightly turned)
  { pos: [2.0, 1.0, -1.0], rot: [0, -0.15 * Math.PI, 0] },  // move right, maintain forward
  { pos: [0.0, 0.6, -1.0], rot: [0, 0.00 * Math.PI, 0] },   // center, facing camera
  { pos: [-2.0, 1.0, -1.0], rot: [0, 0.15 * Math.PI, 0] },  // move left, maintain forward
  { pos: [0.0, 0.2, 0.5], rot: [0, 0.25 * Math.PI, 0] },    // center, slightly turned
];

  // Compute piecewise position/rotation along keyframes
  const segs = KF.length - 1;
  const scaled = scrollProgress * segs;
  const i = Math.max(0, Math.min(segs - 1, Math.floor(scaled)));
  const tLocal = easeInOut(scaled - i);
  const from = KF[i];
  const to = KF[i + 1];

  const positionOverride = [
    lerp(from.pos[0], to.pos[0], tLocal),
    lerp(from.pos[1], to.pos[1], tLocal),
    lerp(from.pos[2], to.pos[2], tLocal),
  ];
  const rotationOverride = [
    lerp(from.rot[0], to.rot[0], tLocal),
    lerp(from.rot[1], to.rot[1], tLocal),
    lerp(from.rot[2], to.rot[2], tLocal),
  ];

  return (
    <main className='relative'>
      {isModelLoading && (
        <div className="fixed inset-0 z-[999999] bg-[var(--color-warm-gray)] flex flex-col items-center justify-center">
          <div className="relative z-10 text-center">
            <h1 className="md:text-7xl text-2xl text-black font-mono">
              {Math.round(loadProgress)}% Loaded
            </h1>
          </div>
        </div>
      )}
      <div className='fixed w-full h-full pointer-events-none z-10'>
        <Canvas camera={{ position: [0, 0, 5], fov: 40 }} shadows>
          <Environment preset="city" />
          <Dolphin
            scrollProgress={scrollProgress}
            startPosition={[0, -0.6, 1]}
            endPosition={[2, 1, -1]}
            startRotation={[0, 0, 0]}
            endRotation={[0, Math.PI, 0]}
            tiltAmount={1.15}
            scale={4.5}
            positionOverride={positionOverride}
            rotationOverride={rotationOverride}
            onLoadProgress={(progress) => setLoadProgress(progress)}
            onLoadStatus={(loaded) => setIsModelLoading(!loaded)}
          />
        </Canvas>
      </div>

      {/* First Section */}
      <div className="w-full p-5 transition-all duration-500 ease-in-out"
        style={{
          padding: `${20 - scrollProgress * 20}px`,
        }}
      >
        <section className="relative h-[95vh] rounded-4xl bg-[var(--color-muted-green)] overflow-hidden">
          <img src="/bg.png" alt="Background" className="absolute w-full h-full object-cover rounded-4xl blur-md z-0 border-0" />
          <div className="container mx-auto px-4 md:py-32 py-28 relative z-50">
            <h1 className="text-3xl md:text-[9rem] font-bold text-center mb-6 text-[var(--color-warm-gray)] uppercase">
              <TextAnimate by="word" animation="slideUp" startOnView={true}  delay={0.6} duration={0.9}>
                Learn Languages the Human Way.
              </TextAnimate>
            </h1>
            <p className="text-lg md:text-[2rem] text-center text-[var(--color-warm-gray)]">
            <TextAnimate animation="blurIn" by="line" startOnView={true}  delay={0.8} duration={0.9}>Join our community and start your language learning journey today!</TextAnimate>
            </p>
          </div>
          <div className="w-[300px] h-12 px-6 bg-[var(--color-warm-gray)] rounded-t-full font-bold text-center text-[var(--color-muted-green)] flex items-end justify-center bottom-0 mx-auto absolute left-0 right-0">
            Connect via love of language
          </div>
        </section>
      </div>

      {/* Second Section */}
      <section className="py-20 overflow-hidden" id="second-section">
        <div className="container mx-auto px-5 sm:px-10 md:px-12 lg:px-5 relative z-50">
          {/* Decorative elements */}
          <div className="absolute left-0 w-1/3 h-[600px] bg-[var(--color-soft-blue)] opacity-5 -z-10 rounded-full blur-3xl" />
          <div className="absolute right-0 top-1/4 w-1/4 h-[400px] bg-[var(--color-muted-green)] opacity-5 -z-10 rounded-full blur-3xl" />

          <div className="flex flex-col lg:flex-row gap-12 xl:gap-20 items-center">
            {/* Text content with creative layout */}
            <div className="flex-1 space-y-8 relative">
              <div className="relative">
                <h2 className="text-4xl md:text-7xl lg:text-[5.5rem] font-bold text-[var(--color-muted-green)] leading-tight">
                  <span className="block mb-2">About Us</span>
                  <span className="block pl-8">A story untold.</span>
                </h2>
                <div className="absolute left-0 top-1/2 w-16 h-1 bg-[var(--color-dusty-rose)] transform -translate-y-1/2" />
              </div>

              <div className="space-y-8 max-w-2xl">
                <div className="relative pl-8 border-l-4 border-[var(--color-soft-blue)]">
                  <p className="text-xl md:text-2xl italic text-zinc-700 mb-6 leading-relaxed">
                    At Tunalismus, language learning is about more than memorizing grammar, it's about building <span className="font-semibold text-[var(--color-muted-green)]">real human connections</span>.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-zinc-100">
                    <h3 className="text-xl font-bold text-[var(--color-muted-green)] mb-3">Our Story</h3>
                    <p className="text-zinc-700">
                      Founded by Sema in Hyderabad, Tunalismus began with a simple belief: languages are bridges to other cultures and to parts of yourself.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-zinc-100">
                    <h3 className="text-xl font-bold text-[var(--color-muted-green)] mb-3">Our Approach</h3>
                    <p className="text-zinc-700">
                      We create safe spaces where you can explore languages naturally, focusing on being heard rather than just speaking.
                    </p>
                  </div>
                </div>

                <div className="bg-[var(--color-warm-gray)] bg-opacity-10 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-[var(--color-muted-green)] mb-4">Our Philosophy</h3>
                  <ul className="space-y-4">
                    {[
                      {
                        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                        </svg>
                        , title: 'Listen', text: 'Every learner\'s journey is unique'
                      },
                      {
                        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                        </svg>
                        , title: 'Guide', text: 'Support with modern teaching infused with kindness'
                      },
                      {
                        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z" />
                        </svg>
                        , title: 'Adapt', text: 'Your pace and story shape every lesson'
                      }
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-4">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <span className="font-semibold text-[var(--color-muted-green)]">{item.title}.</span> {item.text}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Image with creative frame */}
            <div className="w-full lg:w-1/2 xl:w-[45%] relative">
              <div className="relative group">

                {/* Image with hover effect */}
                <img
                  src="/sama.png"
                  alt="Founder Sema teaching"
                  className="relative z-10 w-full h-auto rounded-2xl transform group-hover:-translate-y-2 transition-all duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-tr from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-700 rounded-3xl" />
                {/* Floating badge */}
                <div className="absolute -bottom-6 -right-6 bg-[var(--color-dusty-rose)] text-white px-6 py-3 rounded-full shadow-lg z-20">
                  <span className="font-bold">Sema, Founder</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Third Section */}
      <section className="min-h-screen w-full bg-[var(--color-dusty-rose)] rounded-b-full">
        <div className="container mx-auto px-4 md:pt-32 pt-28 relative">
          <h2 className="text-3xl md:mb-0 mb-4 md:text-[6rem] font-bold text-center text-[var(--color-muted-green)] invert">
            Course Offerings
          </h2>
          <p className="text-md md:text-[2rem] text-center text-[var(--color-warm-gray)] max-w-2xl mx-auto">
            Explore our range of language courses designed to connect you with cultures and people.
          </p>
          <HorizontalScrollCarousel />
        </div>
      </section>

      {/* Fourth Section */}
      <section className="py-32">
        <div className="container mx-auto px-5 sm:px-10 md:px-12 lg:px-5 relative z-50">
          <div className="flex flex-col space-y-16">
            <div className="flex flex-col justify-center text-center mx-auto md:max-w-7xl space-y-5">
              <span className="rounded-lg bg-[var(--color-soft-blue)]/10 px-2.5 py-1 text-xs w-max mx-auto font-semibold tracking-wide text-[var(--color-muted-green)]">
                Why Choose Us
              </span>
              <h1 className="text-2xl md:text-[6rem] font-bold text-center text-[var(--color-muted-green)]">
                Language Learning, Designed for Real Life
              </h1>
              <p className="text-gray-700 max-w-3xl mx-auto md:text-xl">
                At Tunalismus, learning a new language is never just about grammar, it's about connection, confidence, and being truly understood.
              </p>
            </div>
            <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-4 lg:items-center">
              {/* Feature 1 */}
              <div className="order-1 grid gap-10 sm:grid-cols-2 md:order-1 md:grid-cols-1 lg:order-1">
                <div className="flex flex-col space-y-6 justify-center md:justify-start">
                  <span className="p-2 rounded-md bg-[var(--color-soft-blue)]/10 text-[var(--color-soft-blue)] flex w-max">
                    {/* Personalized icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M10 3.5a4 4 0 014 4c0 2-1.5 3.5-4 3.5S6 9.5 6 7.5a4 4 0 014-4zm2 9.5a8 8 0 01-8 0C4 15 10 15 12 13z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <h1 className="flex text-lg font-semibold capitalize text-gray-900">
                    Personalized, Human Learning
                  </h1>
                  <p className="text-sm font-light text-gray-700">
                    Lessons adapt to your goals, pace, and story. You’re not just a student—you’re the center of the experience.
                  </p>
                </div>
                <div className="flex flex-col space-y-6 justify-center md:justify-start">
                  <span className="p-2 rounded-md bg-[var(--color-muted-green)]/10 text-[var(--color-muted-green)] flex w-max">
                    {/* Community icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M10 2a4 4 0 011 7.87V12a2 2 0 103.165 1.575A2.5 2.5 0 0010 14a2.5 2.5 0 00-4.165-2.425A2 2 0 109 12V9.87A4 4 0 0110 2z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <h1 className="flex text-lg font-semibold capitalize text-gray-900">
                    Welcoming Community
                  </h1>
                  <p className="text-sm font-light text-gray-700">
                    Learn with support, encouragement, and celebration for every step. Tunalismus is a safe space for every learner.
                  </p>
                </div>
              </div>
              {/* Center visual / illustration */}
              <div className="flex items-center justify-center order-3 md:col-span-2 lg:order-2 lg:row-span-2 lg:h-full">
                <div className="flex-1 relative bg-gradient-to-tr from-[var(--color-soft-blue)]/30 to-[var(--color-muted-green)]/50 p-6 rounded-lg aspect-[4/2.4] overflow-hidden">
                  <img src="https://i.pinimg.com/1200x/36/81/03/368103532f3efe3056acdce308b6c0c0.jpg" alt="Language connection illustration" className="w-full h-auto" />
                </div>
              </div>
              {/* Feature 2 */}
              <div className="order-1 grid gap-10 sm:grid-cols-2 md:order-2 md:grid-cols-1 lg:order-3">
                <div className="flex flex-col space-y-6 justify-center md:justify-start">
                  <span className="p-2 rounded-md bg-[var(--color-dusty-rose)]/10 text-[var(--color-dusty-rose)] flex w-max">
                    {/* Real world icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path d="M2 10a8 8 0 1116 0A8 8 0 012 10zm8 6a6 6 0 100-12 6 6 0 000 12zm0-2a4 4 0 110-8 4 4 0 010 8z" />
                    </svg>
                  </span>
                  <h1 className="flex text-lg font-semibold capitalize text-gray-900">
                    Real-World Focus
                  </h1>
                  <p className="text-sm font-light text-gray-700">
                    Practice with conversations and scenarios you’ll actually face in life, travel, and work—so you feel ready for the real world.
                  </p>
                </div>
                <div className="flex flex-col space-y-6 justify-center md:justify-start">
                  <span className="p-2 rounded-md bg-[var(--color-warm-gray)]/50 text-gray-700 flex w-max">
                    {/* Expertise icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm3 8a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <h1 className="flex text-lg font-semibold capitalize text-gray-900">
                    Experience Across Cultures
                  </h1>
                  <p className="text-sm font-light text-gray-700">
                    Learn from a lifelong connector who’s taught and lived in multilingual environments around the world.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fifth Section */}
      <TestimonialSection />

      {/* Sixth Section  */}
      <FAQ />

      {/* Seventh Section  */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-10 md:px-12 lg:px-5 relative z-50 backdrop-blur-3xl">
          <div className="w-full relative py-8 md:py-10 px-6 md:px-8 rounded-2xl bg-gradient-to-tr from-[var(--color-warm-gray)] to-[var(--color-soft-blue)]/20">
            {/* Top-right abstract accents */}
            <div className="absolute right-0 top-0 h-full w-full flex justify-end pointer-events-none">
              <div className="w-28 h-28 overflow-hidden flex rounded-xl relative blur-2xl">
                <span className="absolute w-16 h-16 -top-1 -right-1 bg-[var(--color-soft-blue)] rounded-md rotate-45" />
                <span className="absolute w-16 h-16 -bottom-1 -right-1 bg-[var(--color-muted-green)] rounded-md rotate-45" />
                <span className="absolute w-16 h-16 -bottom-1 -left-1 bg-[var(--color-dusty-rose)] rounded-md rotate-45" />
              </div>
            </div>
            {/* Bottom-left abstract accents */}
            <div className="absolute left-0 bottom-0 h-full w-full flex items-end pointer-events-none">
              <div className="w-28 h-28 overflow-hidden flex rounded-xl relative blur-2xl">
                <span className="absolute w-16 h-16 -top-1 -right-1 bg-[var(--color-soft-blue)] rounded-md rotate-45" />
                <span className="absolute w-16 h-16 -bottom-1 -right-1 bg-[var(--color-muted-green)] rounded-md rotate-45" />
                <span className="absolute w-16 h-16 -bottom-1 -left-1 bg-[var(--color-dusty-rose)] rounded-md rotate-45" />
              </div>
            </div>
            <div className="mx-auto text-center max-w-xl md:max-w-2xl relative space-y-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[var(--color-muted-green)] to-[var(--color-lavender)] uppercase">
                Ready to Start Your Language Journey?
              </h1>
              <p className="text-gray-700">
                Book a free intro session or dive right in, discover language learning that’s modern, kind, and made for you.
              </p>
              <div className="flex justify-center items-center flex-wrap mx-auto gap-4">
                <a href="#" className="flex items-center h-12 px-6 rounded-full bg-[var(--color-dusty-rose)] text-white border border-[var(--color-dusty-rose)]">
                  Get in touch
                </a>
                <a href="#" className="flex items-center h-12 px-6 rounded-full bg-[var(--color-muted-green)] text-[var(--color-warm-gray)] border border-[var(--color-muted-green)]/5 invert">
                  Learn more
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}