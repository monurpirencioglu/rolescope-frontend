"use client";

import { useState } from "react";

export default function Home() {
  const API_URL = "https://rolescope-backend.onrender.com";

  const [file, setFile] = useState<File | null>(null);
  const [ilan, setIlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    if (file) formData.append("cv", file);
    formData.append("ilan", ilan);

    try {
      const res = await fetch(`${API_URL}/analiz-et`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Backend hata döndü");
      }

      const data = await res.json();
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

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <br /><br />

      <textarea
        placeholder="İş ilanı (opsiyonel)"
        value={ilan}
        onChange={(e) => setIlan(e.target.value)}
        style={{ width: "100%", height: 120 }}
      />

      <br /><br />

      <button onClick={handleAnalyze} disabled={loading}>
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
