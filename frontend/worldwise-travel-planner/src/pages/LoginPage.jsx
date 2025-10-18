// import { useState } from "react";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   function handleSubmit(e) {
//     e.preventDefault();
//     console.log("Login Success");
//   }
//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <p>Enter Login Details</p>
//         <label>
//           <span>User Email Id</span>
//           <input type="email" name="email" />
//         </label>
//         <label>
//           <span>User Password</span>
//           <input type="password" name="password" />
//         </label>
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// }
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    // const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    // await new Promise((r) => setTimeout(r, 600));
    login(email, password);
    // console.log("LOGIN ->", { ...data, password: "••••••••" });
    console.log("Hello i have logged in!!!");
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      {/* animated neon halo */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl animate-pulse" />
        <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl animate-[pulse_3s_ease-in-out_infinite]" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-slate-900/70 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-xl relative"
      >
        {/* gradient border ring */}
        <div className="pointer-events-none absolute -inset-px rounded-2xl bg-[linear-gradient(120deg,rgba(168,85,247,.5),rgba(34,211,238,.5))] opacity-30 blur-[6px]" />

        <div className="relative">
          <h1 className="text-xl font-semibold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-300">Log in to continue</p>

          <label className="mt-5 block">
            <span className="text-sm text-slate-200">Email</span>
            <input
              name="email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm text-slate-200">Password</span>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/30"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 active:scale-[.99] disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Login"}
          </button>

          <p className="mt-4 text-center text-xs text-slate-400">
            New here?{" "}
            <a href="/signup" className="text-cyan-300 hover:underline">
              Create an account
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
