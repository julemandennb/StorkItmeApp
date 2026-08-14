import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { UsergroupForm } from '@/components/usergroup/UsergroupForm';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { apiDelete, apiGet, apiPut } from '@/services/api';
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
    const [storkitmes , setStorkitmes] = useState([]);
    const [users , setUsers] = useState([]);

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

            setUsergroup(formData)

            loadStorkItmes();
            loadUser();

        }
        else
        {
            setUsergroup(null)
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
            setUsergroup(null)
            setStorkitmes([])
            setUsers([])
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

        const res = await apiPut('/usergroup/Updata?id=' + id, data)

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
          userGroupId: id,
          UserId : idUser
        };

        apiDelete('/usergroup/RemoveUser', body)

      }
      catch
      {}
      finally
      {
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
       userGroupId: ""
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
        userGroupId: id,
        UserId : idUser
      };

      const res = await apiPut('/usergroup/AddUser', body)
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
       userGroupId: id
      };

      const res = await apiPut('/storkitme/' + uuid, body)
    }catch
    {

    }
    finally {
      setSaving(false);
    }
    }

    async function deleteUsergroup() {
      setSaving(true);

      try
      {
        if(!loggedIn)
        {
          return false;
        }

        const res = await apiDelete('/usergroup/Delete?uuid=' + id)

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
            Update usergroup
          </ThemedText>

        <UsergroupForm
            initialValues={usergroup}
            onSubmit={makeUpdateUsergroup}
            buttonText="Update usergroup"
            thisIsToUpdate={true}
            onRemoveUser={RemoveUser}
            onRemoveStorkItme={RemoveStorkItme}
            storkItmesList={storkitmes}
            usersList={users}
            onAddUser={AddUser}
            onAddStorkItme={AddStorkItme}
            onDelete={deleteUsergroup}
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
