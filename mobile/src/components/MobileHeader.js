import { Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme";

export default function MobileHeader({ navigation, title }) {
  const { user, isAuthenticated, logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigation.navigate("Beranda");
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
      }}
    >
      <View style={{ flex: 1 }}>
        {title ? (
          <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text }}>{title}</Text>
        ) : (
          <Text style={{ fontSize: 12, color: colors.textMuted, letterSpacing: 1 }}>HEALTHYLIFE</Text>
        )}
      </View>
      {isAuthenticated ? (
        <View style={{ alignItems: "flex-end", gap: 4 }}>
          <Text style={{ fontSize: 12, color: colors.textMuted }} numberOfLines={1}>
            {user?.fullName}
          </Text>
          <TouchableOpacity onPress={handleLogout} hitSlop={8}>
            <Text style={{ fontWeight: "700", color: colors.green800 }}>Keluar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={{ fontWeight: "700", color: colors.green800 }}>Masuk</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
