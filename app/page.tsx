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
      if (!text) throw new Error("Boş yanıt");

      const data = JSON.parse(text);
      setResult(data);

    } catch (err: any) {
      alert("Hata: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 40, maxWidth: 800 }}>
      <h1>RoleScope AI</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <textarea
          placeholder="İş ilanını buraya yapıştır (opsiyonel)"
          value={ilan}
          onChange={(e) => setIlan(e.target.value)}
          rows={6}
          style={{ width: "100%" }}
        />
      </div>

      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? "Analiz Ediliyor..." : "Sonuçları Göster"}
      </button>

      {result && (
        <pre style={{ marginTop: 30 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  );
}
