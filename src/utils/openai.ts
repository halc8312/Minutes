import axios, { AxiosError } from 'axios';

function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      console.error('API response error:', axiosError.response.data);
      throw new Error(`API エラー: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`);
    } else if (axiosError.request) {
      console.error('No response received:', axiosError.request);
      throw new Error('APIからの応答がありません。ネットワーク接続を確認してください。');
    } else {
      console.error('Error setting up request:', axiosError.message);
      throw new Error(`リクエスト設定エラー: ${axiosError.message}`);
    }
  } else {
    console.error('Unexpected error:', error);
    throw new Error(`予期せぬエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function validateApiKey(apiKey: string): Promise<boolean> {
  const apiUrl = 'https://api.openai.com/v1/models';
  try {
    await axios.get(apiUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    return true;
  } catch (error) {
    console.error('API key validation error:', error);
    return false;
  }
}

export async function transcribeAudio(apiKey: string, audioFile: File): Promise<string> {
  const apiUrl = 'https://api.openai.com/v1/audio/transcriptions';
  const formData = new FormData();
  formData.append('file', audioFile);
  formData.append('model', 'whisper-1');
  formData.append('language', 'ja');

  try {
    const response = await axios.post(apiUrl, formData, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.text;
  } catch (error) {
    handleApiError(error);
  }
}

export async function generateSummary(apiKey: string, transcript: string, level: string): Promise<string> {
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  const maxTokens = {
    brief: 100,
    standard: 200,
    detailed: 400,
    comprehensive: 800,
  }[level] || 200;

  const prompt = `以下の議事録を${level}に要約してください:\n\n${transcript}`;

  try {
    const response = await axios.post(
      apiUrl,
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 15000,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    handleApiError(error);
  }
}

export async function generateTags(apiKey: string, transcript: string): Promise<string[]> {
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  const prompt = `以下の議事録から重要なキーワードを5つ抽出し、タグとして提案してください。タグはカンマ区切りのリストで返してください:\n\n${transcript}`;

  try {
    const response = await axios.post(
      apiUrl,
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 50,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const tags = response.data.choices[0].message.content.split(',').map((tag: string) => tag.trim());
    return tags;
  } catch (error) {
    handleApiError(error);
  }
}

export async function generateTitle(apiKey: string, summary: string): Promise<string> {
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  const prompt = `以下の要約に基づいて、適切な議事録のタイトルを生成してください。なお、文字数は15文字以下でお願いします。また、出力内容に私への返事などは書かず、タイトルのみを出力してください:\n\n${summary}`;

  try {
    const response = await axios.post(
      apiUrl,
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 50,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.choices[0].message.content.trim().slice(0, 15);
  } catch (error) {
    handleApiError(error);
  }
}