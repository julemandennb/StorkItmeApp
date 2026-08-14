import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { UserForm } from '@/components/user/UserForm';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { apiPost } from '@/services/api';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function UserCreate() {

    const { loggedIn,hasIRightRole,getRoleList } = useAuth();
    const router = useRouter();


    const [saving, setSaving] = useState(false);

    if(!loggedIn || !hasIRightRole("Manager"))
    {
      router.push("/")
    }


    useFocusEffect(
      useCallback(() => {

        if (!loggedIn) {

          return;
        }
      }, [loggedIn])
    );

      async function makeNewUser(data:any) {
          setSaving(true);
    
          try {
            if(!loggedIn)
            {
              alert("you ar not login")
              return false;
            }

            if(data.Password !== data.ConfirmPassword)
            {
              alert("Passwords do not match")
              return false;
            }

            const res = await apiPost('/user/Create', data);

            console.log("res",res)

            router.push("/user/"+res.id)

            return true;
          } 
          catch
          {
    
          }
          finally {
            setSaving(false);
          }
        }


 return (

<ThemedView style={styles.container}>
<SafeAreaView style={styles.safeArea}>
 <ThemedText type="title" style={[styles.title, {marginBottom:Spacing.two}]}>
    Create a new user
  </ThemedText>


<UserForm
  onSubmit={makeNewUser}
  buttonText="Create"
  loading={saving}
/>



</SafeAreaView>
</ThemedView>
  )
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
    paddingTop: Spacing.three,
  },
  title: {
    textAlign: 'center',
  },
  stepContainer: {
    gap: Spacing.two,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});
