import React, { useState } from 'react';
import { Search, Tag } from 'lucide-react';

interface SearchComponentProps {
  onSearch: (term: string, selectedTags: string[]) => void;
  allTags: string[];
}

const SearchComponent: React.FC<SearchComponentProps> = ({ onSearch, allTags }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(searchTerm, selectedTags);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);
    onSearch(newTerm, selectedTags);
  };

  const handleTagToggle = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newSelectedTags);
    onSearch(searchTerm, newSelectedTags);
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleSearch} className="flex items-center mb-2">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="議事録を検索..."
          className="flex-grow border rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Search size={18} />
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => handleTagToggle(tag)}
            className={`flex items-center px-2 py-1 rounded-full text-sm ${
              selectedTags.includes(tag)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Tag size={14} className="mr-1" />
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchComponent;