'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import { Style, Fill, Stroke } from 'ol/style';
import { defaults as defaultInteractions } from 'ol/interaction';

const RoofMap = ({ selectedLocation }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const vectorLayerRef = useRef(null);
  const vectorSourceRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [selectedRoofIds, setSelectedRoofIds] = useState(new Set());
  const [roofCount, setRoofCount] = useState(0);
  const urlUpdatedRef = useRef(false);
  const styleRef = useRef();
  const initialViewSetRef = useRef(false);
  const locationProcessedRef = useRef(null);
  // Add this ref to track if we need to extract the URL state
  const initialUrlProcessedRef = useRef(false);
  
  // Update the style function to properly style selected roofs
  styleRef.current = (feature) => {
    const isSelected = selectedRoofIds.has(feature.getId());
    return new Style({
      fill: new Fill({
        color: isSelected ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 0, 255, 0.3)',
      }),
      stroke: new Stroke({
        color: isSelected ? '#ff0000' : '#0000ff',
        width: isSelected ? 3 : 1,
      }),
    });
  };
  
  // Extract selected roofs from URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const selectedRoofsParam = params.get('selectedRoofs');
      if (selectedRoofsParam) {
        const roofIds = selectedRoofsParam.split(',').filter(id => id);
        setSelectedRoofIds(new Set(roofIds));
      }
    }
  }, []);
  
  const handleRoofClick = useCallback((feature) => {
    const featureId = feature.getId();
    
    setSelectedRoofIds(prev => {
      const next = new Set(prev);
      if (next.has(featureId)) {
        next.delete(featureId);
      } else {
        next.add(featureId);
      }
      return next;
    });
    
    urlUpdatedRef.current = true;
  }, []);
  
  // Update URL and refresh vector layer when selected roofs change
  useEffect(() => {
    if (urlUpdatedRef.current && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      
      params.set('selectedRoofs', Array.from(selectedRoofIds).join(','));
      
      const url = new URL(window.location.href);
      url.search = params.toString();
      
      window.history.replaceState({}, '', url.toString());
      urlUpdatedRef.current = false;
    }
    
    if (vectorLayerRef.current) {
      vectorLayerRef.current.changed();
    }
  }, [selectedRoofIds]);

  // Initialize map
  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      const initialCenter = fromLonLat([8.2275, 46.8182]);
      
      const vectorSource = new VectorSource();
      vectorSourceRef.current = vectorSource;
      
      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: (feature) => styleRef.current(feature),
      });
      
      vectorLayerRef.current = vectorLayer;
      
      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayer,
        ],
        view: new View({
          center: initialCenter,
          zoom: 8,
          minZoom: 6,
          maxZoom: 20,
        }),
        interactions: defaultInteractions({
          doubleClickZoom: false,
        }),
      });
      
      map.on('click', (event) => {
        const features = map.getFeaturesAtPixel(event.pixel, {
          layerFilter: (layer) => layer === vectorLayer,
          hitTolerance: 5
        });
        
        if (features && features.length > 0) {
          handleRoofClick(features[0]);
        } else {
          const view = map.getView();
          const extent = view.calculateExtent(map.getSize());
          fetchRoofsInArea(event.coordinate[0], event.coordinate[1], extent, false);
        }
      });
      
      map.on('moveend', () => {
        const view = map.getView();
        const zoom = view.getZoom();
        
        if (zoom >= 15) {
          const center = view.getCenter();
          const extent = view.calculateExtent(map.getSize());
          fetchRoofsInArea(center[0], center[1], extent, false);
        }
      });
      
      mapInstanceRef.current = map;
      
      vectorSource.on('change', () => {
        setRoofCount(vectorSource.getFeatures().length);
        
        // KEY FIX: When source changes, check if we need to process the initial URL state
        if (!initialUrlProcessedRef.current && selectedRoofIds.size > 0) {
          // Re-apply styles after features are loaded
          vectorLayer.changed();
          initialUrlProcessedRef.current = true;
        }
      });
    }
    
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(null);
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle selected location changes
  useEffect(() => {
    if (!selectedLocation || !mapInstanceRef.current) return;
    
    const locationKey = `${selectedLocation.x}-${selectedLocation.y}`;
    if (locationProcessedRef.current === locationKey) return;
    
    const { x, y } = selectedLocation;
    
    mapInstanceRef.current.getView().setCenter([x, y]);
    mapInstanceRef.current.getView().setZoom(18);
    
    const extent = mapInstanceRef.current.getView().calculateExtent(mapInstanceRef.current.getSize());
    
    // Reset the initialUrlProcessedRef when location changes to make sure we process the selected roofs
    initialUrlProcessedRef.current = false;
    fetchRoofsInArea(x, y, extent, true);
    
    locationProcessedRef.current = locationKey;
    initialViewSetRef.current = true;
    
  }, [selectedLocation]);

  const getSamplePointsFromExtent = (extent, gridSize = 3) => {
    const [minX, minY, maxX, maxY] = extent;
    const width = maxX - minX;
    const height = maxY - minY;
    
    const points = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const x = minX + (width * (i + 0.5) / gridSize);
        const y = minY + (height * (j + 0.5) / gridSize);
        points.push([x, y]);
      }
    }
    
    return points;
  };

  const fetchRoofsInArea = async (x, y, extent, clearExisting = false) => {
    if (!vectorSourceRef.current) return;
    
    setLoading(true);
    
    try {
      if (clearExisting && vectorSourceRef.current) {
        vectorSourceRef.current.clear();
        // Reset the flag when clearing so we can process URL selections with new roofs
        initialUrlProcessedRef.current = false;
      }
      
      const samplePoints = extent 
        ? getSamplePointsFromExtent(extent, 5) 
        : [
            [x, y],
            [x + 300, y], [x - 300, y], [x, y + 300], [x, y - 300],
            [x + 300, y + 300], [x - 300, y + 300], [x + 300, y - 300], [x - 300, y - 300],
            [x + 600, y], [x - 600, y], [x, y + 600], [x, y - 600]
          ];
      
      const fetchPromises = samplePoints.map(point => fetchRoofsAtPoint(point[0], point[1]));
      await Promise.all(fetchPromises);
      
      // After all roofs are fetched, make sure styling is applied
      if (vectorLayerRef.current) {
        vectorLayerRef.current.changed();
      }
      
    } catch (error) {
      console.error('Error fetching roof data for area:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoofsAtPoint = async (x, y) => {
    if (!vectorSourceRef.current) return;
    
    try {
      const response = await fetch(
        `https://api3.geo.admin.ch/rest/services/api/MapServer/identify?geometryType=esriGeometryPoint&layers=all:ch.bfe.solarenergie-eignung-daecher&geometry=${x},${y}&mapExtent=${x-400},${y-400},${x+400},${y+400}&imageDisplay=3000,3000,96&tolerance=100&sr=3857`
      );
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        addRoofsToMap(data.results);
      }
    } catch (error) {
      console.error('Error fetching roof data at point:', [x, y], error);
    }
  };

  const addRoofsToMap = (results) => {
    if (!vectorSourceRef.current) return;
    
    let addedCount = 0;
    
    results.forEach(result => {
      if (result.geometry && result.geometry.rings) {
        result.geometry.rings.forEach(ring => {
          if (!ring || ring.length < 3) return;
          
          const existingFeatures = vectorSourceRef.current.getFeatures();
          const featureExists = existingFeatures.some(existingFeature => {
            const geom = existingFeature.getGeometry();
            if (geom && geom.getType() === 'Polygon') {
              const coords = geom.getCoordinates()[0];
              if (coords && coords.length > 0 && ring.length > 0) {
                return coords[0][0] === ring[0][0] && coords[0][1] === ring[0][1];
              }
            }
            return false;
          });
          
          if (!featureExists) {
            try {
              const firstPoint = ring[0];
              const featureId = result.id || 
                `roof-${Math.round(firstPoint[0])}-${Math.round(firstPoint[1])}`;
              
              const feature = new Feature({
                geometry: new Polygon([ring]),
                properties: result.attributes || {}
              });
              
              feature.setId(featureId);
              
              // Check if this feature should be styled as selected based on URL params
              if (selectedRoofIds.has(featureId)) {
                // Ensure the feature gets the selected style
                feature.changed();
              }
              
              vectorSourceRef.current.addFeature(feature);
              addedCount++;
            } catch (e) {
              console.error('Error adding feature:', e);
            }
          }
        });
      }
    });
    
    if (addedCount > 0) {
      console.log(`Added ${addedCount} new roofs`);
      
      // Ensure the layer is refreshed to apply styles after adding features
      if (vectorLayerRef.current) {
        vectorLayerRef.current.changed();
      }
    }
  };

  return (
    <Box position="relative" width="100%" height="500px" sx={{ border: '1px solid #ccc', borderRadius: '4px' }}>
      <Box ref={mapRef} width="100%" height="100%" />
      
      {loading && (
        <Box position="absolute" bottom="10px" right="10px" sx={{ 
          backgroundColor: 'rgba(255,255,255,0.7)', 
          p: 1, 
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <CircularProgress size={20} />
          <Typography variant="caption">Loading roofs...</Typography>
        </Box>
      )}
      
      <Box position="absolute" bottom="10px" left="10px" sx={{ 
        backgroundColor: 'rgba(255,255,255,0.7)', 
        p: 1, 
        borderRadius: 1,
      }}>
        <Typography variant="caption">
          {roofCount} roofs visible | {selectedRoofIds.size} selected
        </Typography>
      </Box>
    </Box>
  );
};

export default RoofMap;