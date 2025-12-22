"use client";
import { useState } from "react";

export default function Home() {
  const API_URL = "https://rolescope-backend.onrender.com";

  const [file, setFile] = useState<File | null>(null);
  const [ilan, setIlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!file) {
      alert("Lütfen CV yükle");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("cv", file);
    formData.append("ilan", ilan);

    try {
      const res = await fetch(API_URL + "/analiz-et", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      if (!text) throw new Error("Backend boş yanıt döndü");

      const data = JSON.parse(text);
      setResult(data);

    } catch (e: any) {
      alert("Hata: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>RoleScope AI</h1>

      <div style={{ marginTop: 16 }}>
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <textarea
          placeholder="İş ilanı (opsiyonel)"
          value={ilan}
          onChange={(e) => setIlan(e.target.value)}
          rows={5}
          style={{ width: "100%" }}
        />
      </div>

      <button onClick={handleAnalyze} disabled={loading} style={{ marginTop: 16 }}>
        {loading ? "Analiz Ediliyor..." : "Sonuçları Göster"}
      </button>

      {result && (
        <pre style={{ marginTop: 24 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  );
}
