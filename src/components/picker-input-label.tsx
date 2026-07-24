import { Picker, PickerProps } from '@react-native-picker/picker';
import { View } from 'react-native';

import { ThemedText, ThemedTextProps } from '@/components/themed-text';

type PickerInputLabelProps<T> = PickerProps<T> & {
  labelText: string;
  labelType?: ThemedTextProps['type'];

  data: Array<any>;
  datakey?:string
  datalabel?:string
  datavalue?:string

  showDefault?: boolean;
  defaultLabel?: string;
  defaultValue?: T;
};

export function PickerInputLabel<T>({
  labelText,
  labelType = 'default',

  data,
  datakey="key",
  datalabel="label",
  datavalue="value",

  showDefault = false,
  defaultLabel = 'None',
  defaultValue,

  ...pickerProps
}: PickerInputLabelProps<T>) {
  return (
    <View>
      <ThemedText type={labelType}>
        {labelText}
      </ThemedText>

      <Picker {...pickerProps}>
        {showDefault && (
          <Picker.Item
            label={defaultLabel}
            value={defaultValue as T}
          />
        )}

        {data.map(item => (
          <Picker.Item
            key={String(item[datakey])}
            label={item[datalabel]}
            value={item[datavalue]}
          />
        ))}
      </Picker>
    </View>
  );
}