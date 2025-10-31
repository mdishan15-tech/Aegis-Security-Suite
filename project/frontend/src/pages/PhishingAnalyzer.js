import React, { useState } from 'react';
import { ScanLine, ShieldCheck, ShieldAlert, Mail, Link as LinkIcon, Share2 } from 'lucide-react';
import { securityService } from '../services/api';
import AnimatedCard from '../components/common/AnimatedCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PhishingAnalyzer = () => {
  const [analysisInput, setAnalysisInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [spamInput, setSpamInput] = useState('');
  const [spamResult, setSpamResult] = useState(null);
  const [isCheckingSpam, setIsCheckingSpam] = useState(false);

  const handleAnalysisSubmit = async (e) => {
    e.preventDefault();
    if (!analysisInput.trim()) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      // Simulate API call to LLM
      setTimeout(() => {
        const isPhishing = /credit card|password|urgent|verify/i.test(analysisInput);
        const suspicionScore = isPhishing ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 40);
        
        let analysis = [];
        if (suspicionScore > 60) {
          analysis.push('Urgent language detected, which is a common phishing tactic.');
          analysis.push('Requests for sensitive information (e.g., passwords, credit card numbers).');
        } else if (suspicionScore > 30) {
          analysis.push('Contains links that should be verified before clicking.');
          analysis.push('Generic greetings are sometimes used in phishing emails.');
        } else {
          analysis.push('The content appears to be safe.');
          analysis.push('No immediate signs of phishing or malicious intent detected.');
        }

        setAnalysisResult({
          suspicion_score: suspicionScore,
          analysis: analysis.join('\n'),
        });
        setIsAnalyzing(false);
      }, 1500);
    } catch (error) {
      console.error('Analysis failed:', error);
      setIsAnalyzing(false);
    }
  };

  const handleSpamCheckSubmit = async (e) => {
    e.preventDefault();
    if (!spamInput.trim()) return;

    setIsCheckingSpam(true);
    setSpamResult(null);
    try {
        // Simulate API Call
        setTimeout(() => {
            const isSpam = /bit\.ly|tinyurl\.com|shorturl\.at/i.test(spamInput);
            setSpamResult({
                is_spam: isSpam,
                reason: isSpam ? 'URL uses a known link shortener often used for spam.' : 'URL does not appear to be a spam link.'
            });
            setIsCheckingSpam(false);
        }, 1500);
    } catch (error) {
        console.error('Spam check failed:', error);
        setIsCheckingSpam(false);
    }
  };

  const getScoreColor = (score) => {
    if (score > 75) return 'text-red-500';
    if (score > 50) return 'text-orange-500';
    if (score > 25) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 mt-16">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold">Phishing Analyzer</h1>
        <p className="text-gray-400 mt-2">Analyze emails and URLs for phishing threats.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Phishing Analyzer */}
        <AnimatedCard>
          <h2 className="text-2xl font-bold mb-4 flex items-center"><Mail className="mr-2" /> Email & URL Analyzer</h2>
          <form onSubmit={handleAnalysisSubmit}>
            <textarea
              className="w-full h-48 p-4 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="Paste email content or URL here..."
              value={analysisInput}
              onChange={(e) => setAnalysisInput(e.target.value)}
            />
            <button
              type="submit"
              className="w-full mt-4 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? <><LoadingSpinner message="Analyzing..." size={20} /> Analyzing...</> : <><ScanLine /> Analyze Content</>}
            </button>
          </form>

          {analysisResult && (
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4">Analysis Result</h3>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold">Suspicion Score:</span>
                  <span className={`text-2xl font-bold ${getScoreColor(analysisResult.suspicion_score)}`}>
                    {analysisResult.suspicion_score} / 100
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full ${analysisResult.suspicion_score > 75 ? 'bg-red-500' : analysisResult.suspicion_score > 50 ? 'bg-orange-500' : analysisResult.suspicion_score > 25 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${analysisResult.suspicion_score}%` }}
                  ></div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Analysis:</h4>
                  <p className="text-sm text-gray-300 whitespace-pre-line">{analysisResult.analysis}</p>
                </div>
              </div>
            </div>
          )}
        </AnimatedCard>
        
        {/* Spam Checker */}
        <AnimatedCard>
          <h2 className="text-2xl font-bold mb-4 flex items-center"><LinkIcon className="mr-2" /> Spam Link Checker</h2>
          <form onSubmit={handleSpamCheckSubmit}>
            <input
              type="text"
              className="w-full p-4 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="Enter a URL to check for spam..."
              value={spamInput}
              onChange={(e) => setSpamInput(e.target.value)}
            />
            <button
              type="submit"
              className="w-full mt-4 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={isCheckingSpam}
            >
              {isCheckingSpam ? <><LoadingSpinner message="Checking..." size={20} /> Checking...</> : <><ScanLine /> Check Link</>}
            </button>
          </form>

          {spamResult && (
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4">Spam Check Result</h3>
              <div className={`p-4 rounded-lg flex items-center gap-4 ${spamResult.is_spam ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                {spamResult.is_spam ? <ShieldAlert size={40} /> : <ShieldCheck size={40} />}
                <div>
                  <h4 className="font-bold text-lg">{spamResult.is_spam ? 'Spam Detected' : 'Link Appears Safe'}</h4>
                  <p className="text-sm">{spamResult.reason}</p>
                </div>
              </div>
            </div>
          )}
        </AnimatedCard>
      </div>
    </div>
  );
};

export default PhishingAnalyzer;
