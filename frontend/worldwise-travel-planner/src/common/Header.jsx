import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
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
          className="text-white hover:text-cyan-300 transition-colors from-fuchsia-300 to-cyan-300 text-lg font-medium"
        >
          Home
        </Link>
        {user ? (
          <>
            <Link
              to="/dashboard"
              className="text-white hover:text-cyan-300 transition-colors text-lg font-medium"
            >
              Dashboard
            </Link>
            <div className="flex items-center space-x-2">
              {/* Placeholder for avatar - replace with actual avatar logic if available */}
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
                {user.display_name ? user.display_name[0].toUpperCase() : 'U'}
              </div>
              <span className="text-white text-lg font-medium">
                {user.display_name || user.email}
              </span>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold shadow-lg hover:brightness-110 transition-all"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-white hover:text-cyan-300 transition-colors from-fuchsia-200 to-cyan-200 text-lg font-medium"
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
          </>
        )}
      </div>
    </nav>
  );
}
