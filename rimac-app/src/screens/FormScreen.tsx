import { useMemo } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import CheckboxIcon from '../components/CheckboxIcon';
import Footer from '../components/Footer';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { useFormStore, FormData } from '../store/formStore';
import { useState } from 'react';

const schema = z.object({
  documentType: z.enum(['DNI', 'CE', 'PASS']),
  documentNumber: z
    .string()
    .min(8, 'Mínimo 8 dígitos')
    .max(12, 'Máximo 12 dígitos'),
  phone: z.string().min(9, 'Mínimo 9 dígitos'),
  privacyAccepted: z.literal(true, { errorMap: () => ({ message: 'Obligatorio' }) }),
  commsAccepted: z.literal(true, { errorMap: () => ({ message: 'Obligatorio' }) }),
});

type FormValues = z.infer<typeof schema>;

export default function FormScreen() {
  const navigation = useNavigation();
  const setData = useFormStore((s) => s.setData);
  const [showDocType, setShowDocType] = useState(false);
  const defaultValues = useMemo<FormValues>(() => ({
    documentType: 'DNI',
    documentNumber: '',
    phone: '',
    privacyAccepted: false,
    commsAccepted: false,
  }), []);

  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = (values: FormValues) => {
    setData(values as FormData);
    navigation.navigate('Quote' as never);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
      <View style={styles.topWrap}>
        <Header />
        <View style={styles.container}>
        <View style={styles.heroRow}>
        <View style={{ flex: 1 }}>
            <LinearGradient
              colors={["#00F4E2", "#00FF7F"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.badge}
            >
              <Text style={styles.badgeText}>Seguro Salud Flexible</Text>
            </LinearGradient>
            <Text style={styles.title}>Creado para{"\n"}ti y tu familia</Text>
        </View>
        <Image
          source={require('../../assets/quote/creado-para-ti.png')}
          style={{ width: 120, height: 120, resizeMode: 'cover', borderRadius: 12, marginLeft: 12 }}
        />
        </View>
        <View style={styles.separator} />
        <Text style={[styles.subtitle, { marginTop: 12 }]}>Tú eliges cuánto pagar. Ingresa tus datos, cotiza y recibe nuestra asesoría, 100% online.</Text>

        {/* Document type + number */}
        <View style={styles.row}>
          <Controller
            control={control}
            name="documentType"
            render={({ field: { value, onChange } }) => (
              <View style={{ width: 120, position: 'relative' }}>
                <Pressable style={[styles.inputBox, styles.dropdownField, { height: 44 }]} onPress={() => setShowDocType((s) => !s)}>
                  <Text>{value}</Text>
                  <Ionicons name="chevron-down" size={16} color="#0B0B14" />
                </Pressable>
                {showDocType && (
                  <View style={styles.dropdownMenu}>
                    <Pressable style={styles.dropdownItem} onPress={() => { onChange('DNI'); setShowDocType(false); }}>
                      <Text>DNI</Text>
                    </Pressable>
                    <Pressable style={styles.dropdownItem} onPress={() => { onChange('CE'); setShowDocType(false); }}>
                      <Text>CE</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            )}
          />
          <View style={[styles.inputBox, { flex: 1, height: 44 }]}> 
            <Controller
              control={control}
              name="documentNumber"
              render={({ field: { value, onChange, onBlur } }) => (
                <View>
                  <Text style={styles.inputLabel}>Nro. de documento</Text>
                  <TextInput
                    accessibilityLabel="Nro. de documento"
                    keyboardType="number-pad"
                    value={value}
                    maxLength={12}
                    onChangeText={(t) => onChange(t.replace(/\D/g, ''))}
                    onBlur={onBlur}
                    autoCorrect={false}
                  />
                </View>
              )}
            />
          </View>
        </View>
        {formState.errors.documentNumber && (
          <Text style={styles.error}>{formState.errors.documentNumber.message}</Text>
        )}

        {/* Phone */}
        <View style={[styles.inputBox, { marginTop: 16 }]}> 
          <Controller
            control={control}
            name="phone"
            render={({ field: { value, onChange, onBlur } }) => (
              <View>
                <Text style={styles.inputLabel}>Celular</Text>
                <TextInput
                  accessibilityLabel="Celular"
                  keyboardType="phone-pad"
                  value={value}
                  maxLength={9}
                  onChangeText={(t) => onChange(t.replace(/\D/g, ''))}
                  onBlur={onBlur}
                  autoCorrect={false}
                />
              </View>
            )}
          />
        </View>
        {formState.errors.phone && (
          <Text style={styles.error}>{formState.errors.phone.message}</Text>
        )}

        {/* Checkboxes */}
        <View style={{ marginTop: 16 }}>
          <Controller
            control={control}
            name="privacyAccepted"
            render={({ field: { value, onChange } }) => (
              <Pressable style={styles.checkboxRow} onPress={() => onChange(!value)}>
                <View style={[styles.checkbox, value && styles.checkboxChecked]}>{value ? <CheckboxIcon /> : null}</View>
                <Text>Acepto la Política de Privacidad</Text>
              </Pressable>
            )}
          />
          {formState.errors.privacyAccepted && (
            <Text style={styles.error}>{formState.errors.privacyAccepted.message}</Text>
          )}
        </View>
        <View style={{ marginTop: 12 }}>
          <Controller
            control={control}
            name="commsAccepted"
            render={({ field: { value, onChange } }) => (
              <Pressable style={styles.checkboxRow} onPress={() => onChange(!value)}>
                <View style={[styles.checkbox, value && styles.checkboxChecked]}>{value ? <CheckboxIcon /> : null}</View>
                <Text>Acepto la Política Comunicaciones Comerciales</Text>
              </Pressable>
            )}
          />
          {formState.errors.commsAccepted && (
            <Text style={styles.error}>{formState.errors.commsAccepted.message}</Text>
          )}
        </View>

        <Pressable
          accessibilityRole="button"
          style={[styles.cta, { opacity: formState.isValid ? 1 : 0.6 }]}
          disabled={!formState.isValid}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.ctaText}>Cotiza aquí</Text>
        </Pressable>
        <Text style={styles.terms}>Aplican Términos y Condiciones.</Text>
        </View>
      </View>
      <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  container: {
    width: 384,
    minHeight: 723,
    gap: 24,
    backgroundColor: '#F6F7FC',
    paddingRight: 24,
    paddingBottom: 64,
    paddingLeft: 24,
    alignSelf: 'center',
  },
  scrollContent: { paddingBottom: 24 },
  body: { paddingHorizontal: 0, paddingVertical: 16 },
  heroRow: { flexDirection: 'row', alignItems: 'center', paddingTop: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#0B0B14' },
  subtitle: { marginTop: 12, fontSize: 14, color: '#6B7280' },
  badge: { alignSelf: 'flex-start', borderRadius: 9999, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 8 },
  badgeText: { color: '#059669', fontWeight: '600', fontSize: 12 },
  row: { marginTop: 24, flexDirection: 'row', alignItems: 'stretch' },
  inputBox: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  dropdownField: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dropdownMenu: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    overflow: 'hidden',
    zIndex: 10,
  },
  dropdownItem: { paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  inputLabel: { color: '#6B7280', fontSize: 12, marginBottom: 4 },
  separator: { height: 1, backgroundColor: '#CCD1EE', marginTop: 16 },
  error: { color: '#DC2626', marginTop: 4 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginRight: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: '#000' },
  cta: {
    marginTop: 24,
    height: 56,
    borderRadius: 9999,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { color: '#fff', fontWeight: '600' },
  terms: { marginTop: 12, textDecorationLine: 'underline', color: '#0B0B14' },
});


