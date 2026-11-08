import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { colors } from "./src/theme";
import RegisterScreen from "./src/screens/RegisterScreen";
import LoginScreen from "./src/screens/LoginScreen";
import BerandaScreen from "./src/screens/BerandaScreen";
import JelajahScreen from "./src/screens/JelajahScreen";
import FavoritScreen from "./src/screens/FavoritScreen";
import AktivitasScreen from "./src/screens/AktivitasScreen";
import ArtikelDetailScreen from "./src/screens/ArtikelDetailScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Beranda: { active: "home", inactive: "home-outline" },
  Jelajah: { active: "compass", inactive: "compass-outline" },
  Favorit: { active: "bookmark", inactive: "bookmark-outline" },
  Aktivitas: { active: "fitness", inactive: "fitness-outline" },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.green800,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.cream, borderTopColor: colors.creamDark },
        tabBarIcon: ({ color, size, focused }) => {
          const icons = TAB_ICONS[route.name] || TAB_ICONS.Beranda;
          const name = focused ? icons.active : icons.inactive;
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Beranda" component={BerandaScreen} />
      <Tab.Screen name="Jelajah" component={JelajahScreen} />
      <Tab.Screen name="Favorit" component={FavoritScreen} />
      <Tab.Screen name="Aktivitas" component={AktivitasScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { loading } = useAuth();
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.cream }}>
        <ActivityIndicator color={colors.green800} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.cream },
        headerTintColor: colors.green800,
        contentStyle: { backgroundColor: colors.cream },
      }}
    >
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Daftar" }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Masuk" }} />
      <Stack.Screen name="ArtikelDetail" component={ArtikelDetailScreen} options={{ title: "Artikel" }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
