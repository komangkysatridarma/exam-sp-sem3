import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { contentApi } from "../api/client";
import { useAuth } from "../context/AuthContext";
import MobileHeader from "../components/MobileHeader";
import { common } from "../styles/common";
import { colors } from "../theme";

function ArticleCard({ item, navigation, horizontal }) {
  return (
    <TouchableOpacity
      style={[common.card, horizontal && { width: 280 }]}
      onPress={() => navigation.navigate("ArtikelDetail", { id: String(item._id) })}
    >
      <Image source={{ uri: item.imageUrl }} style={common.cardImage} />
      <View style={common.cardBody}>
        <Text style={common.cardCat}>{(item.category || "").toUpperCase()}</Text>
        <Text style={common.cardTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function BerandaScreen({ navigation }) {
  const { user, guest } = useAuth();
  const [editorPick, setEditorPick] = useState(null);
  const [light, setLight] = useState([]);

  useEffect(() => {
    contentApi.list({ editorPick: "true" }).then((r) => setEditorPick(r.items[0]));
    contentApi.list({ category: "olahraga" }).then((r) => setLight(r.items));
  }, []);

  return (
    <ScrollView style={common.screen} contentContainerStyle={common.content}>
      <MobileHeader navigation={navigation} />
      <Text style={{ fontSize: 12, color: colors.textMuted }}>SELAMAT PAGI, TEMAN SEHAT</Text>
      <Text style={common.title}>Sehat dimulai dari hal kecil.</Text>
      {guest && (
        <View style={common.guestBanner}>
          <Text style={common.guestText}>Kamu menjelajah sebagai tamu.</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={{ fontWeight: "700", color: colors.green800 }}>Masuk</Text>
          </TouchableOpacity>
        </View>
      )}
      <Text style={common.sectionTitle}>Pilihan hari ini</Text>
      {editorPick && <ArticleCard item={editorPick} navigation={navigation} />}
      <Text style={common.sectionTitle}>Mulai dari yang ringan</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {light.map((item) => (
          <View key={item._id} style={{ marginRight: 12 }}>
            <ArticleCard item={item} navigation={navigation} horizontal />
          </View>
        ))}
      </ScrollView>
      {!user && (
        <TouchableOpacity style={common.btnPrimary} onPress={() => navigation.navigate("Register")}>
          <Text style={common.btnPrimaryText}>Buat akun</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
