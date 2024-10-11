import React from 'react';
import { Save } from 'lucide-react';

interface SaveButtonProps {
  onSave: () => void;
  unsavedChanges: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onSave, unsavedChanges }) => {
  return (
    <div className="flex items-center">
      <button
        onClick={onSave}
        className={`btn flex items-center ${
          unsavedChanges
            ? 'btn-primary'
            : 'btn-secondary cursor-not-allowed'
        }`}
        disabled={!unsavedChanges}
      >
        <Save className="mr-2" size={18} />
        保存
      </button>
      {unsavedChanges && (
        <span className="ml-2 text-red-500">*保存されていない変更があります</span>
      )}
    </div>
  );
};

export default SaveButton;