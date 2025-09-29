import { View, Text, StyleSheet, Pressable, Image, FlatList, Animated, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Header from '../components/Header';
import { useEffect, useRef, useState, useMemo } from 'react';
import { useUserStore } from '../store/userStore';
import CheckboxIcon from '../components/CheckboxIcon';
import { useQuoteStore, Plan } from '../store/quoteStore';
import { useNavigation } from '@react-navigation/native';

export default function QuoteScreen() {
  const navigation = useNavigation();
  const { user, fetchUser } = useUserStore();
  const { selectedFor, setSelectedFor, plans, fetchPlans, setSelectedPlan } = useQuoteStore();
  const [selected, setSelected] = useState<'me' | 'other' | null>(selectedFor);
  const opacity = useRef(new Animated.Value(0)).current;
  const listRef = useRef<FlatList<Plan> | null>(null);
  const scrollRef = useRef<ScrollView | null>(null);

  const screen = Dimensions.get('window');
  const containerWidth = 384;
  const cardWidth = useMemo(() => Math.min(containerWidth, screen.width - 32), [screen.width]);
  const cardHeight = Math.round(screen.height * 0.7);

  useEffect(() => {
    if (!user) fetchUser();
  }, [user]);

  const filteredPlans = plans.filter((p) => {
    if (!user?.age) return true;
    return user.age <= p.age;
  });

  useEffect(() => {
    if (selected && filteredPlans.length > 0) {
      Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }).start();
    }
  }, [selected, filteredPlans.length]);

  const handleSelect = async (value: 'me' | 'other') => {
    setSelected(value);
    setSelectedFor(value);
    if (plans.length === 0) await fetchPlans();
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 100);
  };

  const [page, setPage] = useState(1);
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems?.length) setPage(viewableItems[0].index + 1);
  }).current;

  const renderBullet = (text: string, idx: number) => {
    const parts = splitEmphasis(text);
    return (
      <View key={idx} style={styles.bulletRow}>
        <Ionicons
          name={idx === 0 ? 'people' : idx === 1 ? 'laptop' : 'medkit'}
          size={18}
          color="#000"
          style={{ marginRight: 10 }}
        />
        <Text style={styles.planBullet}>
          <Text style={styles.planBulletStrong}>{parts.strong}</Text>
          {parts.rest}
        </Text>
      </View>
    );
  };

  function splitEmphasis(sentence: string): { strong: string; rest: string } {
    const separators = [' por ', ' y ', ' en '];
    for (const sep of separators) {
      const idx = sentence.indexOf(sep);
      if (idx > 0) {
        return { strong: sentence.slice(0, idx), rest: sentence.slice(idx) };
      }
    }
    return { strong: sentence, rest: '' };
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView ref={scrollRef} contentContainerStyle={{ paddingBottom: 24 }}>
        <Header />
        <View style={[styles.container, { width: containerWidth }]}>
          <View style={styles.stepRow}>
            <Pressable accessibilityRole="button" style={[styles.backBtn, { opacity: 0.4 }]} disabled>
              <Ionicons name="chevron-back" size={16} color="#111827" />
            </Pressable>
            <Text style={styles.stepText}>PASO 1 DE 2</Text>
            <View style={styles.stepBarTrack}>
              <View style={styles.stepBarFill} />
            </View>
          </View>

          <Text style={styles.title}>{(user?.name ?? '').split(' ')[0]} ¿Para quién deseas cotizar?</Text>
          <Text style={styles.subtitle}>Selecciona la opción que se ajuste más a tus necesidades.</Text>

          <View style={{ marginTop: 16 }} />
          <Pressable accessibilityRole="button" style={styles.card} onPress={() => handleSelect('me')}>
            {selected === 'me' && (
              <View style={styles.checkBadge}>
                <CheckboxIcon />
              </View>
            )}
            <View style={styles.cardRow}>
              <Image source={require('../../assets/steps/IcProtectionLight.png')} style={styles.icon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Para mí</Text>
                <Text style={styles.cardBody}>Cotiza tu seguro de salud y agrega familiares si así lo deseas.</Text>
              </View>
            </View>
          </Pressable>

          <Pressable accessibilityRole="button" style={[styles.card, { marginTop: 16 }]} onPress={() => handleSelect('other')}>
            {selected === 'other' && (
              <View style={styles.checkBadge}>
                <CheckboxIcon />
              </View>
            )}
            <View style={styles.cardRow}>
              <Image source={require('../../assets/steps/IcAddUserLight.png')} style={styles.icon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Para alguien más</Text>
                <Text style={styles.cardBody}>Realiza una cotización para uno de tus familiares o cualquier persona.</Text>
              </View>
            </View>
          </Pressable>

          {selected && filteredPlans.length > 0 && (
            <>
              <View style={{ height: Math.max(16, Math.round((screen.height - cardHeight) / 2) - 40) }} />
              <Animated.View style={{ opacity }}>
                <FlatList
                  ref={(r) => (listRef.current = r)}
                  data={filteredPlans}
                  keyExtractor={(item) => item.name}
                  horizontal
                  pagingEnabled
                  snapToInterval={cardWidth + 16}
                  snapToAlignment="center"
                  decelerationRate="fast"
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: (screen.width - cardWidth) / 2 }}
                  onViewableItemsChanged={onViewableItemsChanged}
                  viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
                  renderItem={({ item }) => (
                    <View style={[styles.planCardWrap, { width: cardWidth, marginRight: 16 }]}> 
                      <View style={[styles.planCard, { height: cardHeight }]}> 
                        <View style={styles.planHeaderRow}>
                          <Text style={styles.planTitle}>{item.name}</Text>
                          <Image source={require('../../assets/steps/IcHomeLight.png')} style={{ width: 28, height: 28 }} />
                        </View>
                        <View>
                          <Text style={styles.planCostLabel}>COSTO DEL PLAN</Text>
                          <Text style={styles.planPrice}>${item.price} al mes</Text>
                        </View>
                        <View style={styles.planDivider} />
                        {item.description.map((d, idx) => renderBullet(d, idx))}
                        <Pressable accessibilityRole="button" style={styles.planCta} onPress={() => { setSelectedPlan(item); (navigation as any).navigate('Summary'); }}>
                          <Text style={{ color: '#fff', fontWeight: '700' }}>Seleccionar plan</Text>
                        </Pressable>
                      </View>
                    </View>
                  )}
                />
                <View style={styles.carouselControls}>
                  <Pressable style={styles.circleBtn} onPress={() => listRef.current?.scrollToOffset({ offset: Math.max(0, (page - 2) * (cardWidth + 16)), animated: true })}>
                    <Ionicons name="chevron-back" size={16} color="#4B5563" />
                  </Pressable>
                  <Text style={{ marginHorizontal: 16 }}>{page} / {filteredPlans.length}</Text>
                  <Pressable style={styles.circleBtn} onPress={() => listRef.current?.scrollToOffset({ offset: page * (cardWidth + 16), animated: true })}>
                    <Ionicons name="chevron-forward" size={16} color="#4B5563" />
                  </Pressable>
                </View>
              </Animated.View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F6F7FC' },
  container: { alignSelf: 'center', paddingHorizontal: 24, paddingVertical: 16 },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
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
  stepBarFill: { width: '50%', height: 6, backgroundColor: '#6D79FF', borderRadius: 3 },
  title: { marginTop: 16, fontSize: 28, lineHeight: 34, fontWeight: '800', color: '#0B0B14' },
  subtitle: { marginTop: 12, color: '#6B7280' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    position: 'relative',
  },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#0B0B14' },
  cardBody: { marginTop: 6, color: '#4B5563' },
  checkBadge: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { width: 32, height: 32, marginRight: 12, resizeMode: 'contain' },
  planCardWrap: { paddingRight: 16 },
  planCard: { backgroundColor: '#fff', borderRadius: 24, padding: 20, justifyContent: 'space-between' },
  planHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planTitle: { fontSize: 22, fontWeight: '800', color: '#0B0B14' },
  planCostLabel: { marginTop: 16, color: '#6B7280', fontSize: 12, fontWeight: '700' },
  planPrice: { marginTop: 6, fontSize: 20, fontWeight: '800' },
  planDivider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 24 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  planBullet: { flex: 1, color: '#111827', lineHeight: 22 },
  planBulletStrong: { fontWeight: '800', color: '#0B0B14' },
  planCta: { marginTop: 16, height: 48, borderRadius: 24, backgroundColor: '#FF2D55', alignItems: 'center', justifyContent: 'center' },
  carouselControls: { marginTop: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  circleBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
});


