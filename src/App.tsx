import React, { useState, useEffect } from 'react';
import RecordingComponent from './components/RecordingComponent';
import TranscriptComponent from './components/TranscriptComponent';
import ApiKeyInput from './components/ApiKeyInput';
import LoadingIndicator from './components/LoadingIndicator';
import PastMinutesViewer from './components/PastMinutesViewer';
import TagInput from './components/TagInput';
import SaveButton from './components/SaveButton';
import TitleInput from './components/TitleInput';
import { transcribeAudio, generateSummary, generateTags, generateTitle, validateApiKey } from './utils/openai';
import { saveMinutes, loadMinutes } from './utils/storage';
import { Minute } from './types';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [summaryLevel, setSummaryLevel] = useState('standard');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [minutes, setMinutes] = useState<Minute[]>([]);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    setMinutes(loadMinutes());
  }, []);

  const handleApiKeySubmit = async (key: string) => {
    setIsLoading(true);
    setLoadingMessage('APIキーを検証中...');
    const isValid = await validateApiKey(key);
    if (isValid) {
      setApiKey(key);
      setIsLoading(false);
      alert('APIキーが正常に設定されました。');
    } else {
      setIsLoading(false);
      alert('無効なAPIキーです。正しいキーを入力してください。');
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!apiKey) {
      alert('APIキーを設定してください。');
      return;
    }

    setIsLoading(true);
    setLoadingMessage('音声を文字起こし中...');

    try {
      const transcriptText = await transcribeAudio(apiKey, file);
      setTranscript(transcriptText);

      setLoadingMessage('要約を生成中...');
      const summaryText = await generateSummary(apiKey, transcriptText, summaryLevel);
      setSummary(summaryText);

      setLoadingMessage('タグを生成中...');
      const generatedTags = await generateTags(apiKey, transcriptText);
      setTags(generatedTags);

      setLoadingMessage('タイトルを生成中...');
      const generatedTitle = await generateTitle(apiKey, summaryText);
      setTitle(generatedTitle);

      setUnsavedChanges(true);
    } catch (error) {
      console.error('Error processing audio:', error);
      alert('音声の処理中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummaryLevelChange = async (level: string) => {
    setSummaryLevel(level);
    if (transcript) {
      setIsLoading(true);
      setLoadingMessage('新しい要約を生成中...');
      try {
        const newSummary = await generateSummary(apiKey, transcript, level);
        setSummary(newSummary);
        setUnsavedChanges(true);
      } catch (error) {
        console.error('Error generating summary:', error);
        alert('要約の生成中にエラーが発生しました。');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGenerateAITitle = async () => {
    if (summary) {
      setIsLoading(true);
      setLoadingMessage('AIタイトルを生成中...');
      try {
        const generatedTitle = await generateTitle(apiKey, summary);
        setTitle(generatedTitle);
        setUnsavedChanges(true);
      } catch (error) {
        console.error('Error generating title:', error);
        alert('タイトルの生成中にエラーが発生しました。');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSave = () => {
    const newMinute: Minute = {
      id: Date.now().toString(),
      title,
      transcript,
      summary,
      date: new Date().toISOString(),
      tags,
    };

    const updatedMinutes = [newMinute, ...minutes];
    setMinutes(updatedMinutes);
    saveMinutes(updatedMinutes);
    setUnsavedChanges(false);
    alert('議事録が保存されました。');
  };

  const handleDeleteMinute = (id: string) => {
    const updatedMinutes = minutes.filter(minute => minute.id !== id);
    setMinutes(updatedMinutes);
    saveMinutes(updatedMinutes);
  };

  return (
    <div className="page-background">
      <div className="container">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">AI議事録</h1>
        <div className="content-card">
          <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />
        </div>
        <div className="content-card">
          <RecordingComponent onFileUpload={handleFileUpload} />
        </div>
        {isLoading ? (
          <div className="content-card">
            <LoadingIndicator message={loadingMessage} />
          </div>
        ) : (
          <>
            <div className="content-card">
              <TitleInput
                title={title}
                onTitleChange={setTitle}
                onGenerateAITitle={handleGenerateAITitle}
              />
            </div>
            <div className="content-card">
              <TranscriptComponent
                transcript={transcript}
                summary={summary}
                summaryLevel={summaryLevel}
                onTranscriptChange={setTranscript}
                onSummaryChange={setSummary}
                onSummaryLevelChange={handleSummaryLevelChange}
              />
            </div>
            <div className="content-card">
              <TagInput
                tags={tags}
                onAddTag={(tag) => setTags([...tags, tag])}
                onRemoveTag={(tag) => setTags(tags.filter((t) => t !== tag))}
              />
            </div>
            <div className="content-card">
              <SaveButton onSave={handleSave} unsavedChanges={unsavedChanges} />
            </div>
          </>
        )}
        <div className="content-card">
          <PastMinutesViewer
            minutes={minutes}
            onSelectMinute={(minute) => {
              setTitle(minute.title);
              setTranscript(minute.transcript);
              setSummary(minute.summary);
              setTags(minute.tags);
            }}
            onDeleteMinute={handleDeleteMinute}
          />
        </div>
      </div>
    </div>
  );
};

export default App;