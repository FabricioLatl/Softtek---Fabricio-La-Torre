import { View, Image, Text, StyleSheet } from 'react-native';

export default function Footer() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/quote/whiteLogo.png')}
        style={{ width: 120, height: 28, resizeMode: 'contain' }}
      />
      <View style={styles.separator} />
      <Text style={styles.copy}>© 2023 RIMAC Seguros y Reaseguros.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0B0B14',
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  separator: {
    marginTop: 16,
    height: 1,
    backgroundColor: '#1F2937',
  },
  copy: { color: '#9CA3AF', marginTop: 16, textAlign: 'center' },
});


