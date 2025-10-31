import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Shield, AlertCircle, TrendingUp, Lock, CheckCircle, Info } from 'lucide-react';
import { privacyService } from '../services/api';
import { getCurrentUTCTime } from '../utils/timeUtils';
import AnimatedCard from '../components/common/AnimatedCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const PrivacyDashboard = () => {
  const [settings, setSettings] = useState({
    email: { value: 'rahullalwani007@example.com', masked: false },
    phone: { value: '+1 234 567 8900', masked: true },
    address: { value: '123 Main St, City, ST 12345', masked: true },
    payment: { value: '**** **** **** 4321', masked: true }
  });

  const [privacyScore, setPrivacyScore] = useState(null);
  const [lastUpdate] = useState(getCurrentUTCTime());
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    loadPrivacyScore();
  }, []);

  const loadPrivacyScore = async () => {
    try {
      setLoading(true);
      const { data } = await privacyService.getPrivacyScore();
      setPrivacyScore(data);
    } catch (error) {
      console.error('Failed to load privacy score:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMask = async (field) => {
    try {
      const newMaskedState = !settings[field].masked;
      const { data } = await privacyService.toggleFieldMask(field, newMaskedState);
      
      setSettings(prev => ({
        ...prev,
        [field]: {
          value: data.value,
          masked: data.isMasked
        }
      }));
      
      // Reload privacy score after change
      loadPrivacyScore();
    } catch (error) {
      console.error('Failed to toggle mask:', error);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 75) return 'text-yellow-500';
    if (score >= 60) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Poor';
  };

  const chartData = privacyScore?.factors 
    ? Object.entries(privacyScore.factors).map(([name, value]) => ({
        name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value
      }))
    : [];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 mt-16">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <AnimatedCard delay={0}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Privacy Score</p>
              <p className={`text-3xl font-bold ${getScoreColor(privacyScore?.score || 0)}`}>
                {privacyScore?.score || 0}%
              </p>
            </div>
            <Shield className={getScoreColor(privacyScore?.score || 0)} size={40} />
          </div>
        </AnimatedCard>

        <AnimatedCard delay={100}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Status</p>
              <p className="text-xl font-bold text-green-500">
                {getScoreLabel(privacyScore?.score || 0)}
              </p>
            </div>
            <TrendingUp className="text-green-500" size={40} />
          </div>
        </AnimatedCard>

        <AnimatedCard delay={200}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Protected Fields</p>
              <p className="text-3xl font-bold">
                {Object.values(settings).filter(s => s.masked).length}/4
              </p>
            </div>
            <Lock className="text-blue-500" size={40} />
          </div>
        </AnimatedCard>

        <AnimatedCard delay={300}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Last Update</p>
              <p className="text-sm font-semibold">{lastUpdate.split(' ')[1]}</p>
            </div>
            <CheckCircle className="text-green-500" size={40} />
          </div>
        </AnimatedCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Privacy Settings */}
        <AnimatedCard delay={400}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Privacy Settings</h2>
              <p className="text-gray-400 text-sm">Last updated: {lastUpdate}</p>
            </div>
            <Shield className="text-green-500" size={32} />
          </div>

          <div className="space-y-4">
            {Object.entries(settings).map(([field, data], index) => (
              <div 
                key={field} 
                className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm text-gray-400 capitalize font-semibold">
                    {field === 'payment' ? 'Payment Card' : field}
                  </label>
                  <button
                    onClick={() => toggleMask(field)}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 bg-gray-900 rounded-lg hover:bg-gray-600"
                  >
                    {data.masked ? (
                      <>
                        <EyeOff size={16} />
                        <span>Masked</span>
                      </>
                    ) : (
                      <>
                        <Eye size={16} />
                        <span>Visible</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span 
                    className={`text-lg font-mono ${
                      data.masked ? 'blur-sm select-none' : ''
                    }`}
                  >
                    {data.value}
                  </span>
                  {data.masked && (
                    <AlertCircle className="text-green-500" size={20} />
                  )}
                </div>
                {data.masked && (
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Lock size={12} className="text-green-500" />
                    This field is protected and masked from unauthorized access
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-semibold text-blue-500 mb-1">Privacy Tip</p>
                <p className="text-sm text-gray-400">
                  Enable masking for all sensitive fields to maximize your privacy protection. 
                  Masked data is encrypted and only visible to you.
                </p>
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* Privacy Score Breakdown */}
        <AnimatedCard delay={500}>
          <h3 className="text-xl font-bold mb-6">Privacy Score Analysis</h3>
          
          {privacyScore ? (
            <>
              <div className="flex items-center justify-center mb-8">
                <div className="relative">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                      className="text-gray-800"
                      strokeWidth="12"
                      stroke="currentColor"
                      fill="transparent"
                      r="62"
                      cx="80"
                      cy="80"
                    />
                    <circle
                      className={getScoreColor(privacyScore.score)}
                      strokeWidth="12"
                      stroke="currentColor"
                      fill="transparent"
                      r="62"
                      cx="80"
                      cy="80"
                      strokeDasharray={`${2 * Math.PI * 62}`}
                      strokeDashoffset={`${2 * Math.PI * 62 * (1 - privacyScore.score / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <span className={`text-4xl font-bold ${getScoreColor(privacyScore.score)}`}>
                      {privacyScore.score}%
                    </span>
                    <p className="text-sm text-gray-400 mt-1">{getScoreLabel(privacyScore.score)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <h4 className="font-semibold text-lg">Score Breakdown</h4>
                {Object.entries(privacyScore.factors).map(([factor, score]) => (
                  <div key={factor}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400 capitalize">
                        {factor.replace(/_/g, ' ')}
                      </span>
                      <span className={`font-semibold ${getScoreColor(score)}`}>{score}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          score >= 80 ? 'bg-green-500' : 
                          score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {chartData.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-4">Factor Distribution</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
            </div>
          )}
        </AnimatedCard>
      </div>

      {/* Recommendations */}
      {privacyScore?.recommendations && (
        <AnimatedCard delay={600}>
          <h3 className="text-xl font-bold mb-6">Privacy Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {privacyScore.recommendations.map((recommendation, index) => (
              <div 
                key={index}
                className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-500 text-sm font-bold">{index + 1}</span>
                  </div>
                  <p className="text-sm text-gray-300">{recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedCard>
      )}

      {/* Data Access Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatedCard delay={700}>
          <h3 className="text-xl font-bold mb-6">Recent Activity Log</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-4 p-4 bg-gray-800 rounded-lg">
              <Lock className="text-green-500 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="font-semibold">Phone number masked</p>
                <p className="text-sm text-gray-400">{getCurrentUTCTime()}</p>
                <p className="text-xs text-gray-500 mt-1">System automatically protected your data</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-800 rounded-lg">
              <Shield className="text-blue-500 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="font-semibold">Address information encrypted</p>
                <p className="text-sm text-gray-400">{getCurrentUTCTime()}</p>
                <p className="text-xs text-gray-500 mt-1">Enhanced privacy protection applied</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-800 rounded-lg">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="font-semibold">Payment card secured</p>
                <p className="text-sm text-gray-400">{getCurrentUTCTime()}</p>
                <p className="text-xs text-gray-500 mt-1">Zero-knowledge encryption enabled</p>
              </div>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={800}>
          <h3 className="text-xl font-bold mb-6">Privacy Protection Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-green-500/5 rounded-lg border border-green-500/20">
              <div className="flex items-center gap-3">
                <Shield className="text-green-500" size={24} />
                <div>
                  <p className="font-semibold">Data Encryption</p>
                  <p className="text-sm text-gray-400">All sensitive data encrypted</p>
                </div>
              </div>
              <CheckCircle className="text-green-500" size={20} />
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-blue-500/5 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-3">
                <Lock className="text-blue-500" size={24} />
                <div>
                  <p className="font-semibold">Zero-Knowledge</p>
                  <p className="text-sm text-gray-400">No one can access your data</p>
                </div>
              </div>
              <CheckCircle className="text-blue-500" size={20} />
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/10 to-purple-500/5 rounded-lg border border-purple-500/20">
              <div className="flex items-center gap-3">
                <Eye className="text-purple-500" size={24} />
                <div>
                  <p className="font-semibold">Privacy Masking</p>
                  <p className="text-sm text-gray-400">Active on {Object.values(settings).filter(s => s.masked).length} fields</p>
                </div>
              </div>
              <CheckCircle className="text-purple-500" size={20} />
            </div>
          </div>

          <button
            onClick={loadPrivacyScore}
            className="w-full mt-6 px-4 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Shield size={20} />
            Refresh Privacy Score
          </button>
        </AnimatedCard>
      </div>
    </div>
  );
};

export default PrivacyDashboard;