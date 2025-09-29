import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FormScreen from '../screens/FormScreen';
import QuoteScreen from '../screens/QuoteScreen';
import SummaryScreen from '../screens/SummaryScreen';

export type RootStackParamList = {
  Form: undefined;
  Quote: undefined;
  Summary: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Form" component={FormScreen} />
      <Stack.Screen name="Quote" component={QuoteScreen} />
      <Stack.Screen name="Summary" component={SummaryScreen} />
    </Stack.Navigator>
  );
}


