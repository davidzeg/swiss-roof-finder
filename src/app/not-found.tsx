import { Box, Button, Container, Typography, Paper } from '@mui/material';
import Link from 'next/link';

export default function NotFound() {
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
            404 - Page Not Found
          </Typography>
          <Typography variant="body1" paragraph>
            Sorry, the page you are looking for does not exist.
          </Typography>
          <Link href="/" passHref>
            <Button variant="contained" color="primary">
              Return to Home Page
            </Button>
          </Link>
        </Paper>
      </Box>
    </Container>
  );
}