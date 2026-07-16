import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/use-theme';
import { login } from '@/services/auth';
import { router } from "expo-router";
import { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';




export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
    const [url, setUrl] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loginSuccess,loggedIn, logout  } = useAuth();

    const handleLogin = async () => {
      if (isLoading) return; 
      setIsLoading(true);
      try {
        await login(url, email, password);
        await loginSuccess(); 
        alert('Logged in');

         router.replace("/");
      } catch (error: any) {
        alert('Error: ' + error.message);
        console.error('Login error:', error);
      }
      finally {
        setIsLoading(false);
      }
    };

    const theme = useTheme();
    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
            

            {!loggedIn ? (
<>
                <ThemedText type="title">Login</ThemedText>

                <ThemedView type="backgroundElement" style={styles.stepContainer}>


                    <ThemedText type="default">URL</ThemedText>
                    <TextInput
                        style={[styles.input, { color: theme['text'] }]}   
                        value={url}
                        onChangeText={setUrl}
                    />

                    <ThemedText type="default">Email</ThemedText>
                    <TextInput
                        style={[styles.input, { color: theme['text'] }]}   
                        value={email}
                        onChangeText={setEmail}
                    />

                    <ThemedText type="default">Password</ThemedText>
                    <TextInput
                        style={[styles.input, { color: theme['text'] }]}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                    />

                   <View style={styles.buttonContainer}>
                        <Button
                             title={isLoading ? "Logging in..." : "Login"}
                            disabled={!url || !email || !password || isLoading}
                            onPress={() => {
                              handleLogin();
                            }}
                        />
                    </View>


                </ThemedView>
                </>
            ) : (
                <ThemedView type="backgroundElement" style={styles.stepContainer}>

                  <Button
                            title="Logout"
                            onPress={() => {
                              logout();
                            }}
                        />

                </ThemedView>

                
            )}
            </SafeAreaView>
        </ThemedView>
    );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
    paddingTop: Spacing.six,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
  },
  buttonContainer: {
    alignItems: 'flex-end',
  },
});