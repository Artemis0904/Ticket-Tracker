import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.0d19bfa939ef4509adfd598fb5208bf4',
  appName: 'ticket-tide-track',
  webDir: 'dist',
  server: {
    url: 'https://0d19bfa9-39ef-4509-adfd-598fb5208bf4.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;