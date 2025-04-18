'use client';

import { useEffect } from 'react';
import { Box, Button, Container, Typography, Paper } from '@mui/material';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Unhandled error:', error);
  }, [error]);

  return (
    <Container maxWidth="md">
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="70vh"
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mt: 4, 
            width: '100%', 
            maxWidth: 600, 
            textAlign: 'center' 
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Something went wrong!
          </Typography>
          <Typography variant="body1" paragraph>
            We apologize for the inconvenience. There was an error processing your request.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => reset()}
            sx={{ mr: 2 }}
          >
            Try again
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={() => window.location.href = '/'}
          >
            Go to Home Page
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}