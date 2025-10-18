// export default function Features() {
//   return (
//     <div>
//       <h1> Top features</h1>
//       <p>Unlimited stops</p>
//       <p>Smart routing with live suggestions</p>
//       <p>Save memories (notes & photos)</p>
//       <p>Cost & time–aware choices</p>
//       <p>Share trip plans with friends & family</p>
//     </div>
//   );
// }
export default function Features() {
  const items = [
    {
      icon: "🗺️",
      title: "Unlimited stops",
      desc: "Add as many waypoints as you like and update routes instantly.",
    },
    {
      icon: "⚡",
      title: "Smart routing",
      desc: "Live suggestions for hotels, food, attractions, and gas with costs.",
    },
    {
      icon: "🖼️",
      title: "Save memories",
      desc: "Attach notes and photos to each stop—keep every moment.",
    },
    {
      icon: "⏱️",
      title: "Cost & time aware",
      desc: "Make informed choices and stay within plan and budget.",
    },
    {
      icon: "🔗",
      title: "Easy sharing",
      desc: "Share trips with friends & family or invite collaborators.",
    },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* gradient ribbon background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1000px_400px_at_50%_-10%,rgba(59,130,246,0.15),transparent),radial-gradient(800px_300px_at_20%_120%,rgba(236,72,153,0.15),transparent)]" />

      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <header className="text-center">
          <span className="inline-flex items-center rounded-full border border-slate-200/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
            Top features
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Travel smarter, plan faster
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600">
            A focused set of tools that make planning and sharing effortless.
          </p>
        </header>

        {/* feature grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f, i) => (
            <article
              key={f.title}
              className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition
                         hover:-translate-y-1 hover:shadow-xl"
              style={{ transitionTimingFunction: "cubic-bezier(.2,.8,.2,1)" }}
            >
              {/* gradient ring on hover */}
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100
                              [background:conic-gradient(from_180deg_at_50%_50%,rgba(59,130,246,0.15),rgba(236,72,153,0.15),rgba(99,102,241,0.15),rgba(59,130,246,0.15))]"
              />

              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-sky-50 to-indigo-50 ring-1 ring-slate-200">
                    <span className="text-xl">{f.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {f.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {f.desc}
                </p>

                {/* tiny CTA chip */}
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 transition group-hover:border-slate-300 group-hover:bg-slate-50">
                  Learn more
                  <svg
                    className="h-3.5 w-3.5 -mr-0.5 transition group-hover:translate-x-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M12.293 5.293a1 1 0 011.414 0L18 9.586a1 1 0 010 1.414l-4.293 4.293a1 1 0 01-1.414-1.414L14.586 11H4a1 1 0 110-2h10.586l-2.293-2.293a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </article>
          ))}

          {/* big highlight card spanning columns */}
          <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-600 to-indigo-600 p-6 text-white shadow-lg sm:col-span-2 lg:col-span-3">
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <h3 className="text-xl font-semibold">All-in-one planner</h3>
            <p className="mt-2 max-w-3xl text-sm text-white/90">
              Plan routes, pick stops, track costs, save memories, and share—all
              in one place. No tabs. No spreadsheets. Just your trip.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              Start planning — Free
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
