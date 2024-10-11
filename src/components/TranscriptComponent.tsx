import React from 'react';
import { FileText } from 'lucide-react';

interface TranscriptComponentProps {
  transcript: string;
  summary: string;
  summaryLevel: string;
  onTranscriptChange: (transcript: string) => void;
  onSummaryChange: (summary: string) => void;
  onSummaryLevelChange: (level: string) => void;
}

const TranscriptComponent: React.FC<TranscriptComponentProps> = ({
  transcript,
  summary,
  summaryLevel,
  onTranscriptChange,
  onSummaryChange,
  onSummaryLevelChange,
}) => {
  const handleSummaryLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSummaryLevelChange(event.target.value);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <FileText className="mr-2" size={24} />
          文字起こしと要約
        </h2>
        <select
          value={summaryLevel}
          onChange={handleSummaryLevelChange}
          className="input w-auto"
        >
          <option value="brief">簡潔な要約</option>
          <option value="standard">標準的な要約</option>
          <option value="detailed">詳細な要約</option>
          <option value="comprehensive">包括的な要約</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="transcript" className="label">文字起こし:</label>
        <textarea
          id="transcript"
          value={transcript}
          onChange={(e) => onTranscriptChange(e.target.value)}
          className="input h-40"
        />
      </div>
      <div>
        <label htmlFor="summary" className="label">要約:</label>
        <textarea
          id="summary"
          value={summary}
          onChange={(e) => onSummaryChange(e.target.value)}
          className="input h-40"
        />
      </div>
    </div>
  );
};

export default TranscriptComponent;