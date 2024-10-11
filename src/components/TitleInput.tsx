import React from 'react';
import { Edit, Wand2 } from 'lucide-react';

interface TitleInputProps {
  title: string;
  onTitleChange: (title: string) => void;
  onGenerateAITitle: () => void;
}

const TitleInput: React.FC<TitleInputProps> = ({ title, onTitleChange, onGenerateAITitle }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">タイトル</h3>
      <div className="flex flex-col sm:flex-row items-start sm:items-center">
        <div className="flex-grow mr-0 sm:mr-2 mb-2 sm:mb-0 w-full sm:w-auto">
          <div className="relative">
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="議事録のタイトルを入力"
              className="input pr-10 w-full"
              maxLength={15}
            />
            <Edit className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
        <button
          onClick={onGenerateAITitle}
          className="btn bg-purple-600 hover:bg-purple-700 text-white flex items-center w-full sm:w-auto"
        >
          <Wand2 className="mr-2" size={18} />
          AIタイトル生成
        </button>
      </div>
    </div>
  );
};

export default TitleInput;