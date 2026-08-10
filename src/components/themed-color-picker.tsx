import { useTheme } from '@/hooks/use-theme';
import { useState } from 'react';
import { View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import { StyleSheet } from 'react-native';
import type { ColorFormatsObject } from 'reanimated-color-picker';
import ColorPicker, { colorKit, HueSlider, Panel1, PreviewText } from 'reanimated-color-picker';

const customSwatches = new Array(6).fill('#fff').map(() => colorKit.randomRgbColor().hex());


export function ThemeColorPicker({resultColorOn, onColorPick }: {resultColorOn: string; onColorPick: (color: string) => void }) {
  const theme = useTheme();

  const [resultColor, setResultColor] = useState(resultColorOn);

  const currentColor = useSharedValue(resultColorOn);

  // runs on the ui thread on color change
  const onColorChange = (color: ColorFormatsObject) => {
    'worklet';
    currentColor.value = color.hex;
  };

  // runs on the js thread on color pick
  const onColorPickThis = (color: ColorFormatsObject) => {
    setResultColor(color.hex);
    onColorPick(color.hex);
  };

  return (
          <View style={[colorPickerStyle.pickerContainer,{ backgroundColor: theme['backgroundElement'] }]}>
        <ColorPicker
          value={resultColor}
          sliderThickness={25}
          thumbSize={24}
          thumbShape='circle'
          onChange={onColorChange}
          onCompleteJS={onColorPickThis}
          style={colorPickerStyle.picker}
          boundedThumb
        >
          <Panel1 style={colorPickerStyle.panelStyle} />
          <HueSlider style={colorPickerStyle.sliderStyle} />



          <PreviewText style={{color:theme.text}} colorFormat='hex' />
        </ColorPicker>
      </View>
  );

}


const colorPickerStyle = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontFamily: 'Quicksand',
    fontWeight: 'bold',
    marginVertical: 20,
  },
  picker: {
    gap: 20,
  },
  pickerContainer: {
    alignSelf: 'center',
    width: 300,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  panelStyle: {
    borderRadius: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  sliderStyle: {
    borderRadius: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  sliderVerticalStyle: {
    borderRadius: 20,
    height: 300,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  sliderTitle: {
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 5,
    paddingHorizontal: 4,
    fontFamily: 'Quicksand',
  },
  previewStyle: {
    height: 40,
    borderRadius: 14,
  },
  inputStyle: {
    color: '#707070',
    paddingVertical: 2,
    borderColor: '#707070',
    fontSize: 12,
    marginLeft: 5,
  },
  swatchesContainer: {
    alignItems: 'center',
    flexWrap: 'nowrap',
    gap: 10,
  },
  swatchStyle: {
    borderRadius: 20,
    height: 30,
    width: 30,
    margin: 0,
    marginBottom: 0,
    marginHorizontal: 0,
    marginVertical: 0,
  },
});