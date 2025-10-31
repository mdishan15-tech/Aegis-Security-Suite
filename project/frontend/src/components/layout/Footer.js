import React from 'react';
import { Github, Shield, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white border-t border-gray-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-gray-400" />
            <p className="text-gray-400">© 2025 Aegis Security Suite</p>
          </div>
          
          <div className="flex items-center gap-2 text-gray-400">
            <span>Made with</span>
            <Heart size={16} className="text-red-500 animate-pulse" />
            <span>for Data Security & Privacy</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/rahullalwani007"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;