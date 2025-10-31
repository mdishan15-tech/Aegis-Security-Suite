import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Lock, Eye, UserCheck, Wifi, Menu, X, User, Fish } from 'lucide-react'; // Add Fish icon
import { useUser } from '../../context/UserContext';
import { APP_CONFIG } from '../../config/constants';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const user = useUser();

  const navigation = [
    { name: 'Heimdall', path: '/heimdall', icon: Shield, description: 'Threat Detection' },
    { name: 'Vault', path: '/vault', icon: Lock, description: 'File Encryption' },
    { name: 'Privacy', path: '/privacy', icon: Eye, description: 'Data Protection' },
    { name: 'Training', path: '/training', icon: UserCheck, description: 'Security Awareness' },
    { name: 'Sentry', path: '/sentry', icon: Wifi, description: 'IoT Security' },
    { name: 'Phishing', path: '/phishing', icon: Fish, description: 'Phishing Analyzer' } // Add this line
  ];

  return (
    <header className="fixed top-0 w-full px-4 md:px-8 py-4 md:py-6 flex justify-between items-center z-50 bg-black/95 backdrop-blur-lg border-b border-white/10">
      <Link to="/" className="text-2xl md:text-3xl font-black tracking-wider hover:text-gray-300 transition-colors">
        AEGIS
      </Link>
      
      <nav className={`${isOpen ? 'flex' : 'hidden'} md:flex fixed md:relative top-0 left-0 w-full h-screen md:h-auto md:w-auto bg-black md:bg-transparent flex-col md:flex-row justify-center items-center gap-8 md:gap-6`}>
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute top-6 right-6 text-white"
        >
          <X size={28} />
        </button>
        
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 hover:text-white transition-colors group ${
                location.pathname === item.path ? 'text-white' : 'text-gray-400'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Icon size={20} className="group-hover:scale-110 transition-transform" />
              <span className="hidden lg:inline">{item.name}</span>
            </Link>
          );
        })}
        
        <div className="flex items-center gap-2 text-gray-400 border-l border-gray-700 pl-6 ml-6">
          <User size={16} />
          <span className="text-sm">{APP_CONFIG.CURRENT_USER}</span>
        </div>
      </nav>

      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="md:hidden z-50 hover:text-gray-300 transition-colors"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>
    </header>
  );
};

export default Header;