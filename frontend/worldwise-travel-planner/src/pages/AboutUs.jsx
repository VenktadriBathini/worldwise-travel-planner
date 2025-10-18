import { Link, Outlet, Route } from "react-router-dom";
import PlaceDetails from "../trip/PlaceDetails";

export default function AboutUs() {
  return (
    <>
      <div>
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
          {/* subtle background lights */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-[-6rem] h-80 w-80 -translate-x-1/2 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-400/10" />
            <div className="absolute right-[-4rem] bottom-[-6rem] h-72 w-72 rounded-full bg-fuchsia-300/20 blur-3xl dark:bg-fuchsia-400/10" />
          </div>

          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
            {/* Header */}
            <header className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center rounded-full border border-slate-200/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-white/10 dark:text-slate-300">
                About us
              </span>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                Plan smarter, travel easier, remember more.
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
                WorldTraveller is a map-first trip planner that connects your
                route, the places you’ll love, and the memories you’ll keep—all
                in one clean experience.
              </p>
            </header>

            {/* What we build */}
            <section className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Trip Planner",
                  desc: "Pin start, end, and waypoints. See your path instantly.",
                },
                {
                  title: "Smart Suggestions",
                  desc: "Hotels, food, attractions & gas with cost hints by stop.",
                },
                {
                  title: "On-Trip Journal",
                  desc: "Add notes, photos, categories, and visited dates.",
                },
                {
                  title: "Post-Trip Sharing",
                  desc: "Share a link or keep your trip as a private memory.",
                },
              ].map((f) => (
                <article
                  key={f.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/5"
                  style={{
                    transitionTimingFunction: "cubic-bezier(.2,.8,.2,1)",
                  }}
                >
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {f.desc}
                  </p>
                </article>
              ))}
            </section>

            {/* Why different / values */}
            <section className="mt-16 grid gap-10 lg:grid-cols-2">
              <div className="rounded-3xl bg-gradient-to-br from-sky-600 to-indigo-600 p-8 text-white shadow-lg">
                <h3 className="text-xl font-semibold">Why we’re different</h3>
                <ul className="mt-4 space-y-3 text-white/95">
                  <li>• Map-first planning—route before everything else.</li>
                  <li>• Cost awareness—estimated prices surface early.</li>
                  <li>• Memory-centric—notes & photos for each stop.</li>
                  <li>• Built for families, friends, and business trips.</li>
                </ul>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/5">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Privacy & trust
                </h3>
                <p className="mt-3 text-slate-600 dark:text-slate-300">
                  You control what you share and with whom. Keep trips private,
                  invite collaborators, or share a view-only link. Delete your
                  data anytime.
                </p>
                <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-white/10 dark:text-slate-200">
                  <strong>Roadmap:</strong> collaborative editing, offline
                  drafts, advanced filters, and export options.
                </div>
              </div>
            </section>

            {/* CTA */}
            <div className="mt-16 text-center">
              <a
                href="/signup"
                className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-sky-700"
              >
                Start planning — Free
              </a>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                No credit card required • Share with friends • Save memories
              </p>
            </div>
          </div>
        </section>
      </div>
      <Link
        to="/about/placeDetails"
        className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-sky-700"
      ></Link>
      <Outlet />
    </>
  );
}
