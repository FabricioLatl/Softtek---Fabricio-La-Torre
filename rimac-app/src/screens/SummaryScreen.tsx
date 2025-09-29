import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { useFormStore } from '../store/formStore';
import { useUserStore } from '../store/userStore';
import { useQuoteStore } from '../store/quoteStore';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function SummaryScreen() {
  const navigation = useNavigation();
  const form = useFormStore((s) => s.data);
  const { user } = useUserStore();
  const { selectedPlan } = useQuoteStore();

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right', 'bottom']}>
      <Header />
      <View style={styles.container}>
        <View style={styles.stepRow}>
          <Pressable accessibilityRole="button" style={styles.backBtn} onPress={() => (navigation as any).navigate('Quote')}>
            <Ionicons name="chevron-back" size={16} color="#111827" />
          </Pressable>
          <Text style={styles.stepText}>PASO 2 DE 2</Text>
          <View style={styles.stepBarTrack}>
            <View style={[styles.stepBarFill, { width: '100%' }]} />
          </View>
        </View>

        <Text style={styles.title}>Resumen del seguro</Text>

        <View style={styles.card}>
          <Text style={styles.smallLabel}>PRECIOS CALCULADOS PARA:</Text>
          <View style={{ height: 8 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="people" size={20} color="#0B0B14" style={{ marginRight: 8 }} />
            <Text style={styles.userName}>{user?.name ?? ''}</Text>
          </View>
          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Responsable de pago</Text>
          <Text style={styles.infoText}>DNI: {form?.documentNumber ?? '-'}</Text>
          <Text style={styles.infoText}>Celular: {form?.phone ?? '-'}</Text>

          <View style={{ height: 16 }} />
          <Text style={styles.sectionTitle}>Plan elegido</Text>
          <Text style={styles.infoText}>{selectedPlan?.name ?? '-'}</Text>
          <Text style={styles.infoText}>Costo del Plan: ${selectedPlan?.price ?? '-'} al mes</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F6F7FC' },
  container: { alignSelf: 'center', width: 384, paddingHorizontal: 24, paddingVertical: 16 },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  backBtn: {
    width: 28,
    height: 28,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepText: { fontSize: 12, color: '#111827', marginRight: 12 },
  stepBarTrack: { flex: 1, height: 6, backgroundColor: '#E5E7EB', borderRadius: 3 },
  stepBarFill: { height: 6, backgroundColor: '#6D79FF', borderRadius: 3 },
  title: { marginTop: 8, fontSize: 28, fontWeight: '800', color: '#0B0B14', marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  smallLabel: { color: '#6B7280', fontSize: 12, fontWeight: '700' },
  userName: { fontSize: 20, fontWeight: '700', color: '#0B0B14' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0B0B14', marginTop: 4 },
  infoText: { marginTop: 6, color: '#111827' },
});


