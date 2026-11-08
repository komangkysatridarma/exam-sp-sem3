import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity } from "react-native";
import { contentApi, favoritesApi } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { common } from "../styles/common";
import { colors } from "../theme";

export default function ArtikelDetailScreen({ route, navigation }) {
  const contentId = String(route.params.id);
  const { isAuthenticated, guest } = useAuth();
  const [item, setItem] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    contentApi.byId(contentId).then((r) => setItem(r.item));
    if (isAuthenticated) {
      favoritesApi
        .list()
        .then((r) => setSaved(r.items.some((f) => String(f._id) === contentId)));
    } else {
      setSaved(false);
    }
  }, [contentId, isAuthenticated]);

  async function toggleSave() {
    if (!isAuthenticated) {
      navigation.navigate("Login");
      return;
    }
    try {
      if (saved) {
        await favoritesApi.remove(contentId);
        setSaved(false);
        Alert.alert("Favorit", "Artikel dihapus dari favorit");
      } else {
        await favoritesApi.add(contentId);
        setSaved(true);
        Alert.alert("Favorit", "Artikel tersimpan di favorit");
      }
    } catch (e) {
      Alert.alert("Gagal", e.message || "Tidak bisa menyimpan favorit");
    }
  }

  if (!item) {
    return (
      <ScrollView style={common.screen} contentContainerStyle={common.content}>
        <Text>Memuat…</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={common.screen} contentContainerStyle={[common.content, { paddingBottom: 40 }]}>
      <Image source={{ uri: item.imageUrl }} style={{ width: "100%", height: 200, borderRadius: 16 }} />
      <Text style={[common.cardCat, { marginTop: 12 }]}>
        {(item.category || "").toUpperCase()} • {item.readMinutes} menit baca
      </Text>
      <Text style={{ fontSize: 22, fontWeight: "700", marginVertical: 8 }}>{item.title}</Text>
      <Text style={{ color: colors.textMuted, marginBottom: 12 }}>{item.author}</Text>
      {item.rememberBox && (
        <Text style={{ backgroundColor: colors.green50, padding: 12, borderRadius: 12, marginBottom: 12 }}>
          {item.rememberBox}
        </Text>
      )}
      <Text style={{ lineHeight: 22 }}>{item.body || item.excerpt}</Text>
      {guest || !isAuthenticated ? (
        <TouchableOpacity style={common.btnPrimary} onPress={() => navigation.navigate("Login")}>
          <Text style={common.btnPrimaryText}>Masuk untuk menyimpan</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={common.btnPrimary} onPress={toggleSave}>
          <Text style={common.btnPrimaryText}>{saved ? "★ Tersimpan di favorit" : "☆ Simpan ke favorit"}</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
