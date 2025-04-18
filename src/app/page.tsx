'use client'

import { Box, Container, Paper, Typography } from "@mui/material";
import Layout from "./components/layout/AppLayout";
import Search from "./components/search/search";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import RoofMap from "./components/map/map";

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const searchParams = useSearchParams();

  const handleLocationSelected = (location) => {
    console.log('Location selected:', location);
    setSelectedLocation(location);
  };

  useEffect(() => {
    const x = searchParams.get('x');
    const y = searchParams.get('y');
    const q = searchParams.get('q');
    
    if (x && y && q) {
      setSelectedLocation({
        x: parseFloat(x),
        y: parseFloat(y),
        label: q
      });
    }
  }, [searchParams]);

  const locationLabel = selectedLocation?.label || searchParams.get('q');

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box paddingTop={3} paddingBottom={3}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Welcome to Swiss Roof Finder
          </Typography>
          <Typography variant="body1" component="p" align="center" mb={3}>
            Search for an address in Switzerland to view building roofs
          </Typography>
          
          <Box sx={{mb: 3}}>
            <Search onLocationSelected={handleLocationSelected} />
          </Box>

          {locationLabel && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                Showing roofs near: {locationLabel}
              </Typography>
            </Box>
          )}

          <Paper elevation={3} sx={{ p: 2, mb: 3}}>
            <RoofMap selectedLocation={selectedLocation} />
          </Paper>

          <Typography variant="body2" component="p">
            Click on a roof to select it. Click again to deselect.
          </Typography>
        </Box>
      </Container>
    </Layout>
  );
}