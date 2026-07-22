import { ThemedText, ThemedTextProps } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

type Props = {
  labelText: string;
  labelType?: ThemedTextProps['type'];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export function DatePickerField({
  labelText,
  labelType = 'default',
  value,
  onChange,
  placeholder = 'Select a date',
  style,
  containerStyle,
  disabled = false,
}: Props) {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (value) {
      const parsedDate = new Date(value);
      if (!Number.isNaN(parsedDate.getTime())) {
        setSelectedDate(parsedDate);
        return;
      }
    }

    setSelectedDate(null);
  }, [value]);

  const handleDateChange = (_event: unknown, pickedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (pickedDate) {
      setSelectedDate(pickedDate);
      onChange(pickedDate.toISOString().split('T')[0]);
    }
  };

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, containerStyle]}>
        <ThemedText type={labelType}>{labelText}</ThemedText>
        <input
          type="date"
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          style={{
            height: 40,
            borderWidth: 1,
            borderColor: "black",
            borderRadius: 8,
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 8,
            paddingBottom: 8,
            backgroundColor: 'transparent',
            color: theme['text'],
            ...(style as Record<string, unknown>),
          }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <ThemedText type={labelType}>{labelText}</ThemedText>
      <Pressable
        onPress={() => !disabled && setShowDatePicker(true)}
        disabled={disabled}
        style={[styles.input, { borderColor: 'black' }, style]}
      >
        <ThemedText style={[styles.text, { color: theme['text'] }]}>
          {value || placeholder}
        </ThemedText>
      </Pressable>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate ?? new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onValueChange={handleDateChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  input: {
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: 'center',
    borderRadius: 8,
  },
  text: {
    lineHeight: 20,
  },
});
