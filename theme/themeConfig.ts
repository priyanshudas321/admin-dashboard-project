import type { ThemeConfig } from 'antd';
import { theme as antTheme } from 'antd';

const theme: ThemeConfig = {
  algorithm: antTheme.darkAlgorithm,
  token: {
    fontSize: 14,
    colorPrimary: '#8b5cf6', // Violet 500
    colorBgBase: '#050505', // Deep Dark Background
    colorBgContainer: '#0a0a0a', // Slightly lighter
    borderRadius: 16, // More rounded like DA
    fontFamily: 'var(--font-geist-sans)',
    colorText: '#ededed',
    colorTextSecondary: '#a1a1aa', // Zinc 400
  },
  components: {
    Button: {
      controlHeight: 44,
      borderRadius: 22,
      primaryShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.4)', // Violet Glow
      defaultBg: 'rgba(255,255,255,0.05)',
      defaultBorderColor: 'rgba(255,255,255,0.1)',
      defaultColor: '#ededed',
    },
    Input: {
      controlHeight: 48,
      colorBgContainer: '#111315',
      colorBorder: '#272B30',
    },
    Card: {
      colorBgContainer: 'transparent', // Let glass class handle it
      colorBorderSecondary: '#272B30',
    },
    Layout: {
        bodyBg: '#111315',
        headerBg: '#1A1D1F',
        siderBg: '#1A1D1F',
    },
    Table: {
        colorBgContainer: '#1A1D1F',
        headerBg: '#111315',
        rowHoverBg: '#272B30',
    }
  },
};

export default theme;
