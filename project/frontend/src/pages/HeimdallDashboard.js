import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Activity, TrendingUp, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { heimdallService } from '../services/api';
import { APP_CONFIG, THREAT_SEVERITY_COLORS } from '../config/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AnimatedCard from '../components/common/AnimatedCard';
import { getRelativeTime } from '../utils/timeUtils';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HeimdallDashboard = () => {
  const [threats, setThreats] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState(APP_CONFIG.CURRENT_UTC);
  const [autoScan, setAutoScan] = useState(false);

  useEffect(() => {
    loadThreatsHistory();
    loadAnalytics();
  }, []);

  useEffect(() => {
    if (autoScan) {
      const interval = setInterval(() => {
        simulateScan();
      }, 10000); // Auto-scan every 10 seconds
      return () => clearInterval(interval);
    }
  }, [autoScan]);

  const loadThreatsHistory = async () => {
    try {
      const { data } = await heimdallService.getThreatsHistory();
      setThreats(data.threats || []);
    } catch (error) {
      console.error('Failed to load threats:', error);
    }
  };

  const loadAnalytics = async () => {
    try {
      const { data } = await heimdallService.getThreatAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const simulateScan = async () => {
    try {
      setScanning(true);
      const { data } = await heimdallService.simulateThreatDetection();
      
      if (data.threat_detected) {
        setThreats(prev => [data.details, ...prev].slice(0, 20));
        // Show notification
        showNotification('Threat Detected!', data.details.type);
      }
      
      setLastScan(new Date().toISOString().replace('T', ' ').substr(0, 19));
      await loadAnalytics();
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setScanning(false);
    }
  };

  const showNotification = (title, message) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body: message, icon: '/favicon.ico' });
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  // Prepare chart data
  const threatTypeData = analytics?.threat_by_type 
    ? Object.entries(analytics.threat_by_type).map(([name, value]) => ({ name, value }))
    : [];

  const severityData = analytics?.severity_distribution
    ? Object.entries(analytics.severity_distribution).map(([name, value]) => ({ name, value }))
    : [];

  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 mt-16">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <AnimatedCard delay={0}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Threats</p>
              <p className="text-3xl font-bold">{analytics?.total_threats || 0}</p>
            </div>
            <Shield className="text-blue-500" size={40} />
          </div>
        </AnimatedCard>

        <AnimatedCard delay={100}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Blocked Rate</p>
              <p className="text-3xl font-bold text-green-500">{analytics?.blocked_rate || 0}%</p>
            </div>
            <CheckCircle className="text-green-500" size={40} />
          </div>
        </AnimatedCard>

        <AnimatedCard delay={200}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Last 24h</p>
              <p className="text-3xl font-bold text-orange-500">{analytics?.threats_last_24h || 0}</p>
            </div>
            <Activity className="text-orange-500" size={40} />
          </div>
        </AnimatedCard>

        <AnimatedCard delay={300}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Status</p>
              <p className="text-xl font-bold text-green-500">Protected</p>
            </div>
            <div className="status-dot status-secured animate-pulse" />
          </div>
        </AnimatedCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Control Panel */}
        <AnimatedCard className="lg:col-span-1" delay={400}>
          <div className="flex items-center gap-4 mb-6">
            <Shield className="text-green-500" size={32} />
            <div>
              <h3 className="text-xl font-bold">Network Status</h3>
              <p className="text-sm text-gray-400">Last scan: {lastScan}</p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={simulateScan}
              disabled={scanning}
              className="w-full px-4 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {scanning ? (
                <>
                  <RefreshCw className="animate-spin" size={20} />
                  Scanning...
                </>
              ) : (
                <>
                  <Shield size={20} />
                  Run Security Scan
                </>
              )}
            </button>

            <button
              onClick={() => setAutoScan(!autoScan)}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
                autoScan 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {autoScan ? 'Auto-Scan: ON' : 'Auto-Scan: OFF'}
            </button>

            <button
              onClick={requestNotificationPermission}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              Enable Notifications
            </button>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Quick Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Scans:</span>
                  <span className="font-semibold">{autoScan ? 'Running' : 'Idle'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Response Time:</span>
                  <span className="font-semibold text-green-500">&lt;1ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Detection Accuracy:</span>
                  <span className="font-semibold text-green-500">99.9%</span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* Threat Type Distribution */}
        <AnimatedCard className="lg:col-span-2" delay={500}>
          <h3 className="text-xl font-bold mb-6">Threat Distribution</h3>
          {threatTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={threatTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No threat data available
            </div>
          )}
        </AnimatedCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Severity Distribution */}
        <AnimatedCard delay={600}>
          <h3 className="text-xl font-bold mb-6">Severity Breakdown</h3>
          {severityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No severity data available
            </div>
          )}
        </AnimatedCard>

        {/* Real-time Activity */}
        <AnimatedCard delay={700}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Real-time Activity</h3>
            <Activity className="text-green-500 animate-pulse" size={24} />
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {threats.slice(0, 5).map((threat, index) => (
              <div 
                key={threat.id} 
                className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <AlertTriangle className="text-red-500 flex-shrink-0" size={20} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{threat.type}</p>
                  <p className="text-xs text-gray-400">{threat.details?.source_ip}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${THREAT_SEVERITY_COLORS[threat.severity]}`}>
                  {threat.severity}
                </span>
              </div>
            ))}
            {threats.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <Shield className="mx-auto mb-2" size={32} />
                <p>No threats detected</p>
              </div>
            )}
          </div>
        </AnimatedCard>
      </div>

      {/* Detailed Threats List */}
      <AnimatedCard delay={800}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Threat History</h3>
          <button
            onClick={loadThreatsHistory}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4">ID</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Severity</th>
                <th className="text-left py-3 px-4">Source IP</th>
                <th className="text-left py-3 px-4">Protocol</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Time</th>
              </tr>
            </thead>
            <tbody>
              {threats.map((threat) => (
                <tr key={threat.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="py-3 px-4">#{threat.id}</td>
                  <td className="py-3 px-4 font-semibold">{threat.type}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded border ${THREAT_SEVERITY_COLORS[threat.severity]}`}>
                      {threat.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-400">{threat.details?.source_ip}</td>
                  <td className="py-3 px-4 text-sm text-gray-400">{threat.details?.protocol}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-500">
                      {threat.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-400">
                    {getRelativeTime(threat.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {threats.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              <Shield className="mx-auto mb-4" size={48} />
              <p className="text-lg">No threats in history</p>
              <p className="text-sm">Run a security scan to detect potential threats</p>
            </div>
          )}
        </div>
      </AnimatedCard>
    </div>
  );
};

export default HeimdallDashboard;