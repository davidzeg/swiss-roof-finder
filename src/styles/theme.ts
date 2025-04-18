'use client'

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3E3F5B',
      light: '#5E5F7B',     
      dark: '#2E2F4B',
      contrastText: '#F6F1DE',  
    },
    secondary: {
      main: '#8AB2A6',  
      light: '#A0C2B6',     
      dark: '#6A9286',      
      contrastText: '#3E3F5B',  
    },
    background: {
      default: '#F6F1DE',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#3E3F5B',
      secondary: '#5E5F7B', 
      disabled: 'rgba(62, 63, 91, 0.38)', 
    },
    success: {
      main: '#ACD3A8',
      light: '#C2E3BE',     
      dark: '#8CB388',      
      contrastText: '#3E3F5B', 
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          background: '#F6F1DE',
          backgroundAttachment: 'fixed',
          minHeight: '100vh', 
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #8AB2A6 0%, #3E3F5B 100%)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        containedPrimary: {
          backgroundColor: '#3E3F5B',
          '&:hover': {
            backgroundColor: '#2E2F4B',
          },
        },
        containedSecondary: {
          backgroundColor: '#8AB2A6',
          '&:hover': {
            backgroundColor: '#6A9286',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
      color: '#3E3F5B',
    },
    h2: {
      fontWeight: 500,
      color: '#3E3F5B',
    },
    h3: {
      fontWeight: 500,
      color: '#3E3F5B',
    },
    h4: {
      fontWeight: 500,
      color: '#3E3F5B',
    },
    h5: {
      fontWeight: 500,
      color: '#3E3F5B',
    },
    h6: {
      fontWeight: 500,
      color: '#3E3F5B',
    },
    body1: {
      color: '#3E3F5B',
    },
    body2: {
      color: '#5E5F7B',
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;