import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider } from '@/context/AuthContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="storkitme" options={{ headerShown: false }} />
          <Stack.Screen name="usergroup" options={{ headerShown: false }} />
          <Stack.Screen name="storkitmegroup" options={{ headerShown: false }} />
          <Stack.Screen name="user" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
