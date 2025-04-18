import { AppBar, Box, CssBaseline, Toolbar, Typography } from "@mui/material";
import Head from "next/head";
import Footer from "./Footer";

export default function Layout({children}) {
    return (
        <>
            <Head>
                <title>Swiss Roof Finder</title>
                <meta name="description" content="Search for the best roof in Switzerland" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <CssBaseline />
            <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh"}}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Swiss Roof Finder
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box component="main" sx={{flexGrow: 1 }}>
                    {children}
                </Box>
                <Footer />
            </Box>
        </>
    )
}