import React from 'react';
import { Loader } from 'lucide-react';

interface LoadingIndicatorProps {
  message: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader className="animate-spin text-blue-600 mb-4" size={48} />
      <span className="text-lg font-medium text-gray-700">{message}</span>
    </div>
  );
};

export default LoadingIndicator;