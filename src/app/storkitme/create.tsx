import { StorkitmeForm } from "@/components/storkitme/StorkitmeForm";
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { apiGet, apiPost } from '@/services/api';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function StorkitmeCreate() {

    const { loggedIn,hasIRightRole } = useAuth();
    const router = useRouter();


    const [storkitmegroups , setStorkitmegroup] = useState([]);
    const [usergroups , setUsergroup] = useState([]);

    const [saving, setSaving] = useState(false);

    const loadusergroup = async () =>
    {
      if(loggedIn)
      {
        let url = '/usergroup/GetAll?showAllGroup=false&includeStorkItmes=false&includeUsers=false'
        const usergroupApi = await apiGet(url);
        setUsergroup(usergroupApi);
      }
      else
        setUsergroup([]);
    }

    const loadStorkitmegroup = async () =>
    {
      if(loggedIn)
      {
        let url = '/storkitmegroup/GetAll?showAllGroup=false&includeStorkItmes=false&includeUsers=false'
        const storkitmegroupApi = await apiGet(url);
        setStorkitmegroup(storkitmegroupApi);
      }
      else
        setStorkitmegroup([]);

    }

    useFocusEffect(
      useCallback(() => {

        if (!loggedIn) {

          setStorkitmegroup([]);
          setUsergroup([]);
          return;
        }
        loadusergroup();
        loadStorkitmegroup();

      }, [loggedIn])
    );

    async function makeNewStorkitme(data:any) {
      setSaving(true);

      try {
        if(!loggedIn)
        {
          alert("you ar not login")
          return false;
        }

       

        const res = await apiPost('/storkitme/Create',data)

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
            Create a new storkitme
          </ThemedText>



      <StorkitmeForm
    
        usergroups={usergroups}

        storkitmegroups={storkitmegroups}

        onSubmit={makeNewStorkitme}

        buttonText="Make new StorkItme"

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
    paddingBottom: BottomTabInset + Spacing.three,
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
