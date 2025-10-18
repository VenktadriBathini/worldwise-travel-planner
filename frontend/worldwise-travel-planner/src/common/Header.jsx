import { Link } from "react-router-dom";

export default function Header() {
  return (
    <nav className="flex items-center justify-between p-4 bg-slate-900/70 backdrop-blur-xl shadow-lg">
      {/* Logo on the left */}
      <Link
        to="/"
        className="text-2xl font-bold text-white hover:text-cyan-300 transition-colors"
      >
        WorldWise
      </Link>

      {/* Menu buttons on the right */}
      <div className="flex items-center space-x-6">
        <Link
          to="/"
          className="text-white hover:text-cyan-300 transition-colors  from-fuchsia-300 to-cyan-300 text-lg font-medium"
        >
          Home
        </Link>
        <Link
          to="/login"
          className="text-white hover:text-cyan-300 transition-colors  from-fuchsia-200 to-cyan-200 text-lg font-medium"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white font-semibold shadow-lg hover:brightness-110 transition-all"
        >
          Sign Up
        </Link>
        <Link
          to="/features"
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white font-semibold shadow-lg hover:brightness-110 transition-all"
        >
          Features
        </Link>
        <Link
          to="/about"
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white font-semibold shadow-lg hover:brightness-110 transition-all"
        >
          About Us
        </Link>
      </div>
    </nav>
  );
}
