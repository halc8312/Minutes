import React, { useState } from 'react';
import { Tag, Plus } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

const TagInput: React.FC<TagInputProps> = ({ tags, onAddTag, onRemoveTag }) => {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onAddTag(newTag.trim());
      setNewTag('');
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">タグ</h3>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center"
          >
            <Tag size={14} className="mr-1" />
            {tag}
            <button
              onClick={() => onRemoveTag(tag)}
              className="ml-1 text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="新しいタグを追加"
          className="input rounded-r-none"
        />
        <button
          onClick={handleAddTag}
          className="btn btn-primary rounded-l-none"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
};

export default TagInput;