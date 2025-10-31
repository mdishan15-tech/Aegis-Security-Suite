import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Eye, UserCheck, Wifi, ArrowRight, Zap, Activity, Database } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 100;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 - distance / 500})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const features = [
    {
      title: 'Heimdall',
      description: 'AI-Powered Threat Detection',
      icon: Shield,
      path: '/heimdall',
      color: 'from-blue-500 to-cyan-500',
      stats: '99.9% Detection Rate'
    },
    {
      title: 'Vault',
      description: 'Military-Grade Encryption',
      icon: Lock,
      path: '/vault',
      color: 'from-green-500 to-emerald-500',
      stats: 'AES-256 Encryption'
    },
    {
      title: 'Privacy Shield',
      description: 'Advanced Data Protection',
      icon: Eye,
      path: '/privacy',
      color: 'from-purple-500 to-pink-500',
      stats: 'Zero-Knowledge Architecture'
    },
    {
      title: 'Phalanx Training',
      description: 'Security Awareness Platform',
      icon: UserCheck,
      path: '/training',
      color: 'from-yellow-500 to-orange-500',
      stats: '85% Threat Prevention'
    },
    {
      title: 'Sentry',
      description: 'IoT Device Protection',
      icon: Wifi,
      path: '/sentry',
      color: 'from-red-500 to-rose-500',
      stats: 'Real-Time Monitoring'
    }
  ];

  const stats = [
    { icon: Shield, value: '1M+', label: 'Threats Blocked' },
    { icon: Database, value: '256-bit', label: 'Encryption' },
    { icon: Activity, value: '24/7', label: 'Monitoring' },
    { icon: Zap, value: '<1ms', label: 'Response Time' }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-30"
      />

      {/* Hero Section */}
      <div className="relative h-screen flex flex-col justify-center items-center text-center px-4">
        <div className="animate-slide-in">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-wider mb-6 bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
            AEGIS
          </h1>
          <p className="text-xl md:text-3xl text-gray-400 mb-8 max-w-3xl">
            Next-Generation Data Security & Privacy Platform
          </p>
          <p className="text-md md:text-lg text-gray-500 mb-12 max-w-2xl">
            Protecting against cyberattacks, data breaches, and IoT vulnerabilities with advanced AI-powered security
          </p>
          <button
            onClick={() => navigate('/heimdall')}
            className="group px-8 py-4 bg-white text-black rounded-lg font-semibold text-lg hover:bg-gray-200 transition-all transform hover:scale-105 flex items-center gap-3 mx-auto"
          >
            Get Started
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="animate-bounce mt-16">
          <svg 
            className="w-8 h-8 text-gray-600"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="text-center animate-slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</p>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Features Grid */}
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          Security Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <button
                key={index}
                onClick={() => navigate(feature.path)}
                className="group relative p-8 bg-gray-900 rounded-2xl hover:bg-gray-800 transition-all transform hover:-translate-y-2 hover:shadow-2xl border border-gray-800 hover:border-gray-700 text-left animate-slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 mb-4">{feature.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{feature.stats}</span>
                  <ArrowRight size={20} className="text-gray-600 group-hover:text-white group-hover:translate-x-2 transition-all" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Problem Statement Section */}
      <div className="relative max-w-7xl mx-auto px-4 py-24">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 md:p-12 border border-gray-800">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Addressing Critical Security Challenges
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Sophisticated cyberattacks bypassing traditional security',
              'Data vulnerability across cloud and organizational platforms',
              'Identity theft from excessive personal data sharing',
              'Human error as the biggest security vulnerability',
              'Lack of strong security protocols for IoT devices'
            ].map((challenge, index) => (
              <div 
                key={index}
                className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <p className="text-gray-300">{challenge}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;