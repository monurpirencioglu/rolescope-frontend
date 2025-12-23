"use client";
import { useState, useEffect } from 'react';

import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, RadialLinearScale,
  PointElement, LineElement, Filler
} from 'chart.js';
import { Doughnut, Radar } from 'react-chartjs-2';

import {
  ShieldAlert, TrendingUp, CheckCircle2, FileText, Layers, User,
  ArrowRight, UploadCloud, DollarSign, Award, Crown, Unlock, Lightbulb 
} from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler);

const loadingMessages = [
  "CV'ndeki teknik satır araları okunuyor...",
  "Performans Psikoloğu karakter testindeki zihinsel kalıpları ağırlıklandırıyor...",
  "Potansiyel Avcısı, geçmişin ile gelecekteki 'en iyi versiyonun' arasındaki bağı kuruyor...",
  "Mülakat kozların ve risk analizin hazırlanıyor...",
  "Stratejik yol haritan nihai formuna kavuşturuluyor..."
];

export default function Home() {
  const API_URL = "https://rolescope-backend.onrender.com";

  const [file, setFile] = useState<File | null>(null);
  const [ilan, setIlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("cv");
  const [messageIndex, setMessageIndex] = useState(0);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [testCompleted, setTestCompleted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const questions = [
    { id: 1, text: "Belirsiz bir durumla karşılaştığında ilk tepkin ne olur?", options: ["Hemen aksiyon alır, yolda düzeltirim (Hız Odaklı).", "Önce tüm verileri toplar, analiz ederim (Analitik).", "Ekibimle konuşur, ortak karar alırım (Demokratik).", "Yöneticimden net talimat beklerim (Hiyerarşik)."] },
    { id: 2, text: "Seni en çok ne motive eder?", options: ["Zor ve karmaşık problemleri çözmek.", "İnsanlara yardım etmek ve mentörlük.", "Net, ölçülebilir başarılar ve yüksek kazanç.", "Sistemi kurmak, optimize etmek ve düzeni sağlamak."] },
    { id: 3, text: "Çatışma anında nasıl davranırsın?", options: ["Kendi fikrimi verilerle sonuna kadar savunurum.", "Orta yolu bulmaya çalışır, gerginliği alırım.", "Duyguları kenara bırakır, sadece işe odaklanırım.", "Ortamın sakinleşmesini bekler, sonra konuşurum."] },
    { id: 4, text: "Hangi çalışma ortamı sana daha uygun?", options: ["Hızlı, kaotik, sürekli değişen (Startup Kültürü).", "Kuralları belli, net süreçleri olan (Kurumsal).", "Özgür, saatten bağımsız, sonuç odaklı (Remote/Freelance).", "Sessiz, odaklanmaya müsait, derin iş (Ar-Ge)."] },
    { id: 5, text: "Bir projede en sevdiğin aşama hangisidir?", options: ["Fikir bulma ve strateji (Vizyoner).", "Planlama ve mimariyi kurma (Mimar).", "Uygulama ve kodlama (Operasyonel).", "Test etme ve mükemmelleştirme (Detaycı)."] },
    { id: 6, text: "Risk alma yaklaşımın nedir?", options: ["Büyük risk, büyük ödül. Kaybetmekten korkmam.", "Hesaplanmış riskleri alırım, B planım vardır.", "Mevcut yapıyı korumak benim için daha önemlidir.", "Riskten kaçınır, garanti ve denenmiş yolları seçerim."] },
    { id: 7, text: "Yöneticinden sert bir olumsuz geri bildirim (feedback) aldığında ne yaparsın?", options: ["Önce savunmaya geçerim, haksızlık yapıldığını düşünürüm.", "Duygusal olarak düşerim ama sonra toparlarım.", "Teşekkür eder, hemen düzeltmek için plan yaparım (Gelişim Odaklı).", "Verilerle hatanın bende olmadığını kanıtlamaya çalışırım."] },
    { id: 8, text: "Zaman çok kısıtlı ve elinde yeterli veri yok. Kritik bir karar vermen lazım. Ne yaparsın?", options: ["İçgüdülerime ve tecrübeme güvenir, kararı veririm.", "Kararı erteler, ne pahasına olursa olsun veri bulmaya çalışırım.", "Hızlıca küçük bir deney (test) yapar, sonuca göre ilerlerim.", "Sorumluluğu tek başıma almaz, ekibe veya yöneticiye danışırım."] },
    { id: 9, text: "Yeni ve zor bir teknoloji/konu öğrenmen gerektiğinde yöntemin nedir?", options: ["Dokümantasyonu baştan sona okurum (Teorik).", "Hemen bir proye yapmaya başlar, hata yaparak öğrenirim (Pratik).", "Bilen birine sorar veya eğitim videosu izlerim (Görsel/İşitsel).", "Önce mantığını kavrar, sonra detaylara inerim (Bütüncül)."] },
    { id: 10, text: "Bir takım içinde genellikle hangi rolü üstlenirsin?", options: ["Liderlik eden ve yön gösteren (Kaptan).", "Ortamı yumuşatan ve bağları kuran (Diplomat).", "Eksikleri gören ve eleştirel bakan (Kalite Kontrol).", "Verilen görevi sessizce ve eksiksiz yapan (Uygulayıcı)."] },
    { id: 11, text: "Seni iş hayatında en çok ne 'tüketir' (Burnout sebebi)?", options: ["Mikro yönetim ve sürekli kontrol edilmek.", "Yaptığım işin anlamsız olduğunu hissetmek.", "Aşırı belirsizlik ve kaos.", "Sürekli tekrarlayan, monoton işler."] },
    { id: 12, text: "Günün sonunda 'Bugün harika bir iş çıkardım' demeni sağlayan şey nedir?", options: ["Listemdeki tüm maddeleri bitirmek (Tamamlama Hissi).", "Çözülemeyen zor bir sorunu çözmek (Zafer Hissi).", "Ekibimden veya yöneticimden övgü almak (Takdir Hissi).", "Yeni ve yaratıcı bir şey ortaya koymak (Yaratıcılık Hissi)."] }
  ];

  const handleOptionSelect = (option: any) => {
    setAnswers({ ...answers, [`Soru ${questions[currentQuestion].id}`]: option });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setTestCompleted(true);
    }
  };

  const handleAnalyze = async () => {
    if (!file && activeTab === "cv") return alert("Lütfen CV yükleyin.");
    setLoading(true);
    setResult(null);
    const formData = new FormData();
    if (file) formData.append("cv", file);
    if (activeTab === "cv") formData.append("ilan", ilan);
    else formData.append("answers", JSON.stringify(answers));

    try {
      const endpoint = activeTab === "cv" ? "/analiz-et" : "/analiz-dna";
      const response = await fetch(`${API_URL}${endpoint}`, { method: "POST", body: formData });
      const data = await response.json();
      setResult(data);

      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag('event', 'analysis_success', { 'event_label': activeTab });
      }
    } catch (error) {
      alert("Hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreData = (score: number) => ({
    labels: ['Uyum', 'Eksik'],
    datasets: [{ data: [score, 100 - score], backgroundColor: ['#0f172a', '#e2e8f0'], borderWidth: 0 }]
  });

  const getRadarData = (kirilimlar: any) => ({
    labels: ['Teknik', 'ATS Uyumu', 'Deneyim', 'Somut Çıktı'],
    datasets: [{
      label: 'Profil Analizi',
      data: [kirilimlar?.teknik_yetkinlik || 0, kirilimlar?.ats_uyumu || 0, kirilimlar?.deneyim_seniority || 0, kirilimlar?.proje_odaklilik || 0],
      backgroundColor: 'rgba(15, 23, 42, 0.2)', borderColor: '#0f172a', borderWidth: 2, pointBackgroundColor: '#fff'
    }]
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-slate-200">
      
      {loading && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
          <div className="loader-ring mb-8"></div>
          <div className="h-24 flex items-center justify-center">
            <p className="text-xl md:text-3xl font-medium text-slate-800 max-w-2xl animate-loading-text">
              {loadingMessages[messageIndex]}
            </p>
          </div>
          <p className="mt-8 text-slate-400 text-sm font-medium tracking-widest uppercase">Analiz Katmanları İşleniyor...</p>
        </div>
      )}

      <div className="bg-slate-900 text-white text-center py-3 px-4 text-xs font-medium tracking-wide relative z-[60] flex items-center justify-center gap-2">
        <span className="bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">BETA</span>
        <span>🚀 RoleScope AI: <span className="text-emerald-400 font-bold">Premium Kariyer Analizi & Maaş Stratejisi</span> sınırlı süre için ücretsiz.</span>
      </div>

      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 text-white p-2 rounded-lg"><Layers size={24} /></div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">RoleScope<span className="text-slate-400 font-light">AI</span></h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Career Intelligence</p>
            </div>
          </div>
          <div className="flex gap-4">
             <button onClick={() => { setActiveTab("cv"); setResult(null); }} className={`text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'cv' ? 'text-slate-900 bg-slate-100 px-3 py-2 rounded-lg' : 'text-slate-400 hover:text-slate-600 px-3 py-2'}`}><FileText size={16} /> CV Analizi</button>
             <button onClick={() => { setActiveTab("dna"); setResult(null); }} className={`text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'dna' ? 'text-slate-900 bg-slate-100 px-3 py-2 rounded-lg' : 'text-slate-400 hover:text-slate-600 px-3 py-2'}`}>
                <Crown size={16} className={activeTab === 'dna' ? "text-amber-500" : "text-slate-400"} /> Kariyer Pusulası
             </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-6xl">
        {!result ? (
            <div className="grid lg:grid-cols-12 gap-12">
                <div className="lg:col-span-5 space-y-6">
                    <div>
                        <h2 className="text-3xl font-light text-slate-900 mb-2 flex items-center gap-2">
                            {activeTab === 'cv' ? 'Mülakat Masasında Elini Güçlendir.' : <><span className="text-amber-500"><Crown size={28} /></span> Karakter DNA’na En Uygun Kariyer Yolunu Keşfet.</>}
                        </h2>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            {activeTab === 'cv' ? "Yapay zeka ile CV'nizi ATS standartlarına göre test edin, mülakat risklerini görün ve maaş pazarlığı için strateji geliştirin." : "Kişilik özelliklerinizi bilimsel yöntemlerle analiz ederek size en uygun çalışma ortamını ve rolü keşfedin."}
                        </p>
                    </div>

                    <div className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-xl p-8 hover:border-slate-400 transition-all group cursor-pointer relative">
                        <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className="flex flex-col items-center text-center">
                            <div className="p-4 bg-white rounded-full mb-4 shadow-sm"><UploadCloud size={24} className="text-slate-600" /></div>
                            <p className="font-medium text-slate-900">{file ? file.name : "CV Dosyasını Yükle"}</p>
                        </div>
                    </div>

                    {activeTab === 'cv' && (
                        <textarea placeholder="İş ilanı (Opsiyonel)" className="w-full h-32 p-4 border border-slate-200 rounded-xl outline-none text-sm bg-white" value={ilan} onChange={(e) => setIlan(e.target.value)} />
                    )}

                    {activeTab === 'cv' && (
                        <button onClick={handleAnalyze} className="w-full py-4 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">Analizi Başlat</button>
                    )}
                </div>

                <div className="lg:col-span-7">
                    {activeTab === 'dna' && (
                        <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                            {!testCompleted ? (
                                <div>
                                    <div className="flex justify-between items-center mb-8">
                                        <span className="text-xs font-bold tracking-widest text-amber-600 uppercase flex items-center gap-1"><Crown size={12} /> Premium Envanter</span>
                                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">{currentQuestion + 1} / 12</span>
                                    </div>
                                    <h3 className="text-xl font-medium text-slate-900 mb-8 leading-relaxed">{questions[currentQuestion].text}</h3>
                                    <div className="space-y-3">
                                        {questions[currentQuestion].options.map((option, idx) => (
                                            <button key={idx} onClick={() => handleOptionSelect(option)} className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-slate-900 transition-all text-slate-700 text-sm font-medium">{option}</button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="bg-amber-50 p-6 rounded-full mb-6"><Crown size={48} className="text-amber-500" /></div>
                                    <h3 className="text-xl font-bold text-slate-900">Profilin Hazır</h3>
                                    <button onClick={handleAnalyze} className="mt-6 px-12 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all flex items-center gap-2">Sonuçları Sentezle <ArrowRight size={16} /></button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        ) : (
          /* SONUÇ EKRANI - TÜM CSS'LER GERİ GELDİ */
          <div className="space-y-12 animate-fade-in">
            <button onClick={() => setResult(null)} className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest flex items-center gap-2">← Yeni Analiz</button>

            {activeTab === 'dna' ? (
              <div className="space-y-12">
                <div className="text-center max-w-4xl mx-auto">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase border border-slate-200 px-3 py-1 rounded-full">Kariyer Arketipi</span>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 mt-6 mb-4 leading-tight">{result.arketip_profili?.ana}</h1>
                    
                    {/* YENİ MESLEK ÖNERİLERİ - SENİN TASARIMINLA */}
                    <div className="flex flex-wrap justify-center gap-4 mt-8">
                        {result.arketip_profili?.mesleki_oneriler?.map((item: any, i: number) => (
                        <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-left min-w-[220px]">
                            <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">{item.uygunluk} Uygunluk</p>
                            <p className="text-lg font-bold text-slate-800">{item.rol}</p>
                            <p className="text-[11px] text-slate-400 italic mt-2 leading-tight">{item.neden}</p>
                        </div>
                        ))}
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-6">
                  <p className="text-2xl text-slate-700 leading-relaxed font-medium italic border-l-8 border-slate-900 pl-10 py-6 bg-white rounded-r-[3rem] shadow-sm italic">
                    "{result.karakter_ozeti}"
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {Object.entries(result.calisma_dinamigi || {}).map(([key, value]: any) => (
                    <div key={key} className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{key.replace('_', ' ')}</p>
                      <p className="text-xl font-bold leading-tight">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-slate-200 rounded-[3rem] p-12 shadow-sm">
                  <h3 className="text-3xl font-black text-slate-900 mb-10 flex items-center gap-4"><TrendingUp className="text-slate-900" size={32} /> Stratejik Yol Haritası</h3>
                  <div className="grid md:grid-cols-3 gap-12">
                    {['1_yil', '3_yil', '5_yil'].map((year) => (
                      <div key={year} className="relative">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-900 font-bold mb-4">{year[0]}</div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{year.replace('_', '. ')} HEDEFİ</h4>
                        <p className="text-slate-700 font-bold leading-relaxed">{result.kariyer_stratejisi?.[year]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
                /* CV SONUÇLARI - MEVCUT ÇALIŞAN TASARIMIN */
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Uyum Skoru</h3>
                            <div className="w-40 h-40 relative">
                                <Doughnut data={getScoreData(result.uyum_skoru?.toplam || 0)} options={{ cutout: '85%', plugins: { legend: { display: false } } }} />
                                <div className="absolute inset-0 flex items-center justify-center text-5xl font-black">{result.uyum_skoru?.toplam}</div>
                            </div>
                        </div>
                        <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Yetkinlik Analizi</h3>
                            <div className="h-56"><Radar data={getRadarData(result.uyum_skoru?.alt_kirimlar)} options={{ maintainAspectRatio: false, scales: { r: { ticks: { display: false }, grid: { color: '#f1f5f9' } } }, plugins: { legend: { display: false } } }} /></div>
                        </div>
                    </div>
                </div>
            )}
            <button onClick={() => setResult(null)} className="mx-auto block px-12 py-4 bg-slate-900 text-white rounded-full font-bold shadow-lg hover:scale-105 transition-all">Yeniden Analiz Et</button>
          </div>
        )}
      </main>
    </div>
  );
}
