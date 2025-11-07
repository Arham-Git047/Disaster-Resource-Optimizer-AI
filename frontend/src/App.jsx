import React from 'react';
import { Container, AppBar, Toolbar, Typography, Box, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { AppProvider } from './context/appContext';
import StatusIndicator from './components/statusIndicators';
import NeedsList from './components/needslist';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    success: { main: '#2e7d32' },
    warning: { main: '#ed6c02' },
    error: { main: '#d32f2f' },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <Box sx={{ flexGrow: 1 }}>
          {/* Header */}
          <AppBar position="static">
            <Toolbar>
              <LocalHospitalIcon sx={{ mr: 2 }} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Disaster Response - Volunteer Dashboard
              </Typography>
            </Toolbar>
          </AppBar>

          {/* Main Content */}
          <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <StatusIndicator />
            <NeedsList />
          </Container>

          {/* Footer */}
          <Box
            component="footer"
            sx={{
              py: 3,
              px: 2,
              mt: 'auto',
              backgroundColor: 'grey.100',
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Disaster Response Resource Optimization Platform
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Built for emergency response teams
            </Typography>
          </Box>
        </Box>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
