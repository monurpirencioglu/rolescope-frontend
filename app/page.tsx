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
  const [activeTab, setActiveTab] = useState("cv");
  const [answers, setAnswers] = useState<any>({});
  const [testCompleted, setTestCompleted] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);

    if (window.gtag) {
      window.gtag("event", activeTab === "cv" ? "cv_analysis_started" : "dna_analysis_started");
    }

    const formData = new FormData();
    if (file) formData.append("cv", file);

    if (activeTab === "cv") {
      formData.append("ilan", ilan);
    } else {
      formData.append("answers", JSON.stringify(answers));
    }

    try {
      const endpoint = activeTab === "cv" ? "/analiz-et" : "/analiz-dna";
      const res = await fetch(API_URL + endpoint, { method: "POST", body: formData });

      const text = await res.text();
      if (!text) throw new Error("Backend boş yanıt döndü");

      const data = JSON.parse(text);
      if (data.error) throw new Error(data.message);

      setResult(data);

      if (window.gtag) {
        window.gtag("event", "analysis_success", { type: activeTab });
      }

    } catch (e: any) {
      alert("Hata: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>RoleScope AI</h1>
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? "Analiz Ediliyor..." : "Sonuçları Göster"}
      </button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
