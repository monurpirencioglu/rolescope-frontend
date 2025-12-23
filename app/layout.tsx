"use client";
import { useState, useEffect } from 'react';

// Grafik kütüphaneleri
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Doughnut, Radar } from 'react-chartjs-2';

// İkon Seti
import {
  ShieldAlert,
  TrendingUp,
  CheckCircle2,
  FileText,
  Layers,
  User,
  ArrowRight,
  UploadCloud,
  DollarSign,
  Award,
  Crown,
  Unlock,
  Lightbulb
} from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler);

// === STRATEJİK YÜKLEME MESAJLARI ===
const loadingMessages = [
  "Kariyer Stratejisti CV'ndeki teknik satır aralarını okuyor...",
  "Performans Psikoloğu karakter testindeki zihinsel kalıpları ağırlıklandırıyor...",
  "Potansiyel Avcısı, geçmişin ile gelecekteki 'en iyi versiyonun' arasındaki bağı kuruyor...",
  "Silikon Vadisi standartlarında mülakat kozların hazırlanıyor...",
  "Stratejik yol haritan nihai formuna kavuşturuluyor..."
];

export default function Home() {
  const API_URL = "https://rolescope-backend.onrender.com";

  // --- STATE ---
  const [file, setFile] = useState<File | null>(null);
  const [ilan, setIlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("cv");
  const [messageIndex, setMessageIndex] = useState(0);

  // DNA Test State
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [testCompleted, setTestCompleted] = useState(false);

  // --- YÜKLEME DÖNGÜSÜ ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // --- SORU SETİ (MEVCUT SORULARIN) ---
  const questions = [
    { id: 1, text: "Belirsiz bir durumla karşılaştığında ilk tepkin ne olur?", options: ["Hemen aksiyon alır, yolda düzeltirim (Hız Odaklı).", "Önce tüm verileri toplar, analiz ederim (Analitik).", "Ekibimle konuşur, ortak karar alırım (Demokratik).", "Yöneticimden net talimat beklerim (Hiyerarşik)."] },
    { id: 2, text: "Seni en çok ne motive eder?", options: ["Zor ve karmaşık problemleri çözmek.", "İnsanlara yardım etmek ve mentörlük.", "Net, ölçülebilir başarılar ve yüksek kazanç.", "Sistemi kurmak, optimize etmek ve düzeni sağlamak."] },
    { id: 3, text: "Çatışma anında nasıl davranırsın?", options: ["Kendi fikrimi verilerle sonuna kadar savunurum.", "Orta yolu bulmaya çalışır, gerginliği alırım.", "Duyguları kenara bırakır, sadece işe odaklanırım.", "Ortamın sakinleşmesini bekler, sonra konuşurum."] },
    { id: 4, text: "Hangi çalışma ortamı sana daha uygun?", options: ["Hızlı, kaotik, sürekli değişen (Startup Kültürü).", "Kuralları belli, net süreçleri olan (Kurumsal).", "Özgür, saatten bağımsız, sonuç odaklı (Remote/Freelance).", "Sessiz, odaklanmaya müsait, derin iş (Ar-Ge)."] },
    { id: 5, text: "Bir projede en sevdiğin aşama hangisidir?", options: ["Fikir bulma ve strateji (Vizyoner).", "Planlama ve mimariyi kurma (Mimar).", "Uygulama ve kodlama (Operasyonel).", "Test etme ve mükemmelleştirme (Detaycı)."] },
    { id: 6, text: "Risk alma yaklaşımın nedir?", options: ["Büyük risk, büyük ödül. Kaybetmekten korkmam.", "Hesaplanmış riskleri alırım, B planım vardır.", "Mevcut yapıyı korumak benim için daha önemlidir.", "Riskten kaçınır, garanti ve denenmiş yolları seçerim."] },
    { id: 7, text: "Yöneticinden sert bir olumsuz geri bildirim aldığında ne yaparsın?", options: ["Önce savunmaya geçerim.", "Duygusal olarak düşerim.", "Hemen düzeltmek için plan yaparım (Gelişim Odaklı).", "Verilerle hatanın bende olmadığını kanıtlarım."] },
    { id: 8, text: "Kısıtlı zaman ve veriyle kritik karar vermen lazım. Ne yaparsın?", options: ["İçgüdülerime güvenirim.", "Ne pahasına olursa olsun veri ararım.", "Hızlıca küçük bir deney yaparım.", "Ekibe veya yöneticiye danışırım."] },
    { id: 9, text: "Yeni bir teknoloji öğrenme yöntemin nedir?", options: ["Dokümantasyonu okurum (Teorik).", "Proje yaparak öğrenirim (Pratik).", "Eğitim videosu izlerim.", "Önce mantığını kavrarım (Bütüncül)."] },
    { id: 10, text: "Takım içindeki rolün nedir?", options: ["Lider (Kaptan).", "Diplomat.", "Kalite Kontrol.", "Uygulayıcı."] },
    { id: 11, text: "Seni en çok ne 'tüketir'?", options: ["Mikro yönetim.", "İşin anlamsızlığı.", "Aşırı belirsizlik.", "Monotonluk."] },
    { id: 12, text: "Seni en çok tatmin eden şey nedir?", options: ["Listeyi bitirmek.", "Zor sorunu çözmek.", "Takdir almak.", "Yaratıcı bir şey sunmak."] }
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
    if (!file && activeTab === "cv") return alert("Lütfen CV dosyanızı yükleyin.");
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

      // --- ANALYTICS EVENT ---
      if (window.gtag) {
        window.gtag('event', 'analysis_success', { 'event_label': activeTab });
      }

    } catch (error) {
      alert("Hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  // --- GRAFİK FONKSİYONLARI ---
  const getScoreData = (score: number) => ({
    labels: ['Uyum', 'Eksik'],
    datasets: [{ data: [score, 100 - score], backgroundColor: ['#2563eb', '#e2e8f0'], borderWidth: 0 }]
  });

  const getRadarData = (kirilimlar: any) => ({
    labels: ['Teknik', 'ATS Uyumu', 'Deneyim', 'Somut Çıktı'],
    datasets: [{
      label: 'Profil Analizi',
      data: [kirilimlar?.teknik_yetkinlik || 0, kirilimlar?.ats_uyumu || 0, kirilimlar?.deneyim_seniority || 0, kirilimlar?.proje_odaklilik || 0],
      backgroundColor: 'rgba(37, 99, 235, 0.2)', borderColor: '#2563eb', borderWidth: 2, pointBackgroundColor: '#fff'
    }]
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100">

      {/* --- STRATEJİK YÜKLEME EKRANI --- */}
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

      {/* --- HEADER --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 text-white p-2 rounded-lg"><Layers size={24} /></div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">RoleScope<span className="text-slate-400 font-light">AI</span></h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold text-center">Career Intelligence</p>
            </div>
          </div>
          <div className="flex gap-4">
             <button onClick={() => { setActiveTab("cv"); setResult(null); }} className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${activeTab === 'cv' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}>CV Analizi</button>
             <button onClick={() => { setActiveTab("dna"); setResult(null); }} className={`text-sm font-medium px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${activeTab === 'dna' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}><Crown size={16} /> Kariyer Pusulası</button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-6xl">
        {!result ? (
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-4xl font-bold text-slate-900 leading-tight">
                {activeTab === 'cv' ? 'Geleceğin Kariyer Stratejisini Bugün Kur.' : 'Karakterin Geleceğin En Büyük Kaldıracı.'}
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed">
                {activeTab === 'cv' ? "Yapay zeka ile mülakat risklerini görün ve maaş pazarlığı için strateji geliştirin." : "DNA'nızı analiz ederek size en uygun üst düzey rolleri keşfedin."}
              </p>

              <div className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-2xl p-8 hover:border-blue-400 transition-all relative">
                <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-white rounded-full mb-4 shadow-sm"><UploadCloud size={24} className="text-blue-600" /></div>
                  <p className="font-semibold text-slate-900">{file ? file.name : "CV'ni buraya bırak veya seç"}</p>
                </div>
              </div>

              {activeTab === 'cv' && (
                <textarea placeholder="Varsa hedef iş ilanı..." className="w-full h-32 p-4 border border-slate-200 rounded-2xl outline-none text-sm" value={ilan} onChange={(e) => setIlan(e.target.value)} />
              )}

              {activeTab === 'cv' && (
                <button onClick={handleAnalyze} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-200">Analizi Başlat</button>
              )}
            </div>

            <div className="lg:col-span-7">
              {activeTab === 'dna' && (
                <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                  {!testCompleted ? (
                    <div>
                      <div className="flex justify-between items-center mb-10">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Soru {currentQuestion + 1} / 12</span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-8">{questions[currentQuestion].text}</h3>
                      <div className="grid gap-4">
                        {questions[currentQuestion].options.map((opt, i) => (
                          <button key={i} onClick={() => handleOptionSelect(opt)} className="w-full text-left p-5 rounded-2xl border border-slate-100 hover:border-slate-900 hover:bg-slate-50 transition-all font-medium">{opt}</button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="bg-amber-50 p-6 rounded-full mb-6"><Crown size={48} className="text-amber-500" /></div>
                      <h3 className="text-2xl font-bold mb-8">Karakter DNA'n Hazır.</h3>
                      <button onClick={handleAnalyze} className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:scale-105 transition-all flex items-center gap-2">Sonuçları Sentezle <ArrowRight size={20} /></button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* --- SONUÇ EKRANI --- */
          <div className="space-y-12 animate-in fade-in duration-700">
            <button onClick={() => setResult(null)} className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase flex items-center gap-2">← Yeni Analiz</button>

            {activeTab === 'dna' ? (
              /* --- DNA SONUÇ TASARIMI --- */
              <div className="space-y-12">
                <div className="text-center max-w-4xl mx-auto">
                  <span className="text-[10px] font-bold tracking-[0.3em] text-blue-500 uppercase border border-blue-100 px-4 py-1 rounded-full bg-blue-50">KARİYER ARKETİPİ</span>
                  <h1 className="text-5xl md:text-6xl font-black text-slate-900 mt-8 mb-6 leading-tight">{result.arketip_profili?.ana}</h1>
                  
                  <div className="flex flex-wrap justify-center gap-4 mt-8">
                    {result.arketip_profili?.mesleki_oneriler?.map((item: any, i: number) => (
                      <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm min-w-[220px] text-left hover:border-blue-500 transition-all group">
                        <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">{item.uygunluk} Uygunluk</p>
                        <p className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.rol}</p>
                        <p className="text-[11px] text-slate-400 italic mt-2 leading-snug">{item.neden}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="max-w-4xl mx-auto px-6">
                  <p className="text-2xl text-slate-700 leading-relaxed font-medium italic border-l-8 border-blue-500 pl-10 py-4 bg-white rounded-r-3xl shadow-sm">
                    "{result.karakter_ozeti}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {Object.entries(result.calisma_dinamigi || {}).map(([key, value]: any) => (
                    <div key={key} className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl hover:translate-y-[-5px] transition-transform">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{key.replace('_', ' ')}</p>
                      <p className="text-xl font-bold leading-tight">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-slate-200 rounded-[3rem] p-12 shadow-sm">
                  <h3 className="text-3xl font-black text-slate-900 mb-10 flex items-center gap-4"><TrendingUp className="text-blue-600" size={32} /> Stratejik Yol Haritası</h3>
                  <div className="grid md:grid-cols-3 gap-12 relative">
                    {['1_yil', '3_yil', '5_yil'].map((year, i) => (
                      <div key={year} className="relative">
                        <div className="text-6xl font-black text-slate-50 absolute -top-8 -left-4 z-0">{year[0]}</div>
                        <div className="relative z-10">
                          <h4 className="text-blue-600 font-bold uppercase tracking-tighter mb-4">{year.replace('_', ' ')} HEDEFİ</h4>
                          <p className="text-slate-700 font-medium leading-relaxed">{result.kariyer_stratejisi?.[year]}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* --- CV SONUÇ TASARIMI --- */
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
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Yetkinlik Analizi</h3>
                    <div className="h-56"><Radar data={getRadarData(result.uyum_skoru?.alt_kirimlar)} options={{ maintainAspectRatio: false, scales: { r: { ticks: { display: false }, grid: { color: '#f1f5f9' } } }, plugins: { legend: { display: false } } }} /></div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className={`p-8 rounded-3xl border-2 ${result.uyum_skoru?.toplam < 70 ? 'bg-red-50 border-red-100 text-red-900' : 'bg-emerald-50 border-emerald-100 text-emerald-900'}`}>
                    <div className="flex items-center gap-3 mb-4 font-black uppercase text-sm tracking-widest">{result.uyum_skoru?.toplam < 70 ? <ShieldAlert /> : <CheckCircle2 />} ATS Durumu</div>
                    <p className="text-lg font-medium">{result.ats_red_sebebi}</p>
                  </div>
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 font-black uppercase text-sm tracking-widest text-slate-900"><User /> Hiring Manager Notu</div>
                    <p className="text-slate-700 font-medium mb-4 italic">"{result.hiring_manager_gozuyle?.ise_uygunluk}"</p>
                    <div className="flex flex-wrap gap-2">{result.hiring_manager_gozuyle?.riskler?.map((r: string, i: number) => <span key={i} className="text-[10px] font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase tracking-tighter">• {r}</span>)}</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-blue-600 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-6 right-6 bg-white/20 text-[10px] font-bold px-3 py-1 rounded-full tracking-widest">BETA PREMIUM</div>
                    <div className="flex items-center gap-4 mb-8"><div className="bg-white/10 p-3 rounded-2xl"><DollarSign size={24} /></div><h3 className="text-xl font-bold uppercase tracking-tighter">Maaş Pazarlığı Kozun</h3></div>
                    <p className="text-2xl font-black leading-tight mb-8">"{result.pazarlik_stratejisi?.taktik_cumlesi}"</p>
                    <div className="flex flex-wrap gap-2">{result.pazarlik_stratejisi?.masadaki_kozlarin?.map((k: string, i: number) => <span key={i} className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-xs font-bold">{k}</span>)}</div>
                  </div>
                  <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl">
                    <div className="flex items-center gap-4 mb-8"><div className="bg-white/10 p-3 rounded-2xl"><Lightbulb size={24} className="text-amber-400" /></div><h3 className="text-xl font-bold uppercase tracking-tighter">Teknik Kanıt Görevi</h3></div>
                    <h4 className="text-2xl font-bold mb-6 text-white leading-tight">{result.teknik_kanit_gorevi?.proje_fikri}</h4>
                    <ul className="space-y-4">{result.teknik_kanit_gorevi?.nasil_yapilir?.map((step: string, i: number) => <li key={i} className="flex gap-4 text-slate-400 text-sm font-medium"><div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">{i+1}</div>{step}</li>)}</ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
