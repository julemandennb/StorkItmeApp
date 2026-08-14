import { ThemedText, ThemedTextProps } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { TextInput, TextInputProps, View } from 'react-native';

type Props = TextInputProps & {
  labelText: string;
  labelType?: ThemedTextProps['type'];
};

export function TextInputWithLabel({
  labelText,
  labelType = 'default',
  ...textInputProps
}: Props) {
  const theme = useTheme();

  const { value, defaultValue, style, ...rest } = textInputProps as any;

  const inputProps: any = { ...rest };

  // Always treat the input as controlled to avoid switching between
  // controlled and uncontrolled. Use empty string fallback when value
  // is undefined or null; prefer explicit `value` over `defaultValue`.
  inputProps.value = value ?? defaultValue ?? '';

  return (
    <View>
      <ThemedText type={labelType}>
        {labelText}
      </ThemedText>

      <TextInput
        style={[
          style,
          { color: theme['text'] }
        ]}
        {...inputProps}
      />
    </View>
  );
}