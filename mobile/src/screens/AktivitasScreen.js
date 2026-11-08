import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { activitiesApi } from "../api/client";
import { useAuth } from "../context/AuthContext";
import MobileHeader from "../components/MobileHeader";
import { common } from "../styles/common";
import { colors } from "../theme";

const activityTypes = [
  { value: "jalan_kaki", label: "Jalan kaki" },
  { value: "peregangan", label: "Peregangan" },
  { value: "lari", label: "Lari" },
  { value: "bersepeda", label: "Bersepeda" },
  { value: "lainnya", label: "Lainnya" },
];

const intensities = [
  { value: "ringan", label: "Ringan" },
  { value: "sedang", label: "Sedang" },
  { value: "berat", label: "Berat" },
];

export default function AktivitasScreen({ navigation }) {
  const { isAuthenticated } = useAuth();
  const [weekly, setWeekly] = useState({ totalMinutes: 0, days: [] });
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({
    type: "jalan_kaki",
    date: new Date().toISOString().slice(0, 10),
    durationMinutes: "20",
    intensity: "ringan",
    notes: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      activitiesApi.weekly().then(setWeekly);
      activitiesApi.list().then((r) => setHistory(r.items));
    } else {
      activitiesApi.weeklyPreview().then((p) => setWeekly({ totalMinutes: p.totalMinutes, days: p.days }));
    }
  }, [isAuthenticated]);

  async function save() {
    try {
      await activitiesApi.create({
        ...form,
        durationMinutes: Number(form.durationMinutes),
      });
      Alert.alert("Berhasil", "Aktivitas tersimpan");
      const w = await activitiesApi.weekly();
      setWeekly(w);
      const list = await activitiesApi.list();
      setHistory(list.items);
      setForm({ ...form, notes: "" });
    } catch (e) {
      Alert.alert("Gagal", e.message || "Tidak bisa menyimpan aktivitas");
    }
  }

  const maxBar = Math.max(...weekly.days.map((d) => d.minutes), 1);

  return (
    <ScrollView style={common.screen} contentContainerStyle={common.content}>
      <MobileHeader navigation={navigation} title="Aktivitasmu" />
      <View style={[common.card, { padding: 16 }]}>
        <Text style={{ color: colors.textMuted }}>Minggu ini</Text>
        <Text style={{ fontSize: 22, fontWeight: "700", marginVertical: 8 }}>
          {weekly.totalMinutes} menit bergerak
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
          {weekly.days.map((d, i) => (
            <View key={i} style={{ alignItems: "center", flex: 1 }}>
              <View
                style={{
                  width: 20,
                  height: Math.max(8, (d.minutes / maxBar) * 60),
                  backgroundColor: colors.green700,
                  borderRadius: 4,
                  marginBottom: 4,
                }}
              />
              <Text style={{ fontSize: 10, color: colors.textMuted }}>{d.label}</Text>
            </View>
          ))}
        </View>
      </View>
      <Text style={common.sectionTitle}>Catat aktivitas</Text>
      <Text style={common.label}>Jenis aktivitas</Text>
      <View style={[common.chipRow, { marginBottom: 12 }]}>
        {activityTypes.map((t) => (
          <TouchableOpacity
            key={t.value}
            style={[common.chip, form.type === t.value && common.chipActive]}
            onPress={() => setForm({ ...form, type: t.value })}
          >
            <Text style={[common.chipText, form.type === t.value && common.chipTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={common.label}>Tanggal</Text>
      <TextInput
        style={common.input}
        value={form.date}
        onChangeText={(date) => setForm({ ...form, date })}
        placeholder="YYYY-MM-DD"
      />
      <Text style={common.label}>Intensitas</Text>
      <View style={[common.chipRow, { marginBottom: 12 }]}>
        {intensities.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[common.chip, form.intensity === opt.value && common.chipActive]}
            onPress={() => setForm({ ...form, intensity: opt.value })}
          >
            <Text style={[common.chipText, form.intensity === opt.value && common.chipTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={common.label}>Durasi (menit)</Text>
      <TextInput
        style={common.input}
        keyboardType="number-pad"
        value={form.durationMinutes}
        onChangeText={(durationMinutes) => setForm({ ...form, durationMinutes })}
      />
      <Text style={common.label}>Catatan</Text>
      <TextInput
        style={[common.input, { minHeight: 80 }]}
        multiline
        value={form.notes}
        onChangeText={(notes) => setForm({ ...form, notes })}
        placeholder="Contoh: Jalan santai di kompleks"
      />
      {isAuthenticated ? (
        <TouchableOpacity style={common.btnPrimary} onPress={save}>
          <Text style={common.btnPrimaryText}>Simpan aktivitas</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={common.btnPrimary} onPress={() => navigation.navigate("Login")}>
          <Text style={common.btnPrimaryText}>Masuk untuk menyimpan</Text>
        </TouchableOpacity>
      )}
      <Text style={common.sectionTitle}>Riwayat</Text>
      {history.length === 0 && (
        <Text style={{ color: colors.textMuted, marginBottom: 12 }}>Belum ada riwayat.</Text>
      )}
      {history.map((a) => (
        <View
          key={a._id}
          style={[common.card, { padding: 12, flexDirection: "row", justifyContent: "space-between" }]}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "600" }}>{a.typeLabel}</Text>
            <Text style={{ fontSize: 12, color: colors.textMuted }}>
              {a.intensity} • {a.durationMinutes} mnt
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
