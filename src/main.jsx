import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/index.css';
import { Provider } from 'react-redux';
import { store } from '@/state/store.js';
import AuthProvider from '@/components/AuthProvider.jsx';
import App from '@/containers/app/App.jsx';
import { CssBaseline } from '@mui/material';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <CssBaseline />
        <App />
      </AuthProvider>
    </Provider>
  </StrictMode>,
)
 