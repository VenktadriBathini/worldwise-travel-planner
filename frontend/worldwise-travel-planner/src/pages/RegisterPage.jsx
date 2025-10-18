// import { useState } from "react";

// export default function RegisterPage() {
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   function handleSubmit(e) {
//     e.preventDefault();
//     setFirstName(() => e.target.firstName.value);
//     setLastName(() => e.target.lastName.value);
//     setEmail(() => e.target.email.value);
//     setPassword(() => e.target.password.value);
//     console.log(firstName, lastName, email);
//   }
//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <p>Enter Your Details</p>
//         <label>
//           <span>First Name</span>
//           <input type="text" name="firstName" />
//         </label>
//         <label>
//           <span>Last Name</span>
//           <input type="text" name="lastName" />
//         </label>
//         <label>
//           <span>Email</span>
//           <input type="email" name="email" />
//         </label>
//         <label>
//           <span>Password</span>
//           <input type="password" name="password" />
//         </label>

//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// }
// src/pages/RegisterPage.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as apiRegister } from "../api/auth";
import beach from "../assets/beach.jpg"; // Import background image

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [pwVisible, setPwVisible] = useState(false);
  const [pwConfirmVisible, setPwConfirmVisible] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");               // top-level message
  const [fieldErrs, setFieldErrs] = useState({});   // per-field messages
  const nav = useNavigate();

  // Tiny strength meter (0-4)
  const strength = useMemo(() => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  }, [pw]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setFieldErrs({});
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());
    const payload = {
      firstName: String(data.firstName || "").trim(),
      lastName: String(data.lastName || "").trim(),
      email: String(data.email || "").trim(),
      password: String(data.password || ""),
      confirm: String(data.confirm || ""),
      terms: data.terms === "on",
    };

    // client-side guards (backend still validates with Zod)
    if (!payload.terms) {
      setErr("Please accept the Terms & Privacy Policy.");
      setLoading(false);
      return;
    }
    if (payload.password !== payload.confirm) {
      setFieldErrs((p) => ({ ...p, confirm: "Passwords do not match" }));
      setErr("Please fix the errors above.");
      setLoading(false);
      return;
    }
    // optional quick email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      setFieldErrs((p) => ({ ...p, email: "Please enter a valid email" }));
      setErr("Please fix the errors above.");
      setLoading(false);
      return;
    }

    try {
      await apiRegister({
        email: payload.email,
        password: payload.password,
        display_name: `${payload.firstName} ${payload.lastName}`.trim(),
      });
      nav("/login"); // Redirect to login after successful registration
    } catch (e) {
      // prefer normalized error from axiosClient; fall back to response
      const norm = e?.normalized;
      const api = e?.response?.data;
      const code = norm?.error || api?.error;

      if (code === "email_already_exists") {
        setFieldErrs({ email: api?.message || "Email already exists" });
        setErr("An account with this email already exists. Try logging in.");
      } else if (code === "validation_error") {
        // backend sends { field_errors: { email: "...", password: "..." } }
        setFieldErrs(api?.field_errors || {});
        setErr("Please fix the errors highlighted below.");
      } else if (code === "network_error") {
        setErr("Network error — check your connection and try again.");
      } else {
        setErr(e.message || "Registration failed");
      }
      console.error("register error:", e);
    } finally {
      setLoading(false); // ← prevents “stuck” button on any outcome
    }
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-6 py-10 sm:px-8 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${beach})` }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] -z-10"></div>

      <div className="mx-auto w-full max-w-3xl">
        {/* card with animated gradient border */}
        <div className="relative rounded-3xl p-[1px]">
          <div className="absolute inset-0 -z-10 rounded-3xl bg-[conic-gradient(at_30%_20%,#a78bfa_0%,#22d3ee_35%,#f472b6_70%,#a78bfa_100%)] opacity-60 blur-md" />
          <div className="rounded-3xl bg-slate-900/70 p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl sm:p-10">
            {/* header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-cyan-400 text-white shadow-lg">
                WT
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Create your account
              </h1>
              <p className="mt-1 text-sm text-slate-300">
                Plan smarter, discover better, and save every memory.
              </p>
            </div>

            {/* form */}
            <form onSubmit={handleSubmit} noValidate className="grid gap-6">
              {/* name row */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <FloatingInput
                    label="First Name"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                  />
                  <FieldError name="firstName" fieldErrs={fieldErrs} />
                </div>
                <div>
                  <FloatingInput
                    label="Last Name"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                  />
                  <FieldError name="lastName" fieldErrs={fieldErrs} />
                </div>
              </div>

              {/* email */}
              <div>
                <FloatingInput
                  label="Email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
                <FieldError name="email" fieldErrs={fieldErrs} />
              </div>

              {/* password + confirm */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <FloatingInput
                    label="Password"
                    name="password"
                    type={pwVisible ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    onChange={(e) => setPw(e.target.value)}
                    rightSlot={
                      <button
                        type="button"
                        onClick={() => setPwVisible((v) => !v)}
                        className="text-xs font-medium text-slate-300 hover:text-white"
                        aria-label={pwVisible ? "Hide password" : "Show password"}
                      >
                        {pwVisible ? "Hide" : "Show"}
                      </button>
                    }
                  />
                  <FieldError name="password" fieldErrs={fieldErrs} />
                </div>

                <div>
                  <FloatingInput
                    label="Confirm Password"
                    name="confirm"
                    type={pwConfirmVisible ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    rightSlot={
                      <button
                        type="button"
                        onClick={() => setPwConfirmVisible((v) => !v)}
                        className="text-xs font-medium text-slate-300 hover:text-white"
                        aria-label={
                          pwConfirmVisible ? "Hide confirm" : "Show confirm"
                        }
                      >
                        {pwConfirmVisible ? "Hide" : "Show"}
                      </button>
                    }
                  />
                  <FieldError name="confirm" fieldErrs={fieldErrs} />
                </div>
              </div>

              {/* strength meter */}
              <div className="mt-[-12px]">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Password strength</span>
                  <span className="text-[10px] uppercase tracking-wide text-slate-400">
                    {["Very weak", "Weak", "Fair", "Good", "Strong"][strength]}
                  </span>
                </div>
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded ${
                        i < strength
                          ? [
                              "bg-rose-500",
                              "bg-orange-400",
                              "bg-amber-400",
                              "bg-emerald-400",
                            ][i]
                          : "bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* terms */}
              <label className="mt-2 flex items-start gap-3">
                <input
                  type="checkbox"
                  name="terms"
                  className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-transparent text-cyan-400 focus:ring-cyan-400"
                  required
                />
                <span className="text-sm text-slate-300">
                  I agree to the{" "}
                  <a
                    href="/terms"
                    className="text-cyan-300 underline-offset-2 hover:underline"
                  >
                    Terms
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    className="text-cyan-300 underline-offset-2 hover:underline"
                  >
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>

              {/* submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-2xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-500 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-600/20 transition hover:brightness-110 active:scale-[.99] disabled:opacity-60"
              >
                {loading ? "Creating account…" : "Create account"}
              </button>

              {/* top-level error */}
              {err && (
                <p className="text-center text-sm text-rose-400" role="alert" aria-live="polite">
                  {err}
                </p>
              )}

              <p className="text-center text-sm text-slate-400">
                Already have an account?{" "}
                <a href="/login" className="text-cyan-300 hover:underline">
                  Log in
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

/** small component to render per-field error text under inputs */
function FieldError({ name, fieldErrs }) {
  const msg = fieldErrs?.[name];
  if (!msg) return null;
  return <p className="mt-1 text-xs text-rose-400">{msg}</p>;
}

/** Floating label input with optional right slot (e.g., “Show” button) */
function FloatingInput({
  label,
  name,
  type = "text",
  required,
  minLength,
  autoComplete,
  onChange,
  rightSlot,
}) {
  const id = `${name}-id`;
  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        onChange={onChange}
        placeholder=" " // keep a space to trigger :placeholder-shown
        className="peer w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none backdrop-blur placeholder-transparent focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 rounded px-1 text-sm text-slate-300 transition-all
                   peer-focus:top-0 peer-focus:translate-y-[-60%] peer-focus:text-xs peer-focus:text-cyan-300
                   peer-placeholder-shown:top-1/2 peer-placeholder-shown:translate-y-[-50%] peer-placeholder-shown:text-sm"
      >
        {label}
      </label>
      {rightSlot && (
        <div className="absolute inset-y-0 right-3 flex items-center">
          {rightSlot}
        </div>
      )}
    </div>
  );
}
