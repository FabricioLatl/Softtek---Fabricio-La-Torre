import { View, Image, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

/**
 * Header component sized to Figma: 384x56, with spacing and border bottom.
 */
export default function Header() {
  return (
    <View style={styles.container}>
      <Image accessibilityLabel="Rimac logo" source={require('../../assets/quote/Logo.png')} style={styles.logo} />
      <View style={styles.phoneRow}>
        <Ionicons name="call" size={16} color="#0B0B14" style={{ marginRight: 8 }} />
        <Text style={styles.phone}>(01) 411 6001</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: 384,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingRight: 24,
    paddingBottom: 12,
    paddingLeft: 24,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F6F7FC',
  },
  phone: { fontSize: 14, color: '#0B0B14' },
  logo: { width: 90, height: 24, resizeMode: 'contain' },
  phoneRow: { flexDirection: 'row', alignItems: 'center' },
});


