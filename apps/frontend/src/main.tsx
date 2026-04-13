import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import koKR from 'antd/locale/ko_KR';
import App from './app/App';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        locale={koKR}
        theme={{
          token: {
            colorPrimary: '#005BAC',
            borderRadius: 6,
            controlHeight: 40,
            fontSize: 14,
          },
          components: {
            Button: { controlHeight: 40 },
            Input: { controlHeight: 40 },
            Select: { controlHeight: 40 },
            DatePicker: { controlHeight: 40 },
            InputNumber: { controlHeight: 40 },
          },
        }}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
