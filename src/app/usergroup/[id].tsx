import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { UsergroupForm } from '@/components/usergroup/UsergroupForm';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { apiGet, apiPut } from '@/services/api';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function UsergroupCreate() {

    const { loggedIn,hasIRightRole } = useAuth();
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [saving, setSaving] = useState(false);

    const [usergroup, setUsergroup] = useState(null);

    const loadusergroup = async () =>
    {
      if(loggedIn)
        {
            let url = '/usergroup/Get?uuid='+id
            const usergroupApi = await apiGet(url);

            const formData = {
                name: usergroupApi.name ?? '',
                color: usergroupApi.color ?? '',
                users: usergroupApi.users ?? [],
                storkItmes: usergroupApi.storkItmes ?? [],
            };

            console.log("formData",formData)

            setUsergroup(formData)

        }
        else
        {
            setUsergroup(null)
        }
    }

    const [storkitme , setStorkitme] = useState([]);




    useFocusEffect(
      useCallback(() => {

        if (!loggedIn) {
            setUsergroup(null)
            return;
        }

        loadusergroup();
        

      }, [loggedIn, id])
    );

    async function makeUpdateUsergroup(data:any) {
      setSaving(true);

      try {
        if(!loggedIn)
        {
          alert("you ar not login")
          return false;
        }

        const res = await apiPut('/usergroup/Update',data)

        console.log("res",res)

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
            Update usergroup
          </ThemedText>

        <UsergroupForm
            initialValues={usergroup}
            onSubmit={makeUpdateUsergroup}
            buttonText="Update usergroup"
            thisIsToUpdate={true}
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
