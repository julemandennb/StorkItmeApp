import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider } from '@/context/AuthContext';

export default function UsergroupLayout() {
    const colorScheme = useColorScheme();
    return (
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AnimatedSplashOverlay />
          <Stack>
            {/* <Stack.Screen name="[id]" options={{ headerTitle:"Update usergroup"}} /> */}
        </Stack>
        </ThemeProvider>
      </AuthProvider>
    );
}
