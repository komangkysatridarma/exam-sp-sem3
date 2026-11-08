import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity } from "react-native";
import { authApi } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { common } from "../styles/common";

export default function LoginScreen({ navigation }) {
  const { login, exploreAsGuest } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    try {
      const data = await authApi.login({ email, password });
      await login(data.token, data.user);
      navigation.navigate("Main");
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <ScrollView style={common.screen} contentContainerStyle={common.content}>
      <Text style={common.title}>Senang kamu kembali</Text>
      <Text style={common.subtitle}>Masuk untuk melanjutkan favorit dan aktivitasmu.</Text>
      <Text style={common.label}>Alamat email</Text>
      <TextInput
        style={common.input}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <Text style={common.label}>Kata sandi</Text>
      <TextInput style={common.input} secureTextEntry value={password} onChangeText={setPassword} />
      {!!error && <Text style={{ color: "#b3261e" }}>{error}</Text>}
      <TouchableOpacity style={common.btnPrimary} onPress={submit}>
        <Text style={common.btnPrimaryText}>Masuk</Text>
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
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={{ textAlign: "center", marginTop: 16 }}>Belum punya akun? Daftar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
