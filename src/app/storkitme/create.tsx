import { DatePickerField } from '@/components/date-picker-field';
import { PickerInputLabel } from '@/components/picker-input-label';
import { TextInputWithLabel } from '@/components/text-input-with-label';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/use-theme';
import { apiGet, apiPost } from '@/services/api';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Button, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function StorkitmeCreate() {

    const { loggedIn } = useAuth();
    const theme = useTheme();


    const [storkitmegroups , setStorkitmegroup] = useState([]);
    const [usergroups , setUsergroup] = useState([]);

    const [saving, setSaving] = useState(false);

    //to make a new storkitme
    const [name,setName]= useState('');
    const [description,setDescription]= useState('');
    const [type,setType]= useState('');
    const [bestBy, setBestBy] = useState(new Date().toISOString().split("T")[0]);
    const [stork,setStork]= useState(0); // this is a number
    const [storeLocation,setStoreLocation]= useState('');
    const [itemNumber,setItemNumber]= useState('');
    const [ean,setEan]= useState('');
    const [userGroupId,setUserGroupId]= useState(''); //this is a uuid from usergroups
    const [storkItmeGroupId,setStorkItmeGroupId]= useState(''); //this is a uuid from storkitmegroups

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

    function nullSet(){
      setName('');
      setDescription('');
      setType('');
      setBestBy(new Date().toISOString().split("T")[0]);
      setStork(0);
      setStoreLocation('');
      setItemNumber('');
      setEan('');
      setUserGroupId(''); 
      setStorkItmeGroupId('');

    }

    async function makeNewStorkitme() {
      setSaving(true);

      try {
        if(!loggedIn)
        {
          alert("you ar not login")
          return
        }

        if(name.length === 0)
          {
          alert("this has to hav a name")
          return
        }

        
        const newStorkItme = {
          name,
          description,
          type,
          bestBy,
          stork: stork,
          storeLocation,
          itemNumber,
          ean,
          userGroupId,
          storkItmeGroupId,
        };

        const res = await apiPost('/storkitme/Create',newStorkItme)

        nullSet();
 
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
        <ScrollView>
          <ThemedText type="title" style={[styles.title, {marginBottom:Spacing.two}]}>
            Create a new storkitme
          </ThemedText>

          <ThemedView type="backgroundElement" style={[styles.stepContainer, {marginTop:Spacing.four}]}>

          <TextInputWithLabel
            labelText="Name"
            labelType="default"
            style={[styles.input, { color: theme['text'] }]}
            value={name}
            onChangeText={setName}
          />

          <TextInputWithLabel
            labelText="Description"
            labelType="default"
            style={[styles.input, { color: theme['text'] }]}
            value={description}
            onChangeText={setDescription}
          />

          <TextInputWithLabel
            labelText="Type"
            labelType="default"
            style={[styles.input, { color: theme['text'] }]}
            value={type}
            onChangeText={setType}
          />

          <DatePickerField
            labelText="Best by"
            value={bestBy}
            onChange={setBestBy}
            style={styles.input}
          />

          <TextInputWithLabel
            labelText="Stork"
            labelType="default"
            style={[styles.input, { color: theme['text'] }]}
            value={String(stork)}
            onChangeText={(v)=>setStork(Number(v))}
            inputMode="numeric"
          />

          <TextInputWithLabel
            labelText="Store location"
            labelType="default"
            style={[styles.input, { color: theme['text'] }]}
            value={storeLocation}
            onChangeText={setStoreLocation}
          />

          <TextInputWithLabel
            labelText="Item number"
            labelType="default"
            style={[styles.input, { color: theme['text'] }]}
            value={itemNumber}
            onChangeText={setItemNumber}
          />

          <TextInputWithLabel
            labelText="Ean number"
            labelType="default"
            style={[styles.input, { color: theme['text'] }]}
            value={ean}
            onChangeText={setEan}
          />

          <PickerInputLabel
            labelText="Usergroup"
            labelType="default"
            showDefault
            defaultValue=''
            datakey="uuid"
            datalabel="name"
            datavalue="uuid"
            data={usergroups}
            selectedValue={userGroupId}
            onValueChange={setUserGroupId}
            style={[styles.inputPicker,{color: theme['text'] , backgroundColor: theme['backgroundElement'] }]}
          />

          <PickerInputLabel
            labelText="StorkItmeGroup"
            labelType="default"
            showDefault
            defaultValue=''
            datakey="uuid"
            datalabel="name"
            datavalue="uuid"
            data={storkitmegroups}
            selectedValue={storkItmeGroupId}
            onValueChange={setStorkItmeGroupId}
            style={[styles.inputPicker,{color: theme['text'] , backgroundColor: theme['backgroundElement'] }]}
          />

          <View style={styles.buttonUpdate}>
              <Button 
                title={saving ? "Creating..." : "Make new StorkItme"}
                disabled={saving}
                onPress={makeNewStorkitme}
              />
          </View>


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
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
    paddingTop: Spacing.three,
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
  inputPicker: {
    height: 50,
    borderWidth: 1,
    padding: 10,
  },
  fieldGroup: {
    gap: Spacing.one,
  },
  buttonUpdate: {
    marginTop: Spacing.four,
    borderRadius: 5,
  },
});
