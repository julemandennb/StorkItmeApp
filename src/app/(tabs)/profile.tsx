import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/use-theme';
import { GetApiUrl, apiPut } from '@/services/api';
import { router } from "expo-router";
import { useState } from 'react';
import { Button, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';




export default function HomeScreen() {
    const theme = useTheme();
        const { logoutAlert  } = useAuth();


    const { name, email, phoneNumber, userGroups, StorkItmeGroups,checkUser } = useAuth();

    const apiUrl = GetApiUrl();
     
    const [newEmail, setEmail] = useState(email);
    const [newName, setName] = useState(name);
    const [newPhoneNumber, setNewPhoneNumber] = useState(phoneNumber);
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const newPasswordConfirmIsOk = (newPasswordConfirm === '' &&  newPassword === '') || newPassword === newPasswordConfirm;
    const [missOldPassword, setMissOldPassword] = useState(false);

    async function UpdateProfile() {

        if(!newPasswordConfirmIsOk)
            return alert('New password and confirmation do not match.');
        if(oldPassword === '')
        {
            setMissOldPassword(true);
            return alert('Please enter your old password');
        }
        setMissOldPassword(false);

        const profileData: {
            UserName: string;
            Email: string;
            PhoneNumber: string;
            Password?: string;
            NewPassword?: string;
        } = {
            UserName: newName,
            Email: newEmail,
            PhoneNumber: newPhoneNumber,
            Password : oldPassword
        };

        if (newPassword !== '') {
            profileData.NewPassword = newPassword;
        }

        const result = await apiPut('/info', profileData);

        if (result) {
            alert('Profile updated successfully!');
            checkUser();
        }
    }

  
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView>
          <ThemedText type="title" style={[styles.title, {marginBottom:Spacing.two}]}>
            User is logged in on {apiUrl}
          </ThemedText>

          <Button
              title="Logout"
              color={theme['red']}
              onPress={() => {
                logoutAlert();
              }}
          />


          <ThemedView type="backgroundElement" style={[styles.stepContainer, {marginTop:Spacing.four}]}>
          
              <ThemedText type="default">Email</ThemedText>
              <TextInput
                  style={[styles.input, { color: theme['text'] }]}   
                  value={newEmail}
                  onChangeText={setEmail}
              />

              <ThemedText type="default">Name</ThemedText>
              <TextInput
                  style={[styles.input, { color: theme['text'] }]}   
                  value={newName}
                  onChangeText={setName}
              />

              <ThemedText type="default">Phone Number</ThemedText>
              <TextInput
                  style={[styles.input, { color: theme['text'] }]}   
                  value={newPhoneNumber}
                  onChangeText={setNewPhoneNumber}
              />

              <ThemedText type="default">New Password</ThemedText>
              <TextInput
                  style={[styles.input, { color: theme['text'] }, { backgroundColor: newPasswordConfirmIsOk ? theme['backgroundElement'] : theme['red'] }]}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={true}
              />

              <ThemedText type="default">Confirm New Password</ThemedText>
              <TextInput
                  style={[styles.input, { color: theme['text'], backgroundColor: newPasswordConfirmIsOk ?  theme['backgroundElement'] : theme['red'] }]}
                  value={newPasswordConfirm}
                  onChangeText={setNewPasswordConfirm}
                  secureTextEntry={true}
              />

              <ThemedText type="default">Password</ThemedText>
              <TextInput
                  style={[styles.input, { color: theme['text'] }, { backgroundColor: missOldPassword ? theme['red'] : theme['backgroundElement'] }]}
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  secureTextEntry={true}
              />


              <View style={styles.buttonUpdate}>
                  <Button title="Update Profile" onPress={UpdateProfile} />
              </View>
              
          </ThemedView>

          <ThemedView type="backgroundElement" style={[styles.stepContainer, {marginTop:Spacing.four} ]}>

            
              <ThemedView type="backgroundElement">
                <ThemedText type="default" style={[{textAlign: 'center'}]}>userGroups</ThemedText>

                <View
                  style={{
                    flexDirection: "row",
                    padding: 10,
                    borderBottomWidth: 2,
                    gap:10
                  }}
                >
                  <ThemedText style={{ flex: 1, fontWeight: "bold",textAlign: 'center' }}>Name</ThemedText>
                  <ThemedText style={{ flex: 1, fontWeight: "bold",textAlign: 'center' }}>color</ThemedText>
                </View>


                {/* Table Rows */}
                  {userGroups.map((item) => (
                    <Pressable
                      key={item.uuid}
                      onPress={() => router.push(`/usergroup/${item.uuid}`)}
                      style={{
                        flexDirection: "row",
                        padding: 10,
                        borderBottomWidth: 1,
                        gap: 10,
                      }}
                    >
                      <ThemedText style={{ flex: 1, textAlign: 'center' }}>
                        {item.name}
                      </ThemedText>

                      <ThemedText style={{ flex: 1, textAlign: 'center', color:item.color }}>
                        {item.color}
                      </ThemedText>
                    </Pressable>
                  ))}


              </ThemedView>
          

            
              <ThemedView type="backgroundElement" style={[{marginTop:Spacing.four} ]}>
                <ThemedText type="default" style={[{textAlign: 'center'}]}>StorkItmeGroups</ThemedText>

                <View
                  style={{
                    flexDirection: "row",
                    padding: 10,
                    borderBottomWidth: 2,
                    gap:10
                  }}
                >
                  <ThemedText style={{ flex: 1, fontWeight: "bold",textAlign: 'center' }}>Name</ThemedText>
                  <ThemedText style={{ flex: 1, fontWeight: "bold",textAlign: 'center' }}>description</ThemedText>
                </View>


                {/* Table Rows */}
                  {StorkItmeGroups.map((item) => (
                    <Pressable
                      key={item.uuid}
                      onPress={() => router.push(`/storkitmegroup/${item.uuid}`)}
                      style={{
                        flexDirection: "row",
                        padding: 10,
                        borderBottomWidth: 1,
                        gap: 10,
                      }}
                    >
                      <ThemedText style={{ flex: 1, textAlign: 'center' }}>
                        {item.name}
                      </ThemedText>

                      <ThemedText style={{ flex: 1, textAlign: 'center' }}>
                        {item.description}
                      </ThemedText>
                    </Pressable>
                  ))}


              </ThemedView>

          </ThemedView>

        </ScrollView>
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
    gap: Spacing.two,
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
  buttonUpdate: {
    marginTop: Spacing.four,
    borderRadius: 5,
  },
});
