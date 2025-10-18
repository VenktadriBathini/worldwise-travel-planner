import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900/70 backdrop-blur-xl text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Section 1: About WorldWise */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-cyan-300">WorldWise</h3>
            <p className="text-sm text-gray-300">
              Your ultimate travel planner. Explore, plan, and save your memories with ease.
            </p>
          </div>

          {/* Section 2: Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-fuchsia-300">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 3: Connect With Us */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-cyan-300">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                {/* Placeholder for Facebook icon */}
                <i className="fab fa-facebook-f"></i> Facebook
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                {/* Placeholder for Twitter icon */}
                <i className="fab fa-twitter"></i> Twitter
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                {/* Placeholder for Instagram icon */}
                <i className="fab fa-instagram"></i> Instagram
              </a>
            </div>
            <p className="text-sm text-gray-300 mt-4">
              Email: info@worldwise.com
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} WorldWise. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
