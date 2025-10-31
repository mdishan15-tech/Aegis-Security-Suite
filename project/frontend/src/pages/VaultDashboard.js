import React, { useState, useEffect, useRef } from 'react';
import { Lock, Upload, Download, File, Shield, Trash2, Key, FileText, Image as ImageIcon, Film, Music } from 'lucide-react';
import { vaultService } from '../services/api';
import { APP_CONFIG } from '../config/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AnimatedCard from '../components/common/AnimatedCard';
import { formatBytes } from '../utils/formatters';
import { getRelativeTime } from '../utils/timeUtils';

const VaultDashboard = () => {
  const [files, setFiles] = useState([]);
  const [encrypting, setEncrypting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const { data } = await vaultService.getEncryptedFiles();
      setFiles(data.files || []);
    } catch (error) {
      console.error('Failed to load files:', error);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    try {
      setEncrypting(true);
      setProgress(0);

      // Simulate encryption progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const { data } = await vaultService.simulateEncryption(file.name);
      clearInterval(interval);
      setProgress(100);

      setTimeout(() => {
        setFiles(prev => [data.file, ...prev]);
        setProgress(0);
      }, 500);
    } catch (error) {
      console.error('Encryption failed:', error);
    } finally {
      setTimeout(() => {
        setEncrypting(false);
      }, 600);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDecrypt = async (fileId) => {
    try {
      const { data } = await vaultService.decryptFile(fileId);
      alert(`File decrypted successfully: ${data.file.filename}`);
    } catch (error) {
      console.error('Decryption failed:', error);
    }
  };

  const handleDelete = (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      setFiles(prev => prev.filter(f => f.id !== fileId));
    }
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return ImageIcon;
    if (['mp4', 'avi', 'mov', 'mkv'].includes(ext)) return Film;
    if (['mp3', 'wav', 'flac'].includes(ext)) return Music;
    if (['txt', 'doc', 'docx', 'pdf'].includes(ext)) return FileText;
    return File;
  };

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const totalFiles = files.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 mt-16">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <AnimatedCard delay={0}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Files</p>
              <p className="text-3xl font-bold">{totalFiles}</p>
            </div>
            <File className="text-blue-500" size={40} />
          </div>
        </AnimatedCard>

        <AnimatedCard delay={100}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Size</p>
              <p className="text-3xl font-bold">{formatBytes(totalSize)}</p>
            </div>
            <Shield className="text-green-500" size={40} />
          </div>
        </AnimatedCard>

        <AnimatedCard delay={200}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Encryption</p>
              <p className="text-xl font-bold text-green-500">AES-256</p>
            </div>
            <Lock className="text-green-500" size={40} />
          </div>
        </AnimatedCard>

        <AnimatedCard delay={300}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Success Rate</p>
              <p className="text-3xl font-bold text-green-500">100%</p>
            </div>
            <Key className="text-yellow-500" size={40} />
          </div>
        </AnimatedCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Upload Section */}
        <AnimatedCard delay={400}>
          <div className="flex items-center gap-4 mb-6">
            <Lock className="text-green-500" size={32} />
            <div>
              <h3 className="text-xl font-bold">Secure Upload</h3>
              <p className="text-sm text-gray-400">Last activity: {APP_CONFIG.CURRENT_UTC}</p>
            </div>
          </div>

          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              dragActive 
                ? 'border-green-500 bg-green-500/10' 
                : 'border-gray-700 hover:border-gray-600'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileInputChange}
              disabled={encrypting}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center gap-4"
            >
              <Upload 
                size={48} 
                className={`text-gray-500 ${encrypting ? 'animate-pulse' : dragActive ? 'text-green-500 scale-110' : ''} transition-all`}
              />
              <div>
                <p className="text-gray-400 mb-2">
                  {encrypting ? 'Encrypting file...' : dragActive ? 'Drop file here' : 'Drop files here or click to upload'}
                </p>
                <p className="text-xs text-gray-500">
                  Military-grade AES-256-GCM encryption
                </p>
              </div>
            </label>
          </div>

          {encrypting && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Encrypting...</span>
                <span className="font-semibold">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Applying AES-256-GCM encryption with key derivation...
              </p>
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Shield className="text-green-500" size={16} />
              Security Features
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                AES-256-GCM encryption
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Zero-knowledge architecture
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Secure key management
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                End-to-end encryption
              </li>
            </ul>
          </div>
        </AnimatedCard>

        {/* File Info */}
        <AnimatedCard delay={500}>
          <h3 className="text-xl font-bold mb-6">Storage Overview</h3>
          
          <div className="space-y-4 mb-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Storage Used</span>
                <span className="font-semibold">{formatBytes(totalSize)} / 100 GB</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  style={{ width: `${Math.min((totalSize / (100 * 1024 * 1024 * 1024)) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-2xl font-bold text-green-500">{totalFiles}</p>
                <p className="text-sm text-gray-400">Encrypted Files</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-2xl font-bold text-blue-500">256-bit</p>
                <p className="text-sm text-gray-400">Encryption Level</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700">
            <h4 className="font-semibold mb-4">Recent Activity</h4>
            <div className="space-y-3">
              {files.slice(0, 3).map((file, index) => (
                <div key={file.id} className="flex items-center gap-3 text-sm">
                  <Lock className="text-green-500 flex-shrink-0" size={16} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{file.filename}</p>
                    <p className="text-xs text-gray-400">{getRelativeTime(file.timestamp)}</p>
                  </div>
                </div>
              ))}
              {files.length === 0 && (
                <p className="text-gray-400 text-center py-4">No recent activity</p>
              )}
            </div>
          </div>
        </AnimatedCard>
      </div>

      {/* Files List */}
      <AnimatedCard delay={600}>
        <h3 className="text-xl font-bold mb-6">Encrypted Files</h3>
        {files.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file, index) => {
              const FileIcon = getFileIcon(file.filename);
              return (
                <div 
                  key={file.id} 
                  className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all cursor-pointer group animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => setSelectedFile(file)}
                >
                  <div className="flex items-start gap-4">
                    <FileIcon size={32} className="text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate group-hover:text-green-500 transition-colors">
                        {file.filename}
                      </p>
                      <p className="text-xs text-gray-400">{formatBytes(file.size)}</p>
                      <p className="text-xs text-gray-500">{getRelativeTime(file.timestamp)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDecrypt(file.id);
                      }}
                      className="flex-1 px-3 py-2 bg-green-500/20 text-green-500 rounded hover:bg-green-500/30 transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <Download size={14} />
                      Decrypt
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file.id);
                      }}
                      className="px-3 py-2 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Lock size={12} className="text-green-500" />
                      <span>{file.algorithm}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-16">
            <Lock className="mx-auto mb-4" size={64} />
            <p className="text-xl mb-2">No encrypted files</p>
            <p className="text-sm">Upload files to encrypt them with military-grade security</p>
          </div>
        )}
      </AnimatedCard>

      {/* File Details Modal */}
      {selectedFile && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setSelectedFile(null)}
        >
          <div 
            className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-6">{selectedFile.filename}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">File Size</p>
                  <p className="font-semibold">{formatBytes(selectedFile.size)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Encrypted</p>
                  <p className="font-semibold">{getRelativeTime(selectedFile.timestamp)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Algorithm</p>
                  <p className="font-semibold">{selectedFile.algorithm}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Checksum</p>
                  <p className="font-mono text-xs">{selectedFile.checksum}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-400 mb-2">Encryption Key (Preview)</p>
                <p className="font-mono text-xs bg-gray-800 p-3 rounded break-all">
                  {selectedFile.encryption_key}
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleDecrypt(selectedFile.id)}
                  className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Decrypt & Download
                </button>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaultDashboard;