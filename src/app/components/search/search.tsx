'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Autocomplete, Box, CircularProgress } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';

const sanitizeHtml = (html) => {
  if (!html) return '';
  return html.replace(/<\/?[^>]+(>|$)/g, "");
};

const Search = ({ onLocationSelected }) => {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const fetchLocations = useCallback(async (searchText) => {
        if (!searchText || searchText.length < 3) {
            setOptions([]);
            return;
        }
        
        setLoading(true);
        try {
            const response = await fetch(
                `https://api3.geo.admin.ch/rest/services/api/SearchServer?type=locations&features=ch.bfs.gebaeude_wohnungs_register&origins=address&searchText=${encodeURIComponent(searchText)}&limit=10&sr=3857`
            );
            
            if (!response.ok) {
                throw new Error('Error fetching locations');
            }
            
            const data = await response.json();
            setOptions(data.results || []);
        } catch (error) {
            console.error('Error fetching locations:', error);
            setOptions([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchLocations(inputValue);
        }, 300);
        
        return () => clearTimeout(timer);
    }, [inputValue, fetchLocations]);

    useEffect(() => {
        const savedQuery = searchParams.get('q');
        if (savedQuery) {
            setInputValue(savedQuery);
            fetchLocations(savedQuery);
        }
    }, [searchParams, fetchLocations]);

    const handleLocationSelect = (event, value) => {
        if (!value?.attrs) return;
        
        const { attrs } = value;
        const cleanLabel = sanitizeHtml(attrs.label || '');
        const { x, y } = attrs;
        
        const params = new URLSearchParams(searchParams);
        params.set('x', x);
        params.set('y', y);
        params.set('q', cleanLabel);
        router.push(`?${params.toString()}`);

        onLocationSelected({
            label: cleanLabel,
            x: parseFloat(x),
            y: parseFloat(y),
        });
    };

    return (
        <Autocomplete
            id="search-autocomplete"
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            onChange={handleLocationSelect}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
            options={options}
            loading={loading}
            getOptionLabel={(option) => sanitizeHtml(option.attrs?.label || '')}
            noOptionsText="Enter at least 3 characters to search"
            filterOptions={(x) => x}
            renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search for a location in Switzerland"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
            )}
            renderOption={(props, option) => (
                <Box component="li" {...props} key={option.id || Math.random().toString(36).substring(7)}>
                    <div dangerouslySetInnerHTML={{ __html: option.attrs?.label || '' }} />
                </Box>
            )}
        />
    );
};

export default Search;