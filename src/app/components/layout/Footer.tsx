import { Box, Typography } from "@mui/material";

export default function Footer() {
    return (
        <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto'}}>
            <Typography variant="body2" align="center">
            © {new Date().getFullYear()} Swiss Roof Finder by David Gjorgoski
            </Typography>
        </Box>
    )
}