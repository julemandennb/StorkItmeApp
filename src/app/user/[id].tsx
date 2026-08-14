import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { UserForm } from '@/components/user/UserForm';
import { MaxContentWidth, Spacing } from '@/constants/theme';
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

    const [user , setUser] = useState(null);

    const [storkitmegroups , setStorkitmegroup] = useState([]);
    const [usergroups , setUsergroup] = useState([]);

    const [saving, setSaving] = useState(false);

    const loadusergroup = async () =>
    {
      if(loggedIn)
      {
        let url = '/usergroup/GetAll?showAllGroup=true&includeStorkItmes=false&includeUsers=false'
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
        let url = '/storkitmegroup/GetAll?showAllGroup=true&includeStorkItmes=false&includeUsers=false'
        const storkitmegroupApi = await apiGet(url);
        setStorkitmegroup(storkitmegroupApi);
      }
      else
        setStorkitmegroup([]);

    }

    const loadUser = async () =>
    {
        if(loggedIn)
        {
            let url = '/user/Get?uuid='+id
            const userApi = await apiGet(url);

            const formData = {
              Email:userApi.email,
              UserName:userApi.userName,
              Role:userApi.role?.displayName,
              UserGroups:userApi.userGroups,
              StorkItmeGroups:userApi.storkItmeGroups,
            }

            setUser(formData);
        }
        else
           setUser(null);
    }

    useFocusEffect(
      useCallback(() => {

        if (!loggedIn) {
          setStorkitmegroup([]);
          setUsergroup([]);
          setUser(null);
          return;
        }
        
        loadusergroup();
        loadStorkitmegroup();
        loadUser();

      }, [loggedIn, id])
    );

    async function updateUser(data:any) {
      setSaving(true);

      try {
        if(!loggedIn)
        {
          alert("you ar not login")
          return false;
        }

        let url = "/user/update?uuid="+id
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

      let url = "/user/Delete?id="+id
      const res = await apiDelete(url)

      router.push(`/`);
       


      return true;
    }

    async function RemoveStorkitmegroup(uuid:string)
    {
       try
      {
        setSaving(true);  

        const body = {
          StorkItmeGroupId: uuid,
          UserId : [id]
        };

        await apiDelete('/storkitmegroup/RemoveUser', body)
      }
      catch
      {}
      finally {
        setSaving(false);
      }

    }

    async function AddStorkitmegroup(uuid:any) {
      setSaving(true);

      try
      {
        if(!loggedIn)
        {
          return false;
        }

      const body = {
        StorkItmeGroupId: uuid,
        UserId : [id]
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

    async function AddUsergroup(usergroup:any) {
      setSaving(true);

      try
      {
        if(!loggedIn)
        {
          return false;
        }

      const body = {
        userGroupId: usergroup,
        UserId : id
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

    async function RemoveUser(usergroup:any) {
      try
      {
        setSaving(true);  

        const body = {
          userGroupId: usergroup,
          UserId : id
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


 return (

<ThemedView style={styles.container}>
<SafeAreaView style={styles.safeArea}>
    <ThemedText type="title" style={[styles.title, {marginBottom:Spacing.two}]}>
        update a user
        </ThemedText>

<UserForm
  initialValues={user}
  onSubmit={updateUser}
  onDelete={onDelete}
  userGroups={usergroups}
  storkItmeGroups={storkitmegroups}
  thisIsToUpdate
  onRemoveStorkItmeGroup={RemoveStorkitmegroup}
  onAddStorkItmeGroup={AddStorkitmegroup}
  onAddUserGroup={AddUsergroup}
  onRemoveUserGroup={RemoveUser}
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
