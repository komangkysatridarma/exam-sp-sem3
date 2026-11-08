import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { contentApi } from "../api/client";
import { useAuth } from "../context/AuthContext";
import MobileHeader from "../components/MobileHeader";
import { common } from "../styles/common";
import { colors } from "../theme";

const chips = ["semua", "artikel", "video", "olahraga", "nutrisi"];

export default function JelajahScreen({ navigation }) {
  const { guest } = useAuth();
  const [category, setCategory] = useState("semua");
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => {
      contentApi.list({ category, q: q || undefined }).then((r) => setItems(r.items));
    }, 200);
    return () => clearTimeout(t);
  }, [category, q]);

  return (
    <ScrollView style={common.screen} contentContainerStyle={common.content}>
      <MobileHeader navigation={navigation} title="Jelajah" />
      <Text style={common.subtitle}>Pengetahuan baik, kebiasaan lebih baik.</Text>
      <TextInput
        style={common.input}
        placeholder="Cari topik, artikel, atau panduan"
        value={q}
        onChangeText={setQ}
      />
      <View style={common.chipRow}>
        {chips.map((c) => (
          <TouchableOpacity
            key={c}
            style={[common.chip, category === c && common.chipActive]}
            onPress={() => setCategory(c)}
          >
            <Text style={[common.chipText, category === c && common.chipTextActive]}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {items.map((item) => (
        <TouchableOpacity
          key={item._id}
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
      {guest && (
        <View style={common.guestBanner}>
          <Text style={common.guestText}>Masuk untuk menyimpan favorit.</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={{ color: colors.green800, fontWeight: "700" }}>Masuk</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
