import { TextInputWithLabel } from '@/components/text-input-with-label';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/use-theme';
import { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PickerInputLabel } from '../picker-input-label';
import { ThemedText } from '../themed-text';



export type UserData = {
  Email: string;
  UserName: string;
  Password: string;
  ConfirmPassword: string;
  Role: string;
  UserGroups: UserGroupsData[];
  StorkItmeGroups: StorkItmeGroupsData[];

};

export type UserGroupsData = {
  name: string;
  color: string;
  uuid: string;
};

export type StorkItmeGroupsData = {
  name: string;
  description: string;
  uuid: string;
};

type Props = {
  initialValues?: UserData;

  storkItmeGroups: StorkItmeGroupsData[];
  userGroups: UserGroupsData[];
  onSubmit: (data: UserData) => boolean;
  onDelete?: () => boolean;

  onAddStorkItmeGroup?: (uuid: string) => void;
  onRemoveStorkItmeGroup?: (uuid: string) => void;

  onAddUserGroup?: (uuid: string) => void;
  onRemoveUserGroup?: (uuid: string) => void;

  buttonText?: string;
  loading?: boolean;
  thisIsToUpdate?:boolean
};


const emptyValues: UserData = {
  Email:'',
  UserName:'',
Password:'',
    ConfirmPassword:'',
  Role:'',
  UserGroups: [],
  StorkItmeGroups: []
};


export function UserForm({
  initialValues,
  onSubmit,
  onDelete,
  onAddStorkItmeGroup,
  onRemoveStorkItmeGroup,
  onAddUserGroup,
  onRemoveUserGroup,
  buttonText="Save",
  loading=false,
  thisIsToUpdate=false,
  storkItmeGroups = [],
  userGroups = []

}: Props) {

const {hasIRightRole,getRoleList } = useAuth();


const theme = useTheme();


const [form,setForm] = useState<UserData>(
  initialValues ?? emptyValues
);

function nullSet(){

  setForm({
    Email:'',
    UserName:'',
    Password:'',
    ConfirmPassword:'',
    Role:'',
    UserGroups: [],
    StorkItmeGroups: []
  });

}


function update<K extends keyof UserData>(
 key:K,
 value:UserData[K]
){
 setForm(prev=>({
   ...prev,
   [key]:value
 }));
}

function addStorkItmeGroup(uuid:string){
  const selectedGroup = storkItmeGroups.find(group => group.uuid === uuid);
  if (selectedGroup && !form.StorkItmeGroups.some(group => group.uuid === uuid)) {
    setForm(prev => ({
      ...prev,
      StorkItmeGroups: [...prev.StorkItmeGroups, selectedGroup]
    }));

    onAddStorkItmeGroup?.(uuid);
  }
}

function removeStorkItmeGroup(uuid:string){
  setForm(prev => ({
    ...prev,
    StorkItmeGroups: prev.StorkItmeGroups.filter(group => group.uuid !== uuid)
  }));

  onRemoveStorkItmeGroup?.(uuid);
}

function addUserGroup(uuid:string){
  const selectedGroup = userGroups.find(group => group.uuid === uuid);
  if (selectedGroup && !form.UserGroups.some(group => group.uuid === uuid)) {
    setForm(prev => ({
      ...prev,
      UserGroups: [...prev.UserGroups, selectedGroup]
    }));
    onAddUserGroup?.(uuid);
  }
}

function removeUserGroup(uuid:string){
  setForm(prev => ({
    ...prev,
    UserGroups: prev.UserGroups.filter(group => group.uuid !== uuid)
  }));
  onRemoveUserGroup?.(uuid);
}

async function submit(){

 const res = await onSubmit(form);

  if(res && !thisIsToUpdate)
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
 labelText="Email"
 labelType="default"
 style={[styles.input,{color:theme.text}]}
 value={form.Email}
 onChangeText={(v)=>update("Email",v)}
/>


<TextInputWithLabel
 labelText="UserName"
 labelType="default"
 style={[styles.input,{color:theme.text}]}
 value={form.UserName}
 onChangeText={(v)=>update("UserName",v)}
/>

<TextInputWithLabel
 labelText="Password"
 labelType="default"
    style={[styles.input,{color:theme.text}]}
    value={form.Password}
    onChangeText={(v)=>update("Password",v)}
    secureTextEntry={true}
/>

<TextInputWithLabel
 labelText="Confirm Password"
 labelType="default"
    style={[styles.input,{color:theme.text}]}
    value={form.ConfirmPassword}
    onChangeText={(v)=>update("ConfirmPassword",v)}
    secureTextEntry={true}
/>


<PickerInputLabel
 labelText="Role"
 labelType="default"
 showDefault
 defaultValue=""
 datakey=""
 datalabel=""
 datavalue=""
 data={getRoleList()}
 selectedValue={form.Role}
 onValueChange={(v)=>update("Role",v)}
 style={styles.inputPicker}
/>
</View>
{(thisIsToUpdate && hasIRightRole('Manager')) && (
<>

<ThemedText type="default" style={{color:theme.text, marginTop: Spacing.two}}>
  storkItmeGroups
</ThemedText>

<View style={{ width:325}}>
<PickerInputLabel
 labelText="storkItmeGroup"
 labelType="default"
 showDefault
 defaultValue=""
 datakey="uuid"
 datalabel="name"
 datavalue="uuid"
 data={storkItmeGroups}
 onValueChange={(v)=>addStorkItmeGroup(v)}
 style={styles.inputPicker}
/>
</View>

 
<View>


  <View style={[styles.row, styles.header]}>
    {[{ key: 'name', title: 'Name' }, { key: 'description', title: 'Description'}].map((column) => (
      <Text key={column.key} style={styles.headerCell}>
        {column.title}
      </Text>
    ))}
    <Text style={[styles.headerCell, {minWidth:100}]}>Action</Text>
  </View>

  {form.StorkItmeGroups.length === 0 ? (
    <ThemedText type="default" style={{color:theme.text, padding: Spacing.two}}>No storkItme groups</ThemedText>
  ) : (
    form.StorkItmeGroups.map((group) => (
      <View key={group.uuid} style={styles.row}>
        <ThemedText type="default" style={styles.cell}>
          {group.name}
        </ThemedText>
        <ThemedText type="default" style={styles.cell}>
          {group.description}
        </ThemedText>
        <View style={{minWidth:100}}>
          <Button title="Remove" color={theme['red']} onPress={() => removeStorkItmeGroup(group.uuid)} />
        </View>
      </View>
    ))
  )}
</View>






<ThemedText type="default" style={{color:theme.text, marginTop: Spacing.two}}>
  UserGroups
</ThemedText>

<View style={{ width:325}}>
<PickerInputLabel
 labelText="UserGroup"
 labelType="default"
 showDefault
 defaultValue=""
 datakey="uuid"
 datalabel="name"
 datavalue="uuid"
 data={userGroups}
 onValueChange={(v)=>addUserGroup(v)}
 style={styles.inputPicker}
/>
</View>

 
<View>


  <View style={[styles.row, styles.header]}>
    {[{ key: 'name', title: 'Name' }, { key: 'color', title: 'Color'}].map((column) => (
      <Text key={column.key} style={styles.headerCell}>
        {column.title}
      </Text>
    ))}
    <Text style={[styles.headerCell, {minWidth:100}]}>Action</Text>
  </View>

  {form.UserGroups.length === 0 ? (
    <ThemedText type="default" style={{color:theme.text, padding: Spacing.two}}>No user groups</ThemedText>
  ) : (
    form.UserGroups.map((group) => (
      <View key={group.uuid} style={styles.row}>
        <ThemedText type="default" style={styles.cell}>
          {group.name}
        </ThemedText>
        <ThemedText type="default" style={styles.cell}>
          {group.color}
        </ThemedText>
        <View style={{minWidth:100}}>
          <Button title="Remove" color={theme['red']} onPress={() => removeUserGroup(group.uuid)} />
        </View>
      </View>
    ))
  )}
</View>

</>
 )}



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