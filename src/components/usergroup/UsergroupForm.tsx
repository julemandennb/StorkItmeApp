import { TextInputWithLabel } from '@/components/text-input-with-label';
import { ThemeColorPicker } from '@/components/themed-color-picker';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/use-theme';
import { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';


export type UsergroupData = {
  name: string;
  color: string;
  users: users[];
  storkItmes: storkItmes[];
};

export type users = {
  id: string;
  email: string;
  userName: string;
}

export type storkItmes = {
  uuid: string;
  name: string;
  description: string;
  bestBy: string;
  ean: string;
  itemNumber: string;
  storeLocation: string;
  type: string;
}



type Props = {
  initialValues?: UsergroupData;
  users: users[];
  storkItmes: storkItmes[];

  onRemoveUser?: (id: string) => void;
  onRemoveStorkItme?: (uuid: string) => void;


  onSubmit: (data: UsergroupData) => boolean;
  onDelete?: () => boolean;

  buttonText?: string;
  loading?: boolean;
  thisIsToUpdate?:boolean
};


const emptyValues: UsergroupData = {
  name:'',
  color:'#ffffff',
  users:[],
  storkItmes:[],
};


export function UsergroupForm({
  initialValues,
  onSubmit,
  onDelete,
  onRemoveUser,
  onRemoveStorkItme,
  buttonText="Save",
  loading=false,
  thisIsToUpdate=false

}: Props) {

const {hasIRightRole } = useAuth();

const theme = useTheme();

const [form,setForm] = useState<UsergroupData>(
  initialValues ?? emptyValues
);

function nullSet(){

  setForm({
    name:'',
    color:'',
    users:[],
    storkItmes:[],
  });

}


function update<K extends keyof UsergroupData>(
 key:K,
 value:UsergroupData[K]
){
 setForm(prev=>({
   ...prev,
   [key]:value
 }));
}

function removeUser(id: string){
  update("users", form.users.filter(u => u.id !== id) as any);
  onRemoveUser?.(id);
}

function removeStorkItme(uuid: string){
  update("storkItmes", form.storkItmes.filter(s => s.uuid !== uuid) as any);
  onRemoveStorkItme?.(uuid);
}


async function submit(){

 if(form.name.length===0){
   alert("this has to hav a name");
   return;
 }

 const res = await onSubmit(form);

  if(res)
    nullSet();
}

async function deleteFun() {
  await onDelete?.();
}

useEffect(() => {
  if(initialValues){
    setForm(initialValues);
  }
}, [initialValues]);

return (

    <ScrollView>
<ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
<ThemedView type="backgroundElement" style={[styles.stepContainer, {marginTop:Spacing.four}]}> 

<View style={{ width:325}}>

<TextInputWithLabel
 labelText="Name"
 labelType="default"
 style={[styles.input,{color:theme.text}]}
 value={form.name}
 onChangeText={(v)=>update("name",v)}
/>


<ThemedText type="default" style={{color:theme.text}}>
  Color
</ThemedText>

<ThemeColorPicker
  resultColorOn={form.color}
  onColorPick={(color)=>{
    update("color",color);
  }}
/>

</View>

{(thisIsToUpdate && hasIRightRole('Manager')) && (
        
<>

<ThemedText type="default" style={{color:theme.text, marginTop: Spacing.two}}>
  Users
</ThemedText>
<View>
  <View style={[styles.row, styles.header]}>
    {[{ key: 'userName', title: 'User' },{ key: 'email', title: 'Email' }].map((column) => (
      <Text key={column.key} style={styles.headerCell}>
        {column.title}
      </Text>
    ))}
    <Text style={[styles.headerCell, {minWidth:100}]}>Action</Text>
  </View>

  {form.users.length === 0 ? (
    <ThemedText type="default" style={{color:theme.text, padding: Spacing.two}}>No users</ThemedText>
  ) : (
    form.users.map((item) => (
      <View key={item.id} style={styles.row}>
        <ThemedText type="default" style={styles.cell}>
          {item.userName}
        </ThemedText>
        <ThemedText type="default" style={styles.cell}>
          {item.email}
        </ThemedText>
        <View style={{minWidth:100}}>
          <Button title="Remove" color={theme['red']} onPress={() => removeUser(item.id)} />
        </View>
      </View>
    ))
  )}
</View>

<ThemedText type="default" style={{color:theme.text, marginTop: Spacing.two}}>
  StorkItmes
</ThemedText>
<View>


  <View style={[styles.row, styles.header]}>
    {[{ key: 'name', title: 'Name' }, { key: 'ean', title: 'EAN' }, { key: 'itemNumber', title: 'Item Number' }, { key: 'storeLocation', title: 'Store Location' }].map((column) => (
      <Text key={column.key} style={styles.headerCell}>
        {column.title}
      </Text>
    ))}
    <Text style={[styles.headerCell, {minWidth:100}]}>Action</Text>
  </View>

  {form.storkItmes.length === 0 ? (
    <ThemedText type="default" style={{color:theme.text, padding: Spacing.two}}>No stork items</ThemedText>
  ) : (
    form.storkItmes.map((item) => (
      <View key={item.uuid} style={styles.row}>
        <ThemedText type="default" style={styles.cell}>
          {item.name}
        </ThemedText>
        <ThemedText type="default" style={styles.cell}>
          {item.ean}
        </ThemedText>
        <ThemedText type="default" style={styles.cell}>
          {item.itemNumber}
        </ThemedText>
        <ThemedText type="default" style={styles.cell}>
          {item.storeLocation}
        </ThemedText>
        <View style={{minWidth:100}}>
          <Button title="Remove" color={theme['red']} onPress={() => removeStorkItme(item.uuid)} />
        </View>
      </View>
    ))
  )}
</View>

</>

)}

<View style={{ width:325}}>
{(hasIRightRole('Manager')) && (
  <View style={styles.buttonUpdate}>
    <Button
    title={loading ? "Saving..." : buttonText}
    disabled={loading}
    onPress={submit}
    />
  </View>
  )}


 {(thisIsToUpdate && hasIRightRole('Manager')) && (
         
  <View style={styles.buttonUpdate}>

    <Button
      color={theme['red']}
      title={"Delete"}
      onPress={deleteFun}
    />
  </View>
  )}

</View>


</ThemedView>
</ScrollView>
 </ScrollView>


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
    width:'100%'
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
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    width: 500,
  },

  cell: {
    flex: 1,
    flexBasis: 100,
    minWidth: 100,
    padding: 8,
    fontSize: 13,
    flexShrink: 1,
  },

  header: {
    backgroundColor: '#f2f2f2',
  },

  headerCell: {
    flex: 1,
    flexBasis: 100,
    minWidth: 100,
    padding: 8,
    fontWeight: '700',
    fontSize: 13,
    flexShrink: 1,
  },
});