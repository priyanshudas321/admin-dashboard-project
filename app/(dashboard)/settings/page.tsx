'use client';

import React from 'react';
import { Card, Form, Input, Button, Switch, Divider, Typography, Space, App } from 'antd';
import { SaveOutlined, UserOutlined, LockOutlined, BellOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function SettingsPage() {
    const { message } = App.useApp();
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log('Success:', values);
        message.success('Settings saved successfully');
    };

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }} className="animate-fade-up">
            <Space orientation="vertical" size="large" style={{ width: '100%' }}>
                <Card variant="borderless" title={<Title level={4} style={{ color: 'white', margin: 0 }}>Profile Settings</Title>}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            username: 'Admin User',
                            email: 'admin@gatekeeper.com',
                            notifications: true,
                            theme: true
                        }}
                    >
                        <Form.Item label="Username" name="username">
                            <Input prefix={<UserOutlined />} />
                        </Form.Item>
                        <Form.Item label="Email" name="email">
                            <Input prefix={<UserOutlined />} disabled />
                        </Form.Item>
                        
                        <Divider style={{ borderColor: '#272B30' }} />
                        
                        <Title level={5} style={{ color: 'white' }}>Security</Title>
                        <Form.Item label="New Password" name="password">
                            <Input.Password prefix={<LockOutlined />} placeholder="Leave empty to keep current" />
                        </Form.Item>

                        <Divider style={{ borderColor: '#272B30' }} />

                        <Title level={5} style={{ color: 'white' }}>Preferences</Title>
                        <Form.Item label="Email Notifications" name="notifications" valuePropName="checked">
                            <Switch checkedChildren={<BellOutlined />} unCheckedChildren={<BellOutlined />} />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large" className="animate-glow">
                                Save Changes
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Space>
        </div>
    );
}
