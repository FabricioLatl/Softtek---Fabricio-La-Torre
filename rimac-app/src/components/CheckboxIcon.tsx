import { View } from 'react-native';

export default function CheckboxIcon() {
  return (
    <View
      style={{
        width: 10,
        height: 6,
        borderLeftWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#fff',
        transform: [{ rotate: '-45deg' }],
      }}
    />
  );
}


