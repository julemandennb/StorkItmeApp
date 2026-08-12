import { StorkitmegroupForm } from '@/components/storkitmegroup/StorkitmegroupForm';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { apiPost } from '@/services/api';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function StorkitmegroupCreate() {

    const { loggedIn,hasIRightRole } = useAuth();
    const router = useRouter();


    const [saving, setSaving] = useState(false);



    useFocusEffect(
      useCallback(() => {

      }, [loggedIn])
    );

    async function makeNewStorkitmegroup(data:any) {
      setSaving(true);

      try {
        if(!loggedIn)
        {
          alert("you ar not login")
          return false;
        }

        const res = await apiPost('/storkitmegroup/Create',data)

        router.push('/storkitmegroup/'+res.uuid)

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
            Create a new storkitmegroup
          </ThemedText>

        <StorkitmegroupForm
            onSubmit={makeNewStorkitmegroup}
            buttonText="Make new storkitmegroup"
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
    paddingTop: Spacing.six,
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
