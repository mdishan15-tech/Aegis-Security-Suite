import React from 'react';
import { Loader } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading...', size = 32 }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader className="animate-spin text-white mb-4" size={size} />
      <p className="text-gray-400 animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingSpinner;