import { TextInputWithLabel } from '@/components/text-input-with-label';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing, } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/use-theme';
import { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, View } from 'react-native';
import { PickerInputLabel } from '../picker-input-label';



export type UserData = {
  Email: string;
  UserName: string;
  Password: string;
  ConfirmPassword: string;
  Role: string;
};



type Props = {
  initialValues?: UserData;


  onSubmit: (data: UserData) => boolean;
  onDelete?: () => boolean;

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
};


export function UserForm({
  initialValues,
  onSubmit,
  onDelete,
  buttonText="Save",
  loading=false,
  thisIsToUpdate=false

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

<ThemedView type="backgroundElement" style={[styles.stepContainer, {marginTop:Spacing.four}]}>

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
    width:350
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