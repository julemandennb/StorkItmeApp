import { DatePickerField } from '@/components/date-picker-field';
import { PickerInputLabel } from '@/components/picker-input-label';
import { TextInputWithLabel } from '@/components/text-input-with-label';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing, } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, View } from 'react-native';


export type StorkitmeData = {
  name: string;
  description: string;
  type: string;
  bestBy: string;
  stork: number;
  storeLocation: string;
  itemNumber: string;
  ean: string;
  userGroupId: string;
  storkItmeGroupId: string;
};



type Props = {
  initialValues?: StorkitmeData;
  usergroups: any[];
  storkitmegroups: any[];

  onSubmit: (data: StorkitmeData) => boolean;

  buttonText?: string;
  loading?: boolean;
};


const emptyValues: StorkitmeData = {
  name:'',
  description:'',
  type:'',
  bestBy:new Date().toISOString().split("T")[0],
  stork:0,
  storeLocation:'',
  itemNumber:'',
  ean:'',
  userGroupId:'',
  storkItmeGroupId:'',
};


export function StorkitmeForm({
  initialValues,
  usergroups,
  storkitmegroups,
  onSubmit,
  buttonText="Save",
  loading=false
}: Props) {


const theme = useTheme();


const [form,setForm] = useState<StorkitmeData>(
  initialValues ?? emptyValues
);

function nullSet(){

  setForm({
    name:'',
    description:'',
    type:'',
    bestBy:new Date().toISOString().split("T")[0],
    stork:0,
    storeLocation:'',
    itemNumber:'',
    ean:'',
    userGroupId:'',
    storkItmeGroupId:'',
  });

}


function update<K extends keyof StorkitmeData>(
 key:K,
 value:StorkitmeData[K]
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


<TextInputWithLabel
 labelText="Description"
 labelType="default"
 style={[styles.input,{color:theme.text}]}
 value={form.description}
 onChangeText={(v)=>update("description",v)}
/>


<TextInputWithLabel
 labelText="Type"
 labelType="default"
 style={[styles.input,{color:theme.text}]}
 value={form.type}
 onChangeText={(v)=>update("type",v)}
/>


<DatePickerField
 labelText="Best by"
 value={form.bestBy}
 onChange={(v)=>update("bestBy",v)}
 style={styles.input}
/>


<TextInputWithLabel
 labelText="Stork"
 labelType="default"
 style={[styles.input,{color:theme.text}]}
 value={String(form.stork)}
 inputMode="numeric"
 onChangeText={(v)=>update("stork",Number(v))}
/>


<TextInputWithLabel
 labelText="Store location"
 labelType="default"
 style={[styles.input,{color:theme.text}]}
 value={form.storeLocation}
 onChangeText={(v)=>update("storeLocation",v)}
/>


<TextInputWithLabel
 labelText="Item number"
 labelType="default"
 style={[styles.input,{color:theme.text}]}
 value={form.itemNumber}
 onChangeText={(v)=>update("itemNumber",v)}
/>


<TextInputWithLabel
 labelText="Ean number"
 labelType="default"
 style={[styles.input,{color:theme.text}]}
 value={form.ean}
 onChangeText={(v)=>update("ean",v)}
/>



<PickerInputLabel
 labelText="Usergroup"
 labelType="default"
 showDefault
 defaultValue=""
 datakey="uuid"
 datalabel="name"
 datavalue="uuid"
 data={usergroups}
 selectedValue={form.userGroupId}
 onValueChange={(v)=>update("userGroupId",v)}
 style={styles.inputPicker}
/>



<PickerInputLabel
 labelText="StorkItmeGroup"
 labelType="default"
 showDefault
 defaultValue=""
 datakey="uuid"
 datalabel="name"
 datavalue="uuid"
 data={storkitmegroups}
 selectedValue={form.storkItmeGroupId}
 onValueChange={(v)=>update("storkItmeGroupId",v)}
 style={styles.inputPicker}
/>



<View style={styles.buttonUpdate}>
<Button
 title={loading ? "Saving..." : buttonText}
 disabled={loading}
 onPress={submit}
/>
</View>
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