"use client";
import { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, ArcElement, Tooltip, Legend, RadialLinearScale, 
  PointElement, LineElement, Filler 
} from 'chart.js';
import { Doughnut, Radar } from 'react-chartjs-2';
import { 
  ShieldAlert, TrendingUp, CheckCircle2, Layers, User, 
  ArrowRight, UploadCloud, DollarSign, Award, Crown, Lightbulb, FileText 
} from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler);

const loadingMessages = [
  "Kariyer Stratejisti teknik satır aralarını okuyor...",
  "Performans Psikoloğu zihinsel kalıpları ağırlıklandırıyor...",
  "Potansiyel Avcısı 'en iyi versiyonun' ile bağ kuruyor...",
  "Silikon Vadisi standartlarında yol haritan hazırlanıyor..."
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
    { id: 7, text: "Yöneticinden sert bir geri bildirim aldığında ne yaparsın?", options: ["Önce savunmaya geçerim.", "Duygusal olarak düşerim.", "Hemen düzeltmek için plan yaparım.", "Verilerle hatanın bende olmadığını kanıtlarım."] },
    { id: 8, text: "Kısıtlı zaman ve veriyle kritik karar vermen lazım. Ne yaparsın?", options: ["İçgüdülerime güvenirim.", "Ne pahasına olursa olsun veri ararım.", "Hızlıca küçük bir deney yaparım.", "Ekibe danışırım."] },
    { id: 9, text: "Yeni bir teknoloji öğrenme yöntemin nedir?", options: ["Dokümantasyonu okurum.", "Proje yaparak öğrenirim.", "Eğitim videosu izlerim.", "Önce mantığını kavrarım."] },
    { id: 10, text: "Takım içindeki rolün nedir?", options: ["Lider.", "Diplomat.", "Kalite Kontrol.", "Uygulayıcı."] },
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

      if (typeof window !== "undefined" && window.gtag) {
        window.gtag('event', 'analysis_success', { 'event_label': activeTab });
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100">
      
      {loading && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-8"></div>
          <p className="text-2xl font-medium text-slate-800 animate-pulse">{loadingMessages[messageIndex]}</p>
        </div>
      )}

      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 text-white p-2 rounded-lg"><Layers size={24} /></div>
            <h1 className="text-xl font-bold tracking-tight">RoleScope AI</h1>
          </div>
          <div className="flex gap-2">
             <button onClick={() => { setActiveTab("cv"); setResult(null); }} className={`px-4 py-2 rounded-lg text-sm font-bold ${activeTab === 'cv' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}>CV Analizi</button>
             <button onClick={() => { setActiveTab("dna"); setResult(null); }} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${activeTab === 'dna' ? 'bg-slate-100 text-amber-600' : 'text-slate-400'}`}><Crown size={16} /> Kariyer DNA</button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-6xl">
        {!result ? (
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-5xl font-black text-slate-900 leading-tight">
                {activeTab === 'cv' ? 'Mülakat Masasında Elini Güçlendir.' : 'DNA\'nı Keşfet, Kariyerini Domine Et.'}
              </h2>
              <div className="border-2 border-dashed border-slate-200 bg-white p-10 rounded-[2.5rem] text-center hover:border-slate-900 transition-all cursor-pointer relative">
                <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                <UploadCloud size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="font-bold text-slate-600">{file ? file.name : "CV Dosyanı Buraya Bırak"}</p>
              </div>
              {activeTab === 'cv' && (
                <>
                  <textarea placeholder="Hedef iş ilanı (Opsiyonel)" className="w-full h-32 p-5 border border-slate-200 rounded-3xl bg-white outline-none" value={ilan} onChange={(e) => setIlan(e.target.value)} />
                  <button onClick={handleAnalyze} className="w-full py-5 bg-slate-900 text-white rounded-3xl font-bold shadow-2xl">Analizi Başlat</button>
                </>
              )}
            </div>
            
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              {activeTab === 'dna' && !testCompleted && (
                <div className="animate-in slide-in-from-right duration-500">
                  <p className="text-xs font-black text-blue-600 mb-4 uppercase">SORU {currentQuestion + 1} / 12</p>
                  <h3 className="text-2xl font-bold mb-8">{questions[currentQuestion].text}</h3>
                  <div className="space-y-3">
                    {questions[currentQuestion].options.map((opt, i) => (
                      <button key={i} onClick={() => handleOptionSelect(opt)} className="w-full text-left p-5 rounded-2xl border border-slate-100 hover:border-slate-900 font-medium transition-all">{opt}</button>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'dna' && testCompleted && (
                <div className="text-center py-10">
                  <Crown size={64} className="mx-auto text-amber-500 mb-6" />
                  <h3 className="text-3xl font-bold mb-8">DNA Profilin Hazır.</h3>
                  <button onClick={handleAnalyze} className="px-12 py-5 bg-slate-900 text-white rounded-3xl font-bold">Sonuçları Sentezle</button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in duration-1000">
            {activeTab === 'dna' ? (
              <div className="space-y-12">
                <div className="text-center">
                  <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tighter">{result.arketip_profili?.ana}</h1>
                  <div className="flex flex-wrap justify-center gap-4 mt-10">
                    {result.arketip_profili?.mesleki_oneriler?.map((item: any, i: number) => (
                      <div key={i} className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm hover:border-slate-900 transition-all text-left min-w-[250px]">
                        <p className="text-[10px] font-black text-blue-600 uppercase mb-2">{item.uygunluk} UYGUNLUK</p>
                        <p className="text-xl font-bold text-slate-800 mb-2">{item.rol}</p>
                        <p className="text-xs text-slate-500 leading-relaxed italic">{item.neden}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="max-w-4xl mx-auto">
                  <p className="text-2xl text-slate-700 leading-relaxed font-medium italic border-l-8 border-slate-900 pl-10 py-6 bg-white rounded-r-[3rem] shadow-sm">
                    "{result.karakter_ozeti}"
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {Object.entries(result.calisma_dinamigi || {}).map(([key, value]: any) => (
                    <div key={key} className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">{key.replace('_', ' ')}</p>
                      <p className="text-xl font-bold leading-tight">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-slate-200 rounded-[4rem] p-12 shadow-sm">
                  <h3 className="text-4xl font-black text-slate-900 mb-12 flex items-center gap-4"><TrendingUp size={40} className="text-slate-900" /> Stratejik Yol Haritası</h3>
                  <div className="grid md:grid-cols-3 gap-12">
                    {['1_yil', '3_yil', '5_yil'].map((year) => (
                      <div key={year} className="space-y-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900 font-black text-xl">{year[0]}</div>
                        <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">{year.replace('_', ' ')} HEDEFİ</h4>
                        <p className="text-slate-800 font-bold leading-relaxed">{result.kariyer_stratejisi?.[year]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
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
                    <div className="flex items-center gap-3 mb-4 font-black uppercase text-sm tracking-widest">{result.uyum_skoru?.toplam < 70 ? <ShieldAlert size={20} /> : <CheckCircle2 size={20} />} ATS Durumu</div>
                    <p className="text-lg font-medium">{result.ats_red_sebebi}</p>
                  </div>
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 font-black uppercase text-sm tracking-widest text-slate-900"><User size={20} /> Hiring Manager Notu</div>
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
            <button onClick={() => setResult(null)} className="mx-auto block px-12 py-4 bg-slate-900 text-white rounded-full font-bold shadow-lg hover:scale-105 transition-all">Yeniden Analiz Et</button>
          </div>
        )}
      </main>
    </div>
  );
}
