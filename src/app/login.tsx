import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const theme = useTheme();
    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
            
                <ThemedText type="title">Login</ThemedText>

                <ThemedView type="backgroundElement" style={styles.stepContainer}>

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
                            title="Login"
                            disabled={!email || !password}
                            onPress={() => {
                            console.log('login');
                            }}
                        />
                    </View>


                </ThemedView>
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