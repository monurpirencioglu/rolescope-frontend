"use client";

import { useState } from "react";
import {
  FileText,
  Brain,
  Upload,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

const API_URL = "https://rolescope-backend.vercel.app";

const QUESTIONS = [
  "Karmaşık bir problemle karşılaştığında ilk tepkin ne olur?",
  "Bir grup projesinde genellikle hangi rolü üstlenirsin?",
  "Seni en çok ne motive eder?",
  "Baskı altında çalışma performansın nasıldır?",
  "Yeni bir şey öğrenirken izlediğin yöntem nedir?",
  "Risk alma konusunda kendini nerede görüyorsun?",
  "İş hayatında en tahammül edemediğin durum nedir?",
  "Beş yıl sonra kendini nerede görüyorsun?",
  "Detaylara mı yoksa büyük resme mi odaklanırsın?",
  "Eleştiri aldığında nasıl tepki verirsin?",
  "Rutin mi değişken işler mi?",
  "Başarısızlık sonrası nasıl toparlanırsın?",
];

export default function Home() {
  const [tab, setTab] = useState<"cv" | "dna">("cv");
  const [file, setFile] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState("");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const runCvAnalysis = async () => {
    if (!file) return setError("CV yüklemeden analiz yapılamaz.");

    setLoading(true);
    setError("");
    setResult(null);

    const fd = new FormData();
    fd.append("cv", file);
    fd.append("ilan", jobDesc);

    try {
      const res = await fetch(`${API_URL}/analiz-et`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.message);
      setResult(data);
    } catch (e: any) {
      setError(e.message || "Analiz başarısız");
    } finally {
      setLoading(false);
    }
  };

  const runDnaAnalysis = async () => {
    if (Object.keys(answers).length < 12)
      return setError("Tüm soruları cevaplamalısın.");

    setLoading(true);
    setError("");
    setResult(null);

    const fd = new FormData();
    fd.append("answers", JSON.stringify(answers));
    if (file) fd.append("cv", file);

    try {
      const res = await fetch(`${API_URL}/analiz-dna`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.message);
      setResult(data);
    } catch (e: any) {
      setError(e.message || "Analiz başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      {/* HEADER */}
      <header className="header">
        <h1>RoleScope AI</h1>
        <p>Hiring Manager Simülasyonu & Kariyer DNA Analizi</p>
      </header>

      {/* TABS */}
      <div className="tabs">
        <button
          className={`tab-btn ${tab === "cv" ? "active" : ""}`}
          onClick={() => setTab("cv")}
        >
          <FileText size={18} /> CV Analizi
        </button>
        <button
          className={`tab-btn ${tab === "dna" ? "active" : ""}`}
          onClick={() => setTab("dna")}
        >
          <Brain size={18} /> Kariyer DNA
        </button>
      </div>

      {/* PANEL */}
      <section className="glass-panel">
        {tab === "cv" && (
          <>
            <div className="form-group">
              <label>CV Yükle (PDF / DOCX)</label>
              <input type="file" onChange={handleFile} />
            </div>

            <div className="form-group">
              <label>İş İlanı (Opsiyonel)</label>
              <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="İlan metni buraya..."
              />
            </div>

            <button
              className="action-btn"
              disabled={loading}
              onClick={runCvAnalysis}
            >
              <Sparkles size={18} />{" "}
              {loading ? "Analiz Yapılıyor..." : "ATS & Hiring Manager Analizi"}
            </button>
          </>
        )}

        {tab === "dna" && (
          <>
            <div className="form-group">
              <label>CV (Varsa)</label>
              <input type="file" onChange={handleFile} />
            </div>

            {QUESTIONS.map((q, i) => (
              <div key={i} className="question-box">
                <label>{i + 1}. {q}</label>
                <input
                  type="text"
                  onChange={(e) =>
                    setAnswers((p) => ({ ...p, [i]: e.target.value }))
                  }
                />
              </div>
            ))}

            <button
              className="action-btn"
              disabled={loading}
              onClick={runDnaAnalysis}
            >
              <Brain size={18} />{" "}
              {loading ? "Analiz Ediliyor..." : "Kariyer DNA'mı Çöz"}
            </button>
          </>
        )}
      </section>

      {/* ERROR */}
      {error && (
        <div className="result-card glow-yellow" style={{ marginTop: 30 }}>
          <AlertTriangle /> {error}
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div className="results-container">
          <pre className="result-card glow-purple">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
