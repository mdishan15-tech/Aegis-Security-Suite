import React, { useState, useEffect } from 'react';
import { Wifi, Shield, AlertTriangle, RefreshCcw, Activity, WifiOff, Lock, Unlock, CheckCircle, XCircle, Monitor, Speaker, Camera, Thermometer } from 'lucide-react';
import { sentryService } from '../services/api';
import { getCurrentUTCTime, getRelativeTime } from '../utils/timeUtils';
import { DEVICE_STATUS_COLORS } from '../config/constants';
import AnimatedCard from '../components/common/AnimatedCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SentryControl = () => {
  const [devices, setDevices] = useState([]);
  const [networkStatus, setNetworkStatus] = useState('secure');
  const [scanning, setScanning] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    secured: 0,
    vulnerable: 0,
    isolated: 0
  });

  useEffect(() => {
    loadDevices();
  }, []);

  useEffect(() => {
    updateStats();
  }, [devices]);

  const loadDevices = async () => {
    try {
      const { data } = await sentryService.getDevices();
      setDevices(data.devices || []);
      
      const vulnerableCount = data.devices.filter(d => d.status !== 'secured').length;
      setNetworkStatus(vulnerableCount === 0 ? 'secure' : vulnerableCount < 3 ? 'warning' : 'critical');
    } catch (error) {
      console.error('Failed to load devices:', error);
    }
  };

  const updateStats = () => {
    setStats({
      total: devices.length,
      secured: devices.filter(d => d.status === 'secured').length,
      vulnerable: devices.filter(d => d.status === 'vulnerable' || d.status === 'at_risk').length,
      isolated: devices.filter(d => d.status === 'isolated').length
    });
  };

  const scanNetwork = async () => {
    try {
      setScanning(true);
      const { data } = await sentryService.scanNetwork();
      await loadDevices();
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setScanning(false);
    }
  };

  const isolateDevice = async (deviceId) => {
    if (!window.confirm('Are you sure you want to isolate this device from the network?')) {
      return;
    }

    try {
      const { data } = await sentryService.isolateDevice(deviceId);
      setDevices(prev =>
        prev.map(device =>
          device.id === deviceId ? data.device : device
        )
      );
    } catch (error) {
      console.error('Failed to isolate device:', error);
    }
  };

  const viewDeviceDetails = async (device) => {
    try {
      const { data } = await sentryService.getDeviceStatus(device.id);
      setSelectedDevice({ ...device, ...data });
    } catch (error) {
      console.error('Failed to get device details:', error);
    }
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'camera': return Camera;
      case 'speaker': return Speaker;
      case 'thermostat': return Thermometer;
      case 'tv': return Monitor;
      case 'lock': return Lock;
      default: return Wifi;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'secured': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'vulnerable': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'at_risk': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'isolated': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-orange-500';
      case 'quarantined': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 mt-16">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <AnimatedCard delay={0}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Devices</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <Wifi className="text-blue-500" size={40} />
          </div>
        </AnimatedCard>

        <AnimatedCard delay={100}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Secured</p>
              <p className="text-3xl font-bold text-green-500">{stats.secured}</p>
            </div>
            <CheckCircle className="text-green-500" size={40} />
          </div>
        </AnimatedCard>

        <AnimatedCard delay={200}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Vulnerable</p>
              <p className="text-3xl font-bold text-yellow-500">{stats.vulnerable}</p>
            </div>
            <AlertTriangle className="text-yellow-500" size={40} />
          </div>
        </AnimatedCard>

        <AnimatedCard delay={300}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Network Status</p>
              <p className={`text-xl font-bold ${
                networkStatus === 'secure' ? 'text-green-500' :
                networkStatus === 'warning' ? 'text-yellow-500' :
                'text-red-500'
              }`}>
                {networkStatus.charAt(0).toUpperCase() + networkStatus.slice(1)}
              </p>
            </div>
            <Shield className={
              networkStatus === 'secure' ? 'text-green-500' :
              networkStatus === 'warning' ? 'text-yellow-500' :
              'text-red-500'
            } size={40} />
          </div>
        </AnimatedCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Network Control */}
        <AnimatedCard delay={400}>
          <div className="flex items-center gap-4 mb-6">
            <Shield className="text-green-500" size={32} />
            <div>
              <h3 className="text-xl font-bold">Network Control</h3>
              <p className="text-gray-400 text-sm">Last scan: {getCurrentUTCTime()}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">Network Security</span>
                <span className={
                  networkStatus === 'secure' ? 'text-green-500' :
                  networkStatus === 'warning' ? 'text-yellow-500' :
                  'text-red-500'
                }>
                  {networkStatus === 'secure' ? 'Protected' : 'At Risk'}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    networkStatus === 'secure' ? 'bg-green-500' :
                    networkStatus === 'warning' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${(stats.secured / stats.total) * 100}%` }}
                />
              </div>
            </div>

            <button
              onClick={scanNetwork}
              disabled={scanning}
              className="w-full px-4 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {scanning ? (
                <>
                  <RefreshCcw className="animate-spin" size={20} />
                  Scanning Network...
                </>
              ) : (
                <>
                  <Activity size={20} />
                  Scan Network
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800 p-3 rounded-lg">
                <p className="text-2xl font-bold text-green-500">{stats.secured}</p>
                <p className="text-xs text-gray-400">Secure Devices</p>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg">
                <p className="text-2xl font-bold text-yellow-500">{stats.vulnerable}</p>
                <p className="text-xs text-gray-400">Need Attention</p>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-semibold text-blue-500 mb-1">Security Tip</p>
                  <p className="text-xs text-gray-400">
                    Regularly scan your network and update device firmware to maintain optimal security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* Connected Devices */}
        <AnimatedCard className="lg:col-span-2" delay={500}>
          <h3 className="text-xl font-bold mb-6">Connected Devices</h3>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {devices.map((device, index) => {
              const DeviceIcon = getDeviceIcon(device.type);
              return (
                <div 
                  key={device.id} 
                  className="bg-gray-800 p-5 rounded-lg hover:bg-gray-700 transition-all cursor-pointer group animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => viewDeviceDetails(device)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-lg ${getStatusColor(device.status)} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <DeviceIcon size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg group-hover:text-green-500 transition-colors">
                          {device.name}
                        </h4>
                        <p className="text-sm text-gray-400">{device.ip}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Last scan: {getRelativeTime(device.last_scan)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(device.status)}`}>
                        {device.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`text-xs font-semibold ${getRiskLevelColor(device.risk_level)}`}>
                        {device.risk_level.toUpperCase()} RISK
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        viewDeviceDetails(device);
                      }}
                      className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-500 rounded hover:bg-blue-500/30 transition-colors text-sm font-semibold"
                    >
                      View Details
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        isolateDevice(device.id);
                      }}
                      disabled={device.status === 'isolated'}
                      className="flex-1 px-4 py-2 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
                    >
                      {device.status === 'isolated' ? 'Isolated' : 'Isolate Device'}
                    </button>
                  </div>

                  {device.status !== 'secured' && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <div className="flex items-center gap-2 text-xs text-yellow-500">
                        <AlertTriangle size={14} />
                        <span>Security vulnerability detected - immediate action recommended</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {devices.length === 0 && (
              <div className="text-center text-gray-400 py-16">
                <WifiOff className="mx-auto mb-4" size={64} />
                <p className="text-xl mb-2">No devices found</p>
                <p className="text-sm">Scan your network to discover IoT devices</p>
              </div>
            )}
          </div>
        </AnimatedCard>
      </div>

      {/* Threat Log */}
      <AnimatedCard delay={600}>
        <h3 className="text-xl font-bold mb-6">Security Event Log</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg animate-fade-in">
            <AlertTriangle className="text-yellow-500 flex-shrink-0 mt-1" size={24} />
            <div className="flex-1">
              <p className="font-semibold">Suspicious activity detected on Smart Speaker</p>
              <p className="text-sm text-gray-400 mt-1">{getCurrentUTCTime()}</p>
              <p className="text-xs text-gray-500 mt-2">
                Unusual network traffic pattern detected. Device attempting to communicate with unknown external server.
              </p>
            </div>
            <button className="px-4 py-2 bg-yellow-500/20 text-yellow-500 rounded hover:bg-yellow-500/30 transition-colors text-sm">
              Investigate
            </button>
          </div>

          <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <XCircle className="text-red-500 flex-shrink-0 mt-1" size={24} />
            <div className="flex-1">
              <p className="font-semibold">Firmware vulnerability found on Smart Thermostat</p>
              <p className="text-sm text-gray-400 mt-1">{getCurrentUTCTime()}</p>
              <p className="text-xs text-gray-500 mt-2">
                Outdated firmware version detected. Update required to patch security vulnerabilities.
              </p>
            </div>
            <button className="px-4 py-2 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30 transition-colors text-sm">
              Update Now
            </button>
          </div>

          <div className="flex items-start gap-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={24} />
            <div className="flex-1">
              <p className="font-semibold">Smart Camera security protocols updated</p>
              <p className="text-sm text-gray-400 mt-1">{getCurrentUTCTime()}</p>
              <p className="text-xs text-gray-500 mt-2">
                Device firmware successfully updated. All security patches applied.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Shield className="text-blue-500 flex-shrink-0 mt-1" size={24} />
            <div className="flex-1">
              <p className="font-semibold">Network scan completed successfully</p>
              <p className="text-sm text-gray-400 mt-1">{getCurrentUTCTime()}</p>
              <p className="text-xs text-gray-500 mt-2">
                {devices.length} devices scanned, {stats.vulnerable} vulnerabilities found.
              </p>
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Device Details Modal */}
      {selectedDevice && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setSelectedDevice(null)}
        >
          <div 
            className="bg-gray-900 rounded-lg p-6 max-w-3xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                {React.createElement(getDeviceIcon(selectedDevice.type), { size: 40, className: DEVICE_STATUS_COLORS[selectedDevice.status] })}
                <div>
                  <h3 className="text-2xl font-bold">{selectedDevice.name}</h3>
                  <p className="text-gray-400">{selectedDevice.type}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDevice(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">IP Address</p>
                <p className="font-mono font-semibold">{selectedDevice.ip}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Status</p>
                <span className={`text-sm px-3 py-1 rounded-full border inline-block ${getStatusColor(selectedDevice.status)}`}>
                  {selectedDevice.status}
                </span>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Risk Level</p>
                <p className={`font-semibold ${getRiskLevelColor(selectedDevice.risk_level)}`}>
                  {selectedDevice.risk_level.toUpperCase()}
                </p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Last Scan</p>
                <p className="font-semibold">{getRelativeTime(selectedDevice.last_scan)}</p>
              </div>
            </div>

            {selectedDevice.security_details && (
              <div className="space-y-4 mb-6">
                <h4 className="font-semibold text-lg">Security Details</h4>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Firmware Version</p>
                      <p className="font-mono text-sm">{selectedDevice.security_details.firmware_version}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Last Updated</p>
                      <p className="text-sm">{getRelativeTime(selectedDevice.security_details.last_updated)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Open Ports</p>
                      <div className="flex gap-2">
                        {selectedDevice.security_details.open_ports.map(port => (
                          <span key={port} className="text-xs px-2 py-1 bg-gray-700 rounded">
                            {port}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Encryption</p>
                      <p className="text-sm">
                        {selectedDevice.security_details.encryption ? (
                          <span className="text-green-500 flex items-center gap-1">
                            <Lock size={14} /> Enabled
                          </span>
                        ) : (
                          <span className="text-red-500 flex items-center gap-1">
                            <Unlock size={14} /> Disabled
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => isolateDevice(selectedDevice.id)}
                disabled={selectedDevice.status === 'isolated'}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {selectedDevice.status === 'isolated' ? 'Device Isolated' : 'Isolate Device'}
              </button>
              <button
                onClick={() => setSelectedDevice(null)}
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentryControl;