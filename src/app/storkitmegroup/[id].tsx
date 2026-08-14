import { StorkitmegroupForm } from '@/components/storkitmegroup/StorkitmegroupForm';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { apiDelete, apiGet, apiPut } from '@/services/api';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function StorkitmegroupCreate() {

    const { loggedIn,hasIRightRole } = useAuth();
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [saving, setSaving] = useState(false);

    const [storkitmegroup, setStorkitmegroup] = useState(null);
    const [storkitmes , setStorkitmes] = useState([]);
    const [users , setUsers] = useState([]);

    const loadstorkitmegroup = async () =>
    {
      if(loggedIn)
        {
            let url = '/storkitmegroup/Get?uuid='+id
            const storkitmegroupApi = await apiGet(url);

            const formData = {
                name: storkitmegroupApi.name ?? '',
                description: storkitmegroupApi.description ?? '',
                users: storkitmegroupApi.users ?? [],
                storkItmes: storkitmegroupApi.storkItmes ?? [],
            };

            setStorkitmegroup(formData)

            loadStorkItmes();
            loadUser();

        }
        else
        {
            setStorkitmegroup(null)
        }
    }

    const loadStorkItmes = async () =>
    {
      if(loggedIn)
        {
            let url = '/storkitme/GetAll'
            const storkItmesApi = await apiGet(url);
            setStorkitmes(storkItmesApi);
        }
    }

    const loadUser = async () =>
    {
      if(loggedIn && hasIRightRole('Manager'))
      {
        let url = '/user/GetAll'
        const usersApi = await apiGet(url);
        setUsers(usersApi);

      }
    }
  




    useFocusEffect(
      useCallback(() => {

        if (!loggedIn) {
            setStorkitmegroup(null)
            setStorkitmes([])
            setUsers([])
            return;
        }

        loadstorkitmegroup();
       
        

      }, [loggedIn, id])
    );

    async function makeUpdateStorkitmegroup(data:any) {
      setSaving(true);

      try {
        if(!loggedIn)
        {
          alert("you ar not login")
          return false;
        }

        const res = await apiPut('/storkitmegroup/Updata?id=' + id, data)

        return true;
      } 
      catch
      {

      }
      finally {
        setSaving(false);
      }
    }

    async function RemoveUser(idUser:any) {
      try
      {
        setSaving(true);  

        const body = {
          StorkItmeGroupId: id,
          UserId : [idUser]
        };

        await apiDelete('/storkitmegroup/RemoveUser', body)
      }
      catch
      {}
      finally {
        setSaving(false);
      }

    }

    async function RemoveStorkItme(uuid:any) {
      setSaving(true);

      try
      {
        if(!loggedIn)
        {
          return false;
        }
      const body = {
       StorkItmeGroupId: ""
      };

      const res = await apiPut('/storkitme/' + uuid, body)
    }catch
    {

    }
    finally {
      setSaving(false);
    }
    }

    async function AddUser(idUser:any) {
      setSaving(true);

      try
      {
        if(!loggedIn)
        {
          return false;
        }

      const body = {
        StorkItmeGroupId: id,
        UserId : [idUser]
      };

      const res = await apiPut('/storkitmegroup/AddUser', body)
      }
      catch
      {
      }
      finally {
        setSaving(false);
      }
    }

    async function AddStorkItme(uuid:any)  {
      setSaving(true);

      try
      {
        if(!loggedIn)
        {
          return false;
        }
      const body = {
       StorkItmeGroupId: id
      };

      const res = await apiPut('/storkitme/' + uuid, body)
    }catch
    {

    }
    finally {
      setSaving(false);
    }
    }

    async function deleteStorkitmegroup() {
      setSaving(true);

      try
      {
        if(!loggedIn)
        {
          return false;
        }

        const res = await apiDelete('/storkitmegroup/Delete?uuid=' + id)

        router.push(`/userGroups`);

      }
      catch{}
      finally {
        setSaving(false);
      }
    }


 return (

<ThemedView style={styles.container}>
<SafeAreaView style={styles.safeArea}>
 <ThemedText type="title" style={[styles.title, {marginBottom:Spacing.two}]}>
            Update storkitmegroup
          </ThemedText>

        <StorkitmegroupForm
            initialValues={storkitmegroup}
            onSubmit={makeUpdateStorkitmegroup}
            buttonText="Update storkitmegroup"
            thisIsToUpdate={true}
            onRemoveUser={RemoveUser}
            onRemoveStorkItme={RemoveStorkItme}
            storkItmesList={storkitmes}
            usersList={users}
            onAddUser={AddUser}
            onAddStorkItme={AddStorkItme}
            onDelete={deleteStorkitmegroup}
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
