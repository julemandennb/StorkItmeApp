import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedCheckboxProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  themeColor?: ThemeColor;
  testID?: string;
};

export function ThemedCheckbox({
  value,
  onValueChange,
  label,
  disabled = false,
  themeColor,
  testID,
}: ThemedCheckboxProps) {
  const theme = useTheme();

  return (
    <Pressable
      testID={testID}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={styles.container}>
      <View
        style={[
          styles.checkbox,
          {
            borderColor: value
              ? theme[themeColor ?? 'primary']
              : theme.border,
            backgroundColor: value
              ? theme[themeColor ?? 'primary']
              : 'transparent',
          },
          disabled && styles.disabled,
        ]}>
        {value && <Text  style={[
      styles.checkmark,
      { color: theme.text },
    ]}>✓</Text>}
      </View>

      {label ? (
        <Text
          style={[
            styles.label,
            {
              color: theme.text,
            },
            disabled && styles.disabledText,
          ]}>
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 12,
  },

  label: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },

  disabled: {
    opacity: 0.5,
  },

  disabledText: {
    opacity: 0.5,
  },
});