import { useCallback, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { contentApi, favoritesApi } from "../api/client";
import { useAuth } from "../context/AuthContext";
import MobileHeader from "../components/MobileHeader";
import { common } from "../styles/common";

export default function FavoritScreen({ navigation }) {
  const { isAuthenticated, guest } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      const load = isAuthenticated
        ? favoritesApi.list().then((r) => r.items)
        : contentApi.list().then((r) => r.items.slice(0, 3));
      load
        .then((list) => {
          if (active) setItems(list);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
    }, [isAuthenticated])
  );

  return (
    <ScrollView style={common.screen} contentContainerStyle={common.content}>
      <MobileHeader navigation={navigation} title="Favoritmu" />
      {guest && <Text style={common.subtitle}>Pratinjau setelah masuk — data contoh</Text>}
      <View style={common.statsCard}>
        <Text style={common.statsNum}>{items.length}</Text>
        <Text style={common.statsLabel}>artikel tersimpan</Text>
      </View>
      {loading && <Text style={common.subtitle}>Memuat…</Text>}
      {!loading && items.length === 0 && isAuthenticated && (
        <Text style={common.subtitle}>Belum ada favorit. Buka artikel lalu tap Simpan.</Text>
      )}
      {items.map((item) => (
        <TouchableOpacity
          key={String(item._id)}
          style={common.card}
          onPress={() => navigation.navigate("ArtikelDetail", { id: String(item._id) })}
        >
          <Image source={{ uri: item.imageUrl }} style={common.cardImage} />
          <View style={common.cardBody}>
            <Text style={common.cardCat}>{(item.category || "").toUpperCase()}</Text>
            <Text style={common.cardTitle}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      ))}
      {!isAuthenticated && (
        <TouchableOpacity style={common.btnPrimary} onPress={() => navigation.navigate("Login")}>
          <Text style={common.btnPrimaryText}>Masuk untuk menyimpan favorit</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
