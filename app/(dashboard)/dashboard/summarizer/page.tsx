
'use client';

import React, { useState } from 'react';
import { Card, Input, Button, Typography, Space, Spin, Divider, App } from 'antd';
import { YoutubeOutlined, RobotOutlined, CopyOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

export default function SummarizerPage() {
  const { message } = App.useApp();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    if (!url) {
      message.error('Please enter a YouTube URL');
      return;
    }

    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    if (!videoId) {
      message.error('Invalid YouTube URL');
      return;
    }

    setLoading(true);
    setError('');
    setSummary('');

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to generate summary');
      }

      setSummary(data.summary);
      message.success('Summary generated successfully!');
    } catch (err: any) {
      setError(err.message);
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      message.success('Copied to clipboard!');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ color: 'white', marginBottom: 8 }}>
            <RobotOutlined style={{ color: '#8b5cf6', marginRight: 12 }} />
            AI YouTube Summarizer
          </Title>
          <Paragraph style={{ color: '#a1a1aa', fontSize: 16 }}>
            Paste a YouTube link to get structured study notes instantly.
          </Paragraph>
        </div>

        <Card 
          className="glass-card" 
          style={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
            <Text strong style={{ color: '#e4e4e7' }}>YouTube Video URL</Text>
            <Input 
              prefix={<YoutubeOutlined style={{ color: '#ff0000' }} />} 
              placeholder="https://www.youtube.com/watch?v=..." 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              size="large"
              style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #3f3f46', color: 'white' }}
            />

            {/* Video Preview */}
            {(() => {
              const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
              const videoId = videoIdMatch ? videoIdMatch[1] : null;

              if (videoId) {
                return (
                  <div className="animate-fade-up" style={{ width: '100%', aspectRatio: '16/9', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                );
              }
              return null;
            })()}

            <Button 
              type="primary" 
              onClick={handleSummarize} 
              loading={loading}
              size="large"
              block
              style={{ 
                background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)', 
                border: 'none',
                height: 48,
                fontWeight: 600,
                fontSize: 16
              }}
            >
              {loading ? 'Generating Study Notes...' : 'Generate Study Notes'}
            </Button>
          </Space>
        </Card>

        {summary && (
          <Card 
            className="animate-fade-up"
            style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginTop: 24
            }}
            extra={
              <Button 
                type="text" 
                icon={<CopyOutlined />} 
                onClick={copyToClipboard}
                style={{ color: '#a1a1aa' }}
              >
                Copy
              </Button>
            }
            title={<span style={{ color: 'white' }}>Study Notes</span>}
          >
            <div className="markdown-content" style={{ color: '#e4e4e7', lineHeight: 1.6 }}>
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
          </Card>
        )}
      </Space>
    </div>
  );
}
