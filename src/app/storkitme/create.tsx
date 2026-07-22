import { DatePickerField } from '@/components/date-picker-field';
import { TextInputWithLabel } from '@/components/text-input-with-label';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/use-theme';
import { apiGet } from '@/services/api';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StorkitmeCreate() {

    const { loggedIn } = useAuth();
    const theme = useTheme();

    const [storkitmegroups , setStorkitmegroup] = useState([]);

    const [usergroups , setUsergroup] = useState([]);


    //to make a new storkitme
    const [name,setName]= useState('');
    const [description,setDescription]= useState('');
    const [type,setType]= useState('');
    const [bestBy,setBestBy]= useState('');
    const [stork,setStork]= useState('0'); // this is a number
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





  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

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
            value={stork}
            onChangeText={setStork}
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






             
          </ThemedView>

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
  fieldGroup: {
    gap: Spacing.one,
  },
  pickerButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  pickerText: {
  },
  buttonUpdate: {
    marginTop: Spacing.four,
    borderRadius: 5,
  },
});
