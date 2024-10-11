import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

interface RecordingComponentProps {
  onFileUpload: (file: File) => void;
}

const RecordingComponent: React.FC<RecordingComponentProps> = ({
  onFileUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validFormats = [
        'audio/flac',
        'audio/x-m4a',
        'audio/mp3',
        'audio/mp4',
        'audio/mpeg',
        'audio/mpga',
        'audio/oga',
        'audio/ogg',
        'audio/wav',
        'audio/webm'
      ];
      if (validFormats.includes(file.type)) {
        onFileUpload(file);
      } else {
        alert('サポートされていないファイル形式です。サポートされている形式: flac, m4a, mp3, mp4, mpeg, mpga, oga, ogg, wav, webm');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="audio/flac,audio/x-m4a,audio/mp3,audio/mp4,audio/mpeg,audio/mpga,audio/oga,audio/ogg,audio/wav,audio/webm"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="btn btn-primary flex items-center"
      >
        <Upload className="mr-2" size={18} />
        音声ファイルをアップロード
      </button>
      <p className="text-sm text-gray-600 mt-2">
        サポートされている形式: flac, m4a, mp3, mp4, mpeg, mpga, oga, ogg, wav, webm
      </p>
    </div>
  );
};

export default RecordingComponent;