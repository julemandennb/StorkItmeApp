import { TextInputWithLabel } from '@/components/text-input-with-label';
import { ThemeColorPicker } from '@/components/themed-color-picker';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing, } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/use-theme';
import { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, View } from 'react-native';


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

<ThemedView type="backgroundElement" style={[styles.stepContainer, {marginTop:Spacing.four}]}>

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

{(thisIsToUpdate && hasIRightRole('Manager')) && (
        
<>




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