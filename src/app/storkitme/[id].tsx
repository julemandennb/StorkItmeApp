import { StorkitmeForm } from "@/components/storkitme/StorkitmeForm";
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/use-theme';
import { apiDelete, apiGet, apiPut } from '@/services/api';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function StorkitmeCreate() {

    const { loggedIn,hasIRightRole } = useAuth();
    const router = useRouter();
    


    const theme = useTheme();

    const { id } = useLocalSearchParams();

    const [storkitme , setStorkitme] = useState(null);

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

    const loadstorkitme = async () =>
    {
        if(loggedIn)
        {
            let url = '/storkitme/Get?uuid='+id
            const storkitmeApi = await apiGet(url);

            const formData = {
                name: storkitmeApi.name ?? '',
                description: storkitmeApi.description ?? '',
                type: storkitmeApi.type ?? '',
                bestBy: storkitmeApi.bestBy ?? '',
                stork: storkitmeApi.stork ?? 0,
                storeLocation: storkitmeApi.storeLocation ?? '',
                itemNumber: storkitmeApi.itemNumber ?? '',
                ean: storkitmeApi.ean ?? '',

                userGroupId: storkitmeApi.userGroup?.uuid ?? '',
                storkItmeGroupId: storkitmeApi.storkItmeGroup?.uuid ?? '',
            };

            setStorkitme(formData);
        }
        else
           setStorkitme(null);
    }

    useFocusEffect(
      useCallback(() => {

        if (!loggedIn) {
          setStorkitmegroup([]);
          setUsergroup([]);
          setStorkitme(null);
          return;
        }
        
        loadusergroup();
        loadStorkitmegroup();
        loadstorkitme();

      }, [loggedIn, id])
    );

    async function updateStorkitme(data:any) {
      setSaving(true);

      try {
        if(!loggedIn)
        {
          alert("you ar not login")
          return false;
        }

        let url = "/storkitme/"+id
        const res = await apiPut(url,data)
       

        return false;
      } 
      catch
      {

      }
      finally {
        setSaving(false);
      }
    }

    async function onDelete()
    {

      let url = "/storkitme/Delete?uuid="+id
      const res = await apiDelete(url)

      router.push(`/`);
       


      return true;
    }


 return (

<ThemedView style={styles.container}>
<SafeAreaView style={styles.safeArea}>
    <ThemedText type="title" style={[styles.title, {marginBottom:Spacing.two}]}>
        update a storkitme
        </ThemedText>



    <StorkitmeForm
        thisIsToUpdate
        initialValues={storkitme}
        usergroups={usergroups}
        storkitmegroups={storkitmegroups}
        onSubmit={updateStorkitme}
        onDelete={onDelete}
        buttonText="Update StorkItme"
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
