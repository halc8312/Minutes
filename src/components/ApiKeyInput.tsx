import React, { useState } from 'react';
import { Key } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeySubmit: (apiKey: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApiKeySubmit(apiKey);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row items-center">
        <div className="relative flex-grow mb-2 sm:mb-0 sm:mr-2">
          <div className="flex items-center">
            <Key className="text-gray-400 mr-2" size={18} />
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="OpenAI APIキーを入力"
              className="input w-full"
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-full sm:w-auto">
          APIキーを設定
        </button>
      </div>
      <p className="text-sm text-gray-600 mt-2">
        APIキーは <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenAIのウェブサイト</a> から取得できます。
      </p>
    </form>
  );
};

export default ApiKeyInput;