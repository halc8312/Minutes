import React, { useState, useMemo } from 'react';
import { Minute } from '../types';
import { FileText, Calendar, X, Trash2 } from 'lucide-react';
import SearchComponent from './SearchComponent';

interface PastMinutesViewerProps {
  minutes: Minute[];
  onSelectMinute: (minute: Minute) => void;
  onDeleteMinute: (id: string) => void;
}

const PastMinutesViewer: React.FC<PastMinutesViewerProps> = ({ minutes, onSelectMinute, onDeleteMinute }) => {
  const [selectedMinute, setSelectedMinute] = useState<Minute | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleSelectMinute = (minute: Minute) => {
    setSelectedMinute(minute);
    onSelectMinute(minute);
  };

  const handleCloseDetails = () => {
    setSelectedMinute(null);
  };

  const handleDeleteMinute = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('この議事録を削除してもよろしいですか？')) {
      onDeleteMinute(id);
      if (selectedMinute && selectedMinute.id === id) {
        setSelectedMinute(null);
      }
    }
  };

  const handleSearch = (term: string, tags: string[]) => {
    setSearchTerm(term);
    setSelectedTags(tags);
  };

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    minutes.forEach(minute => minute.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet);
  }, [minutes]);

  const filteredMinutes = useMemo(() => {
    return minutes.filter(minute => {
      const matchesTerm = searchTerm === '' || 
        minute.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        minute.transcript.toLowerCase().includes(searchTerm.toLowerCase()) ||
        minute.summary.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => minute.tags.includes(tag));

      return matchesTerm && matchesTags;
    });
  }, [minutes, searchTerm, selectedTags]);

  const sortedMinutes = [...filteredMinutes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">過去の議事録</h2>
      <SearchComponent onSearch={handleSearch} allTags={allTags} />
      {sortedMinutes.length === 0 ? (
        <p className="text-gray-600">該当する議事録はありません。</p>
      ) : (
        <div>
          <ul className="space-y-4">
            {sortedMinutes.map((minute) => (
              <li
                key={minute.id}
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out"
                onClick={() => handleSelectMinute(minute)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center mb-2 sm:mb-0">
                    <FileText className="mr-2 text-blue-600 flex-shrink-0" size={18} />
                    <span className="font-bold mr-2 truncate-title">{minute.title}</span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
                    <div className="flex items-center text-gray-500 mr-4">
                      <Calendar className="mr-1" size={14} />
                      <span>{new Date(minute.date).toLocaleDateString()}</span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteMinute(minute.id, e)}
                      className="text-red-500 hover:text-red-700 transition duration-150 ease-in-out"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {selectedMinute && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold truncate">{selectedMinute.title}</h3>
                  <button onClick={handleCloseDetails} className="text-gray-500 hover:text-gray-700">
                    <X size={24} />
                  </button>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">日付:</h4>
                  <p>{new Date(selectedMinute.date).toLocaleString()}</p>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">文字起こし:</h4>
                  <p className="whitespace-pre-wrap">{selectedMinute.transcript}</p>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">要約:</h4>
                  <p>{selectedMinute.summary}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">タグ:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMinute.tags.map((tag) => (
                      <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PastMinutesViewer;