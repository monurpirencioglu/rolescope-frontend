"use client";
import { useState } from "react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function Home() {
  const API_URL = "https://rolescope-backend.onrender.com";

  const [file, setFile] = useState<File | null>(null);
  const [ilan, setIlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"cv" | "dna">("cv");
  const [answers, setAnswers] = useState<any>({});

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    if (file) formData.append("cv", file);

    if (activeTab === "cv") {
      formData.append("ilan", ilan);
    } else {
      formData.append("answers", JSON.stringify(answers));
    }

    try {
      const endpoint = activeTab === "cv" ? "/analiz-et" : "/analiz-dna";
      const res = await fetch(API_URL + endpoint, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Backend hata döndü (${res.status})`);
      }

      const text = await res.text();
      if (!text) {
        throw new Error("Backend boş yanıt döndü");
      }

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

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
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
