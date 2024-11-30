import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, MessageCircle, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8">
                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 36c9.941 0 18-8.059 18-18S27.941 0 18 0 0 8.059 0 18s8.059 18 18 18z" fill="url(#logo-gradient)"/>
                  <defs>
                    <linearGradient id="logo-gradient" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FF5757"/>
                      <stop offset="0.5" stopColor="#FFC149"/>
                      <stop offset="1" stopColor="#8C4FF0"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="font-bold text-xl text-gray-900">SolMates</span>
            </Link>
            <p className="text-gray-500 text-sm">Connect with fellow traders and grow together.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-gray-500 hover:text-gray-900">Features</Link></li>
              <li><Link to="/faq" className="text-gray-500 hover:text-gray-900">FAQ</Link></li>
              <li><a href="#" className="text-gray-500 hover:text-gray-900">Security</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-gray-900">About Us</a></li>
              <li><a href="#" className="text-gray-500 hover:text-gray-900">Careers</a></li>
              <li><a href="#" className="text-gray-500 hover:text-gray-900">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-gray-900">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} SolMates. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <a href="#" className="hover:text-gray-900">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-900">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-900">Community Guidelines</a>
          </div>
        </div>
      </div>
    </footer>
  );
}