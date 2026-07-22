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

  return (
    <View>
      <ThemedText type={labelType}>
        {labelText}
      </ThemedText>

      <TextInput
        style={[
          textInputProps.style,
          { color: theme['text'] }
        ]}
        {...textInputProps}
      />
    </View>
  );
}