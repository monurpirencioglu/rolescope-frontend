"use client";

import { useState } from "react";

export default function Home() {
  const API_URL = "https://rolescope-backend.onrender.com";

  const [file, setFile] = useState<File | null>(null);
  const [ilan, setIlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const formData = new FormData();

      // CV varsa ekle
      if (file) {
        formData.append("cv", file);
        formData.append("ilan", ilan || "Genel değerlendirme yap");
      }

      // CV yoksa ENGELLE (kritik fix)
      if (!file) {
        throw new Error("Lütfen bir CV dosyası yükleyin.");
      }

      const res = await fetch(`${API_URL}/analiz-et`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Backend hata döndü");
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.detail || "Analiz sırasında hata oluştu");
      }

      setResult(data);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h1>RoleScope AI</h1>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <textarea
        placeholder="İş ilanı (opsiyonel)"
        value={ilan}
        onChange={(e) => setIlan(e.target.value)}
        style={{ width: "100%", marginTop: 12 }}
      />

      <button
        onClick={handleAnalyze}
        disabled={loading}
        style={{ marginTop: 12 }}
      >
        {loading ? "Analiz Ediliyor..." : "Sonuçları Göster"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: 12 }}>
          ❌ {error}
        </p>
      )}

      {result && (
        <pre style={{ marginTop: 20, background: "#f5f5f5", padding: 16 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
