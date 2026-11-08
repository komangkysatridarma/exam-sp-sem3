import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { authApi } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { common } from "../styles/common";

export default function RegisterScreen({ navigation }) {
  const { login, exploreAsGuest } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    if (!form.agree) {
      setError("Setujui syarat penggunaan terlebih dahulu");
      return;
    }
    try {
      const data = await authApi.register(form);
      await login(data.token, data.user);
      navigation.navigate("Main");
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <ScrollView style={common.screen} contentContainerStyle={common.content}>
      <Text style={common.title}>Mulai kebiasaan baikmu</Text>
      <Text style={common.subtitle}>Buat akun untuk menyimpan favorit dan aktivitas.</Text>
      <Text style={common.label}>Nama lengkap</Text>
      <TextInput
        style={common.input}
        placeholder="Nama yang ingin ditampilkan"
        value={form.fullName}
        onChangeText={(fullName) => setForm({ ...form, fullName })}
      />
      <Text style={common.label}>Alamat email</Text>
      <TextInput
        style={common.input}
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={(email) => setForm({ ...form, email })}
      />
      <Text style={common.label}>Kata sandi</Text>
      <TextInput
        style={common.input}
        secureTextEntry
        value={form.password}
        onChangeText={(password) => setForm({ ...form, password })}
      />
      <Text style={common.label}>Konfirmasi kata sandi</Text>
      <TextInput
        style={common.input}
        secureTextEntry
        value={form.confirmPassword}
        onChangeText={(confirmPassword) => setForm({ ...form, confirmPassword })}
      />
      <TouchableOpacity onPress={() => setForm({ ...form, agree: !form.agree })}>
        <Text style={{ fontSize: 12, color: "#5c6560", marginBottom: 8 }}>
          {form.agree ? "☑" : "☐"} Saya menyetujui syarat penggunaan HealthyLife
        </Text>
      </TouchableOpacity>
      {!!error && <Text style={{ color: "#b3261e" }}>{error}</Text>}
      <TouchableOpacity style={common.btnPrimary} onPress={submit}>
        <Text style={common.btnPrimaryText}>Buat akun</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={{ textAlign: "center", marginTop: 16 }}>Sudah punya akun? Masuk</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={common.btnSecondary}
        onPress={async () => {
          await exploreAsGuest();
          navigation.navigate("Main");
        }}
      >
        <Text>Jelajahi sebagai tamu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
