import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createTheme,
  ThemeProvider,
} from '@mui/material/styles';
import {
  red,
} from '@mui/material/colors';
import '~/index.css';
import { App } from '~/App';
import 'aframe';
import '@ar-js-org/ar.js';

const theme = createTheme({
  palette: {
    warning: red,
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider
      theme={theme}
    >
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

