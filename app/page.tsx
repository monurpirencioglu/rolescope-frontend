"use client";
import { useState } from "react";

// Backend URL (Senin backend reponun adresi)
const API_URL = "https://rolescope-backend.vercel.app"; 

// Kariyer Pusulası için 12 Soru
const QUESTIONS = [
  "Karmaşık bir problemle karşılaştığında ilk tepkin ne olur?",
  "Bir grup projesinde genellikle hangi rolü üstlenirsin?",
  "Seni en çok ne motive eder? (Para, başarı, özgürlük vb.)",
  "Baskı altında çalışma performansın nasıldır?",
  "Yeni bir şey öğrenirken izlediğin yöntem nedir?",
  "Risk alma konusunda kendini nerede görüyorsun?",
  "İş hayatında en tahammül edemediğin durum nedir?",
  "Beş yıl sonra kendini nerede görüyorsun?",
  "Detaylara mı odaklanırsın yoksa büyük resme mi?",
  "Eleştiri aldığında nasıl karşılık verirsin?",
  "Rutin işleri mi seversin yoksa değişken projeleri mi?",
  "Başarısız olduğunda nasıl toparlanırsın?"
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"cv" | "dna">("cv");
  
  // Ortak State'ler
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // CV Analiz State'leri
  const [jobDesc, setJobDesc] = useState("");
  const [cvResult, setCvResult] = useState<any>(null);

  // DNA Analiz State'leri
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [dnaResult, setDnaResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleAnswerChange = (index: number, val: string) => {
    setAnswers(prev => ({ ...prev, [index]: val }));
  };

  // 1. Fonksiyon: CV Analizi Yap (/analiz-et)
  const runCvAnalysis = async () => {
    if (!file) { alert("Lütfen CV yükleyin!"); return; }
    
    setLoading(true); setError(""); setCvResult(null);
    const formData = new FormData();
    formData.append("cv", file);
    formData.append("ilan", jobDesc);

    try {
      const res = await fetch(`${API_URL}/analiz-et`, {
        method: "POST",
        body: formData
      });
      if (!res.ok) throw new Error("Sunucu hatası oluştu.");
      const data = await res.json();
      setCvResult(data);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // 2. Fonksiyon: Kariyer Pusulası (/analiz-dna)
  const runDnaAnalysis = async () => {
    // 12 sorunun hepsi cevaplandı mı kontrolü (opsiyonel ama iyi olur)
    if (Object.keys(answers).length < 12) {
      alert("Lütfen tüm soruları cevaplayın.");
      return;
    }

    setLoading(true); setError(""); setDnaResult(null);
    const formData = new FormData();
    
    // Backend answers'ı string olarak bekliyor, JSON.stringify şart!
    formData.append("answers", JSON.stringify(answers));
    
    // CV varsa ekle, yoksa ekleme (Backend handle ediyor)
    if (file) {
      formData.append("cv", file);
    }

    try {
      const res = await fetch(`${API_URL}/analiz-dna`, {
        method: "POST",
        body: formData
      });
      if (!res.ok) throw new Error("Sunucu hatası oluştu.");
      const data = await res.json();
      setDnaResult(data);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <header className="header">
        <h1>🔭 RoleScope AI</h1>
        <p>Yapay Zeka Destekli Kariyer Mimarı</p>
      </header>

      {/* TAB BUTONLARI */}
      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'cv' ? 'active' : ''}`}
          onClick={() => { setActiveTab('cv'); setError(""); }}
        >
          📄 İş Başvurusu Analizi
        </button>
        <button 
          className={`tab-btn ${activeTab === 'dna' ? 'active' : ''}`}
          onClick={() => { setActiveTab('dna'); setError(""); }}
        >
          🧬 Kariyer Pusulası (DNA)
        </button>
      </div>

      <div className="card">
        {/* === MOD 1: CV ANALİZİ === */}
        {activeTab === 'cv' && (
          <div className="fade-in">
            <div className="form-group">
              <label>1. CV'nizi Yükleyin (PDF/Word)</label>
              <input type="file" onChange={handleFileChange} accept=".pdf,.docx" />
            </div>
            <div className="form-group">
              <label>2. İş İlanı Metni (Opsiyonel)</label>
              <textarea 
                placeholder="Başvurduğunuz ilanı buraya yapıştırın..." 
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
              />
            </div>
            <button className="action-btn" onClick={runCvAnalysis} disabled={loading}>
              {loading ? "Analiz Yapılıyor..." : "🚀 Uyum Analizini Başlat"}
            </button>
          </div>
        )}

        {/* === MOD 2: KARİYER PUSULASI === */}
        {activeTab === 'dna' && (
          <div className="fade-in">
             <div className="form-group">
              <label>CV'niz (Varsa - Analizi Güçlendirir)</label>
              <input type="file" onChange={handleFileChange} accept=".pdf,.docx" />
            </div>
            
            <h3>Kariyer Kişilik Testi (12 Soru)</h3>
            {QUESTIONS.map((q, i) => (
              <div key={i} className="question-box">
                <label>{i + 1}. {q}</label>
                <input 
                  type="text" 
                  placeholder="Cevabınız..."
                  style={{marginTop: '5px'}}
                  onChange={(e) => handleAnswerChange(i, e.target.value)}
                />
              </div>
            ))}
            
            <button className="action-btn" onClick={runDnaAnalysis} disabled={loading}>
              {loading ? "Kişilik Analizi Yapılıyor..." : "🧬 Kariyer DNA'mı Çıkar"}
            </button>
          </div>
        )}
      </div>

      {/* HATA MESAJI */}
      {error && <div className="error-box" style={{color: 'red', textAlign: 'center', marginTop: '20px'}}>{error}</div>}

      {/* === SONUÇ EKRANI: CV === */}
      {cvResult && activeTab === 'cv' && (
        <div className="card result-box">
          <div className="score-circle">
            <div>Uyum Skoru</div>
            <div className="score">%{cvResult.uyum_skoru?.toplam || 0}</div>
          </div>
          
          <h3 className="section-title">💪 Güçlü Yönler</h3>
          <ul>
            {cvResult.guclu_yonler?.map((item: string, i: number) => <li key={i}>{item}</li>)}
          </ul>

          <h3 className="section-title">⚠️ Gelişim Alanları</h3>
          <ul>
            {cvResult.zayif_yonler?.map((item: string, i: number) => <li key={i}>{item}</li>)}
          </ul>

           <h3 className="section-title">💡 İyileştirme Önerileri</h3>
          <ul>
            {cvResult.iyilestirme_onerileri?.map((item: string, i: number) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      )}

      {/* === SONUÇ EKRANI: DNA === */}
      {dnaResult && activeTab === 'dna' && (
        <div className="card result-box">
          <h2 style={{color: '#818cf8', textAlign: 'center'}}>Senin Kariyer Arketipin: {dnaResult.arketip_profili?.ana}</h2>
          
          <div style={{background: '#334155', padding: '15px', borderRadius: '8px', margin: '20px 0'}}>
            {dnaResult.karakter_ozeti}
          </div>

          <h3 className="section-title">🗺️ Kariyer Stratejisi</h3>
          <p><strong>1 Yıl:</strong> {dnaResult.kariyer_stratejisi?.["1_yil"]}</p>
          <p><strong>3 Yıl:</strong> {dnaResult.kariyer_stratejisi?.["3_yil"]}</p>
          <p><strong>5 Yıl:</strong> {dnaResult.kariyer_stratejisi?.["5_yil"]}</p>
        </div>
      )}
    </main>
  );
}
