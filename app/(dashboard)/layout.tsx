'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Typography, Space, Spin, Dropdown } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  RocketOutlined,
  ProfileOutlined
} from '@ant-design/icons';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
           // If unauthorized, redirect to login
           router.push('/login');
        }
      } catch (error) {
        console.error('Failed to fetch user', error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [router]);

  const menuItems = [
    {
      key: '/admin', // Admin sees /admin, User sees /dashboard
      icon: <DashboardOutlined />,
      label: <Link href={user?.role === 'admin' ? '/admin' : '/dashboard'}>Dashboard</Link>, 
      className: `animate-fade-up delay-100 ${pathname === '/admin' || pathname === '/dashboard' ? 'glass-card' : ''}`,
      style: { margin: '4px 0', borderRadius: 8 }
    },
    {
      key: '/dashboard/summarizer',
      icon: <RocketOutlined />,
      label: <Link href="/dashboard/summarizer">AI Summarizer</Link>,
      className: `animate-fade-up delay-150 ${pathname === '/dashboard/summarizer' ? 'glass-card' : ''}`,
      style: { margin: '4px 0', borderRadius: 8 }
    },
    ...(user?.role === 'admin' ? [
        {
            key: '/admin/users',
            icon: <UserOutlined />,
            label: <Link href="/admin/users">Users</Link>,
            className: `animate-fade-up delay-200 ${pathname === '/admin/users' ? 'glass-card' : ''}`,
            style: { margin: '4px 0', borderRadius: 8 }
        },
        {
          key: '/settings',
          icon: <SettingOutlined />,
          label: <Link href="/settings">Settings</Link>,
          className: `animate-fade-up delay-300 ${pathname === '/settings' ? 'glass-card' : ''}`,
          style: { margin: '4px 0', borderRadius: 8 }
        }
    ] : [])
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
      // Navigation is handled by Link component for SEO and prefetching
      if (key && !key.startsWith('/')) return; // Avoid navigation for non-links
      // router.push(key); // Not needed with Link
  };

  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=0; path=/;';
    router.push('/login');
  };

  const userMenu = {
      items: [
          {
              key: 'logout',
              label: 'Logout',
              icon: <LogoutOutlined />,
              onClick: handleLogout
          }
      ]
  };

  if (loading) {
      return (
          <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#111315' }}>
              <Space orientation="vertical" align="center">
                  <Spin size="large" />
                  <div style={{ color: '#6C5DD3', marginTop: 16, fontWeight: 500 }}>Loading Gatekeeper...</div>
              </Space>
          </div>
      )
  }

  return (
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        width={250}
        style={{ 
            background: 'transparent', 
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            position: 'fixed',
            height: '100vh',
            left: 0,
            zIndex: 100
        }}
      >
        <div style={{ 
            height: 80, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: collapsed ? 'center' : 'flex-start', 
            padding: collapsed ? 0 : '0 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
            <RocketOutlined style={{ fontSize: 24, color: '#8b5cf6' }} />
            {!collapsed && (
                <Title level={4} style={{ margin: '0 0 0 12px', color: 'white', fontWeight: 700, fontFamily: 'var(--font-outfit)' }}>
                    Gatekeeper
                </Title>
            )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          style={{ background: 'transparent', borderRight: 0, marginTop: 24 }}
          items={menuItems}
          onClick={handleMenuClick}
        />
        <div style={{ position: 'absolute', bottom: 24, width: '100%', padding: '0 24px' }}>
            {!collapsed ? (
                <Button 
                    type="text" 
                    icon={<LogoutOutlined />} 
                    onClick={handleLogout}
                    style={{ color: '#a1a1aa', width: '100%', textAlign: 'left', paddingLeft: 0 }}
                >
                    Logout
                </Button>
            ) : (
                <Button 
                    type="text" 
                    icon={<LogoutOutlined />} 
                    onClick={handleLogout}
                    style={{ color: '#a1a1aa', width: '100%', display: 'flex', justifyContent: 'center' }}
                />
            )}
        </div>
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: 'all 0.2s', background: 'transparent' }}>
        <Header style={{ 
            padding: '0 24px', 
            background: 'rgba(5, 5, 5, 0.5)', /* Slight backdrop for readability */
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 99,
            width: '100%'
        }}>
          <Space>
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                fontSize: '16px',
                width: 64,
                height: 64,
                color: 'white'
                }}
            />
            <Title level={4} style={{ margin: 0, color: 'white', fontFamily: 'var(--font-outfit)' }}>
                {pathname === '/admin' ? 'Dashboard' : pathname.split('/').pop()?.charAt(0).toUpperCase()! + pathname.split('/').pop()?.slice(1)!}
            </Title>
          </Space>
          <Space size="large">
            <div style={{ textAlign: 'right', lineHeight: '1.2' }}>
                <Text strong style={{ color: 'white', display: 'block' }}>{user?.name || 'User'}</Text>
                <Text type="secondary" style={{ fontSize: 12, color: '#a1a1aa' }}>{user?.email}</Text>
            </div>
            <Dropdown menu={userMenu} placement="bottomRight">
                <Avatar size="large" icon={<UserOutlined />} style={{ backgroundColor: '#8b5cf6', cursor: 'pointer' }} />
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            padding: 24,
            minHeight: 280,
            background: 'transparent',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
