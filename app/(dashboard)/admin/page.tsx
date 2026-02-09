'use client';

import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Card, Typography, App, Space, Row, Col, Statistic } from 'antd';
import { ReloadOutlined, ArrowUpOutlined, ArrowDownOutlined, CheckCircleOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';

const { Title, Text } = Typography;

interface User {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

// Mock Data for Charts
const dataGrowth = [
  { name: 'Mon', users: 4 },
  { name: 'Tue', users: 7 },
  { name: 'Wed', users: 5 },
  { name: 'Thu', users: 12 },
  { name: 'Fri', users: 8 },
  { name: 'Sat', users: 16 },
  { name: 'Sun', users: 24 },
];

const COLORS = ['#6C5DD3', '#FF754C', '#FFCD1A'];

export default function AdminDashboard() {
  const router = useRouter();
  const { message } = App.useApp();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.status === 401 || res.status === 403) {
        router.push('/login');
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
      message.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Derived Statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'approved').length;
  const pendingUsers = users.filter(u => u.status === 'pending').length;

  const statusData = [
      { name: 'Active', value: activeUsers },
      { name: 'Pending', value: pendingUsers },
  ];

  return (
    <div style={{ minHeight: '100vh' }}>
      <Row gutter={[24, 24]}>
        {/* Stats Cards */}
        <Col xs={24} sm={8}>
          <Card className="glass-card animate-fade-up delay-100" variant="borderless">
            <Statistic 
                title={<Text type="secondary">Total Users</Text>} 
                value={totalUsers} 
                prefix={<UserOutlined style={{ color: '#6C5DD3' }} />}
                styles={{ content: { color: 'white', fontWeight: 700 } }}
            />
            <div style={{ marginTop: 8 }}>
                 <Text style={{ color: '#75FF75', fontSize: 12 }}><ArrowUpOutlined /> 12% </Text>
                 <Text type="secondary" style={{ fontSize: 12 }}> vs last month</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="glass-card animate-fade-up delay-200" variant="borderless">
             <Statistic 
                title={<Text type="secondary">Active Users</Text>} 
                value={activeUsers} 
                prefix={<CheckCircleOutlined style={{ color: '#75FF75' }} />}
                styles={{ content: { color: 'white', fontWeight: 700 } }}
            />
             <div style={{ marginTop: 8 }}>
                 <Text style={{ color: '#75FF75', fontSize: 12 }}><ArrowUpOutlined /> 5% </Text>
                 <Text type="secondary" style={{ fontSize: 12 }}> vs last month</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="glass-card animate-fade-up delay-300" variant="borderless">
            <Statistic 
                title={<Text type="secondary">Pending Approval</Text>} 
                value={pendingUsers} 
                prefix={<ClockCircleOutlined style={{ color: '#FF754C' }} />}
                styles={{ content: { color: 'white', fontWeight: 700 } }}
            />
            <div style={{ marginTop: 8 }}>
                 <Text style={{ color: '#FF754C', fontSize: 12 }}><ArrowDownOutlined /> 2% </Text>
                 <Text type="secondary" style={{ fontSize: 12 }}> vs last month</Text>
            </div>
          </Card>
        </Col>

        {/* Charts Section */}
        <Col xs={24} lg={16} className="animate-fade-up delay-400">
            <Card variant="borderless" className="glass-card" title={<Title level={4} style={{ color: 'white', margin: 0 }}>User Growth</Title>}>
                <div style={{ height: 300, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dataGrowth}>
                            <defs>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6C5DD3" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#6C5DD3" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#272B30" vertical={false} />
                            <XAxis dataKey="name" stroke="#808191" axisLine={false} tickLine={false} />
                            <YAxis stroke="#808191" axisLine={false} tickLine={false} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1A1D1F', border: '1px solid #272B30', borderRadius: 8 }}
                                itemStyle={{ color: 'white' }}
                            />
                            <Area type="monotone" dataKey="users" stroke="#6C5DD3" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </Col>
        <Col xs={24} lg={8} className="animate-fade-up delay-500">
             <Card variant="borderless" className="glass-card" title={<Title level={4} style={{ color: 'white', margin: 0 }}>User Status</Title>}>
                <div style={{ height: 300, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statusData}
                                innerRadius={80}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#75FF75' : '#FF754C'} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1A1D1F', border: '1px solid #272B30', borderRadius: 8 }}
                                itemStyle={{ color: 'white' }}
                            />
                            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                                <tspan x="50%" dy="-1em" fontSize="14" fill="#808191">Total</tspan>
                                <tspan x="50%" dy="1.5em" fontSize="24" fontWeight="bold" fill="white">{totalUsers}</tspan>
                            </text>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                 <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: -20 }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                         <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#75FF75' }} />
                         <Text style={{ color: '#808191' }}>Active</Text>
                     </div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                         <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF754C' }} />
                         <Text style={{ color: '#808191' }}>Pending</Text>
                     </div>
                 </div>
            </Card>
        </Col>

      </Row>
    </div>
  );
}
