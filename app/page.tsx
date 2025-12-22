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
      alert("Lütfen CV yükleyin");
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
    <div style={{ padding: 20 }}>
      <h1>RoleScope AI</h1>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <br /><br />

      <textarea
        placeholder="İş ilanı (opsiyonel)"
        value={ilan}
        onChange={(e) => setIlan(e.target.value)}
        rows={4}
        style={{ width: "100%" }}
      />

      <br /><br />

      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? "Analiz Ediliyor..." : "Sonuçları Göster"}
      </button>

      {result && (
        <pre style={{ marginTop: 20 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
