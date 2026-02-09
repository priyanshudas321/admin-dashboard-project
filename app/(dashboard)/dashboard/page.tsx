'use client';

import React from 'react';
import { Card, Typography, Button, Row, Col, Statistic, theme, Avatar } from 'antd';
import { 
    LogoutOutlined, 
    SmileOutlined, 
    FireOutlined, 
    SafetyCertificateOutlined,
    EditOutlined,
    KeyOutlined,
    CustomerServiceOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Paragraph, Text } = Typography;

export default function UserDashboard() {
  const router = useRouter();
  const { token } = theme.useToken();
  const [user, setUser] = React.useState<{ name: string; email: string; status: string } | null>(null);

  React.useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    }
    fetchUser();
  }, []);

  return (
    <div style={{ padding: 0, minHeight: '80vh', position: 'relative', zIndex: 10 }}>
      {/* Editorial Hero Section */}
      <div className="animate-fade-up" style={{ marginBottom: 60, marginTop: 20 }}>
        <Title level={5} style={{ color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: 16 }}>
            Dashboard Overview
        </Title>
        <div style={{ fontSize: 'clamp(3rem, 5vw, 6rem)', lineHeight: 1.1, fontWeight: 800, color: 'white', letterSpacing: '-0.02em', fontFamily: 'var(--font-outfit)' }}>
           WELCOME BACK,<br />
           <span className="animate-liquid" style={{ 
               background: 'linear-gradient(to right, #fff, #a78bfa, #fbbf24)', 
               backgroundSize: '200% auto',
               backgroundClip: 'text',
               WebkitBackgroundClip: 'text',
               color: 'transparent'
           }}>
             {user?.name?.toUpperCase() || 'USER'}
           </span>
        </div>
        <Paragraph style={{ color: '#a1a1aa', fontSize: 18, maxWidth: 600, marginTop: 24, lineHeight: 1.6 }}>
            Your command center is ready. Track your performance, manage security, and explore new possibilities with Gatekeeper.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
          {/* Stats Section */}
          <Col xs={24} md={8}>
             <Card className="glass-card animate-fade-up delay-100 h-full" variant="borderless" style={{ height: '100%', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <SafetyCertificateOutlined style={{ fontSize: 24, color: '#8b5cf6' }} />
                    </div>
                </div>
                <Statistic 
                    title={<span style={{ color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px', fontSize: 12 }}>Account Status</span>}
                    value={user?.status?.toUpperCase() || 'LOADING...'}
                    styles={{ content: { color: user?.status === 'approved' ? '#4ade80' : '#fbbf24', fontWeight: 700, fontSize: 28, marginTop: 8 } }}
                />
                <Text type="secondary" style={{ marginTop: 12, display: 'block', fontSize: 13 }}>System operational.</Text>
             </Card>
          </Col>
          <Col xs={24} md={8}>
             <Card className="glass-card animate-fade-up delay-200 h-full" variant="borderless" style={{ height: '100%', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                     <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(251, 191, 36, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <FireOutlined style={{ fontSize: 24, color: '#fbbf24' }} />
                    </div>
                </div>
                <Statistic 
                    title={<span style={{ color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px', fontSize: 12 }}>Days Active</span>}
                    value={1}
                    styles={{ content: { color: 'white', fontWeight: 700, fontSize: 28, marginTop: 8 } }}
                />
                 <Text type="secondary" style={{ marginTop: 12, display: 'block', fontSize: 13 }}>Streak maintenance: Perfect.</Text>
             </Card>
          </Col>
          <Col xs={24} md={8}>
             <Card className="glass-card animate-fade-up delay-300 h-full" variant="borderless" style={{ height: '100%', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                     <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <SmileOutlined style={{ fontSize: 24, color: 'white' }} />
                    </div>
                </div>
                <Statistic 
                    title={<span style={{ color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px', fontSize: 12 }}>Tasks Completed</span>}
                    value={0}
                    styles={{ content: { color: 'white', fontWeight: 700, fontSize: 28, marginTop: 8 } }}
                />
                 <Text type="secondary" style={{ marginTop: 12, display: 'block', fontSize: 13 }}>Ready for initiation.</Text>
             </Card>
          </Col>

          {/* Activity Feed */}
          <Col xs={24} lg={16}>
            <Card className="glass-card animate-fade-up delay-300" variant="borderless" title={<span style={{ color: 'white', fontSize: 20, fontFamily: 'var(--font-outfit)' }}>Recent Signals</span>}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                        <div style={{ 
                            width: 12, height: 12, borderRadius: '50%', 
                            background: '#8b5cf6', boxShadow: '0 0 10px #8b5cf6',
                            marginTop: 6
                        }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ color: 'white', display: 'block', fontWeight: 600, fontSize: 16 }}>Secure Login Detected</Text>
                                <Text type="secondary" style={{ fontSize: 12, fontFamily: 'monospace' }}>JUST NOW</Text>
                            </div>
                            <Text style={{ color: '#a1a1aa', marginTop: 4, display: 'block' }}>Verified credentials access via standard protocol.</Text>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                        <div style={{ 
                            width: 12, height: 12, borderRadius: '50%', 
                            background: '#fbbf24', boxShadow: '0 0 10px #fbbf24',
                            marginTop: 6
                        }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ color: 'white', display: 'block', fontWeight: 600, fontSize: 16 }}>Identity Established</Text>
                                <Text type="secondary" style={{ fontSize: 12, fontFamily: 'monospace' }}>{new Date().toLocaleDateString().toUpperCase()}</Text>
                            </div>
                            <Text style={{ color: '#a1a1aa', marginTop: 4, display: 'block' }}>New account creation sequence completed successfully.</Text>
                        </div>
                    </div>
                </div>
            </Card>
          </Col>

          {/* Quick Actions */}
          <Col xs={24} lg={8}>
             <Card className="glass-card animate-fade-up delay-400" variant="borderless" title={<span style={{ color: 'white', fontSize: 20, fontFamily: 'var(--font-outfit)' }}>Quick Protocols</span>}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <Button block size="large" icon={<EditOutlined />} className="group" style={{ justifyContent: 'space-between', borderRadius: 12, height: 60, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <span>Edit Profile</span>
                        <ArrowRightOutlined className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button block size="large" icon={<KeyOutlined />} className="group" style={{ justifyContent: 'space-between', borderRadius: 12, height: 60, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <span>Change Keys</span>
                        <ArrowRightOutlined className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                     <Button block size="large" icon={<CustomerServiceOutlined />} className="group" style={{ justifyContent: 'space-between', borderRadius: 12, height: 60, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <span>Support Uplink</span>
                        <ArrowRightOutlined className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
             </Card>
          </Col>
      </Row>
    </div>
  );
}
