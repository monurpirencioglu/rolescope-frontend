"use client";
import { useState } from 'react';

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

// Profesyonel İkon Seti
import {
  Briefcase,
  Brain,
  Target,
  ShieldAlert,
  TrendingUp,
  CheckCircle2,
  XCircle,
  FileText,
  Layers,
  User,
  ArrowRight,
  UploadCloud,
  Loader2,
  DollarSign,
  Award,
  Crown,
  Unlock,
  Lightbulb // Yeni eklendi (Kariyer Hamlesi için)
} from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler);

export default function Home() {
  // BURAYI KENDİ RENDER URL'İN İLE GÜNCELLEMEYİ UNUTMA!
  const API_URL = "https://rolescope-backend.onrender.com";

  // --- STATE ---
  const [file, setFile] = useState<File | null>(null);
  const [ilan, setIlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("cv");

  // DNA Test State
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [testCompleted, setTestCompleted] = useState(false);

  // --- DNA TEST SORULARI (GÜNCELLENMİŞ 12 SORULUK SET) ---
  const questions = [
    { id: 1, text: "Belirsiz bir durumla karşılaştığında ilk tepkin ne olur?", options: ["Hemen aksiyon alır, yolda düzeltirim (Hız Odaklı).", "Önce tüm verileri toplar, analiz ederim (Analitik).", "Ekibimle konuşur, ortak karar alırım (Demokratik).", "Yöneticimden net talimat beklerim (Hiyerarşik)."] },
    { id: 2, text: "Seni en çok ne motive eder?", options: ["Zor ve karmaşık problemleri çözmek.", "İnsanlara yardım etmek ve mentörlük.", "Net, ölçülebilir başarılar ve yüksek kazanç.", "Sistemi kurmak, optimize etmek ve düzeni sağlamak."] },
    { id: 3, text: "Çatışma anında nasıl davranırsın?", options: ["Kendi fikrimi verilerle sonuna kadar savunurum.", "Orta yolu bulmaya çalışır, gerginliği alırım.", "Duyguları kenara bırakır, sadece işe odaklanırım.", "Ortamın sakinleşmesini bekler, sonra konuşurum."] },
    { id: 4, text: "Hangi çalışma ortamı sana daha uygun?", options: ["Hızlı, kaotik, sürekli değişen (Startup Kültürü).", "Kuralları belli, net süreçleri olan (Kurumsal).", "Özgür, saatten bağımsız, sonuç odaklı (Remote/Freelance).", "Sessiz, odaklanmaya müsait, derin iş (Ar-Ge)."] },
    { id: 5, text: "Bir projede en sevdiğin aşama hangisidir?", options: ["Fikir bulma ve strateji (Vizyoner).", "Planlama ve mimariyi kurma (Mimar).", "Uygulama ve kodlama (Operasyonel).", "Test etme ve mükemmelleştirme (Detaycı)."] },
    { id: 6, text: "Risk alma yaklaşımın nedir?", options: ["Büyük risk, büyük ödül. Kaybetmekten korkmam.", "Hesaplanmış riskleri alırım, B planım vardır.", "Mevcut yapıyı korumak benim için daha önemlidir.", "Riskten kaçınır, garanti ve denenmiş yolları seçerim."] },
    { id: 7, text: "Yöneticinden sert bir olumsuz geri bildirim (feedback) aldığında ne yaparsın?", options: ["Önce savunmaya geçerim, haksızlık yapıldığını düşünürüm.", "Duygusal olarak düşerim ama sonra toparlarım.", "Teşekkür eder, hemen düzeltmek için plan yaparım (Gelişim Odaklı).", "Verilerle hatanın bende olmadığını kanıtlamaya çalışırım."] },
    { id: 8, text: "Zaman çok kısıtlı ve elinde yeterli veri yok. Kritik bir karar vermen lazım. Ne yaparsın?", options: ["İçgüdülerime ve tecrübeme güvenir, kararı veririm.", "Kararı erteler, ne pahasına olursa olsun veri bulmaya çalışırım.", "Hızlıca küçük bir deney (test) yapar, sonuca göre ilerlerim.", "Sorumluluğu tek başıma almaz, ekibe veya yöneticiye danışırım."] },
    // --- YENİ EKLENEN DERİNLEŞTİRİCİ SORULAR (9-12) ---
    { id: 9, text: "Yeni ve zor bir teknoloji/konu öğrenmen gerektiğinde yöntemin nedir?", options: ["Dokümantasyonu baştan sona okurum (Teorik).", "Hemen bir proje yapmaya başlar, hata yaparak öğrenirim (Pratik).", "Bilen birine sorar veya eğitim videosu izlerim (Görsel/İşitsel).", "Önce mantığını kavrar, sonra detaylara inerim (Bütüncül)."] },
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

  const handleFileChange = (e: any) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file && activeTab === "cv") return alert("Lütfen devam etmeden önce CV dosyanızı yükleyin.");
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
      const response = await fetch(`${API_URL}${endpoint}`, { method: "POST", body: formData });
      if (!response.ok) throw new Error("Analiz sunucusu yanıt vermedi. (Backend uykuda olabilir, tekrar deneyin)");
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      alert("Hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- GRAFİK VERİLERİ ---
  const getScoreData = (score: number) => ({
    labels: ['Uyum', 'Eksik'],
    datasets: [{
      data: [score, 100 - score],
      backgroundColor: ['#0f172a', '#e2e8f0'],
      borderWidth: 0,
    }]
  });

  const getRadarData = (kirilimlar: any) => ({
    labels: ['Teknik', 'ATS Uyumu', 'Deneyim', 'Somut Çıktı'],
    datasets: [{
      label: 'Profil Analizi',
      data: [
        kirilimlar?.teknik_yetkinlik || 0,
        kirilimlar?.ats_uyumu || 0,
        kirilimlar?.deneyim_seniority || 0,
        kirilimlar?.proje_odaklilik || 0
      ],
      backgroundColor: 'rgba(15, 23, 42, 0.2)',
      borderColor: '#0f172a',
      pointBackgroundColor: '#fff',
      borderWidth: 2,
    }]
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-slate-200">

      {/* --- PREMIUM BANNER --- */}
      <div className="bg-slate-900 text-white text-center py-3 px-4 text-xs font-medium tracking-wide relative z-[60] flex items-center justify-center gap-2">
        <span className="bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">BETA</span>
        <span>🚀 RoleScope AI: <span className="text-emerald-400 font-bold">Premium Kariyer Analizi & Maaş Stratejisi</span> sınırlı süre için ücretsiz.</span>
      </div>

      {/* HEADER */}
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

        {/* --- GİRİŞ EKRANI --- */}
        {!result && (
            <div className="grid lg:grid-cols-12 gap-12">
                <div className="lg:col-span-5 space-y-6">
                    <div>
                        <h2 className="text-3xl font-light text-slate-900 mb-2 flex items-center gap-2">
                            {activeTab === 'cv' ? 'Profesyonel CV Analizi' : <><span className="text-amber-500"><Crown size={28} /></span> Kariyer DNA Testi</>}
                        </h2>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            {activeTab === 'cv' ? "Yapay zeka ile CV'nizi ATS standartlarına göre test edin, mülakat risklerini görün ve maaş pazarlığı için strateji geliştirin." : "Kişilik özelliklerinizi bilimsel yöntemlerle analiz ederek size en uygun çalışma ortamını ve rolü keşfedin."}
                        </p>
                    </div>

                    <div className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-xl p-8 hover:border-slate-400 transition-all group cursor-pointer relative">
                        <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className="flex flex-col items-center text-center">
                            <div className="p-4 bg-white rounded-full mb-4 shadow-sm"><UploadCloud size={24} className="text-slate-600" /></div>
                            <p className="font-medium text-slate-900">CV Dosyasını Yükle</p>
                            <p className="text-xs text-slate-400 mt-1">PDF formatı önerilir</p>
                            {file && <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100"><CheckCircle2 size={12} /> {file.name}</div>}
                        </div>
                    </div>

                    {activeTab === 'cv' && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">İş İlanı (Opsiyonel)</label>
                            <textarea placeholder="İlan metnini buraya yapıştırın..." className="w-full h-32 p-4 border border-slate-200 rounded-xl focus:ring-1 focus:ring-slate-900 outline-none resize-none text-sm bg-white" value={ilan} onChange={(e) => setIlan(e.target.value)} />
                        </div>
                    )}

                    {activeTab === 'cv' && (
                        <button onClick={handleAnalyze} disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-xl shadow-slate-200">
                            {loading ? <><Loader2 className="animate-spin" size={20} /> Analiz Ediliyor...</> : 'Analizi Başlat'}
                        </button>
                    )}
                </div>

                <div className="lg:col-span-7">
                    {activeTab === 'dna' ? (
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full blur-3xl opacity-50 -z-10"></div>
                            {!testCompleted ? (
                                <div>
                                    <div className="flex justify-between items-center mb-8">
                                        <span className="text-xs font-bold tracking-widest text-amber-600 uppercase flex items-center gap-1"><Crown size={12} /> Premium Envanter</span>
                                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">{currentQuestion + 1} / {questions.length}</span>
                                    </div>
                                    <h3 className="text-xl font-medium text-slate-900 mb-8 leading-relaxed">{questions[currentQuestion].text}</h3>
                                    <div className="space-y-3">
                                        {questions[currentQuestion].options.map((option, idx) => (
                                            <button key={idx} onClick={() => handleOptionSelect(option)} className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition-all text-slate-700 text-sm font-medium">{option}</button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                                    <div className="bg-amber-50 p-6 rounded-full"><Crown size={48} className="text-amber-500" /></div>
                                    <div><h3 className="text-xl font-bold text-slate-900">Profilin Hazır</h3><p className="text-slate-500 mt-2 text-sm">Cevapların kaydedildi. CV verilerinle sentezleniyor.</p></div>
                                    <button onClick={handleAnalyze} disabled={loading} className="px-8 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all flex items-center gap-2">{loading ? <Loader2 className="animate-spin" /> : <>Sonuçları Göster <ArrowRight size={16} /></>}</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-slate-50 rounded-2xl h-full flex items-center justify-center border border-dashed border-slate-200 text-slate-400 text-sm p-8 text-center">
                            <p>RoleScope AI, CV'nizi ve hedeflerinizi analiz etmek için hazır.</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* --- SONUÇ EKRANI: CV ANALİZİ --- */}
        {result && activeTab === 'cv' && (
            <div className="space-y-8 animate-fade-in">
                <button onClick={() => setResult(null)} className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest flex items-center gap-2">← Yeni Analiz</button>

                {/* 1. ÜST PANEL */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center relative">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Uyum Skoru</h3>
                        <div className="w-32 h-32 relative">
                            <Doughnut data={getScoreData(result.uyum_skoru?.toplam || 0)} options={{ cutout: '80%', plugins: { legend: { display: false } } }} />
                            <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-slate-900">{result.uyum_skoru?.toplam}</div>
                        </div>
                    </div>
                    <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Yetkinlik Analizi</h3>
                        <div className="h-48 w-full flex justify-center">
                            <Radar data={getRadarData(result.uyum_skoru?.alt_kirimlar)} options={{ maintainAspectRatio: false, scales: { r: { ticks: { display: false }, grid: { color: '#f1f5f9' } } }, plugins: { legend: { display: false } } }} />
                        </div>
                    </div>
                </div>

                {/* 2. ATS & KARAR */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className={`p-6 rounded-xl border ${result.uyum_skoru?.toplam < 70 ? 'bg-red-50 border-red-100 text-red-900' : 'bg-emerald-50 border-emerald-100 text-emerald-900'}`}>
                        <div className="flex items-center gap-3 mb-2 font-bold">{result.uyum_skoru?.toplam < 70 ? <ShieldAlert size={20} /> : <CheckCircle2 size={20} />} ATS Durumu</div>
                        <p className="text-sm opacity-90">{result.ats_red_sebebi}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 font-bold text-slate-900"><User size={20} /> İşe Alım Kararı</div>
                        <p className="text-sm mb-2"><span className="font-semibold">Karar:</span> {result.hiring_manager_gozuyle?.ise_uygunluk}</p>
                        <div className="flex flex-col gap-1">{result.hiring_manager_gozuyle?.riskler?.map((r: string, i: number) => <span key={i} className="text-slate-500 text-xs flex items-center gap-2">• {r}</span>)}</div>
                    </div>
                </div>

                {/* 3. STRATEJİ & TEKNİK GÖREV */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* MAAŞ KARTI */}
                    <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm relative overflow-hidden">
                         <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            <Unlock size={10} /> BETA'DA AÇIK
                         </div>
                         <div className="flex items-center gap-2 mb-6 text-slate-900">
                            <div className="bg-slate-100 p-2 rounded-lg"><DollarSign size={20} /></div>
                            <h3 className="font-bold">Mülakat Masasındaki Gücün</h3>
                        </div>
                        <p className="text-lg text-slate-700 italic font-medium mb-6">"{result.pazarlik_stratejisi?.taktik_cumlesi}"</p>
                        <div className="space-y-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kullanabileceğin Kozlar</span>
                            <div className="flex flex-wrap gap-2">
                                {result.pazarlik_stratejisi?.masadaki_kozlarin?.map((k: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium border border-slate-200">{k}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 text-white rounded-xl p-8 shadow-xl">
                        <div className="flex items-center gap-2 mb-6 text-slate-400">
                            <div className="bg-slate-800 p-2 rounded-lg"><Award size={20} /></div>
                            <h3 className="font-bold uppercase tracking-widest text-xs">Teknik Kanıt Görevi</h3>
                        </div>
                        <h4 className="text-lg font-semibold mb-4 text-white">{result.teknik_kanit_gorevi?.proje_fikri}</h4>
                        <ul className="space-y-3 text-slate-300 text-sm">
                            {result.teknik_kanit_gorevi?.nasil_yapilir?.map((step: string, i: number) => (
                                <li key={i} className="flex gap-3"><ArrowRight size={16} className="mt-0.5 flex-shrink-0 text-emerald-400" /> {step}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        )}

        {/* --- SONUÇ EKRANI: DNA ANALİZİ --- */}
        {result && activeTab === 'dna' && (
            <div className="space-y-12 animate-fade-in relative">
                 <button onClick={() => { setResult(null); setTestCompleted(false); setCurrentQuestion(0); }} className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest flex items-center gap-2">← Testi Yeniden Başlat</button>

                <div className="absolute top-0 right-0">
                    <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                        <Crown size={14} /> PREMIUM RAPOR
                    </div>
                </div>

                <div className="text-center max-w-3xl mx-auto">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase border border-slate-200 px-3 py-1 rounded-full">Kariyer Arketipi</span>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 mt-6 mb-4">{result.arketip_profili?.ana}</h1>
                    <p className="text-xl text-slate-500 font-light leading-relaxed">{result.karakter_ozeti}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2"><Layers size={20} /> Çalışma Dinamikleri</h3>
                        <div className="space-y-5">
                            {result.calisma_dinamigi && Object.entries(result.calisma_dinamigi).map(([key, value], index) => (
                                <div key={index}>
                                    <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold mb-2"><span>{key.split('_')[0]}</span><span>{key.split('_')[1]}</span></div>
                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden relative"><div className="absolute top-0 left-0 h-full bg-slate-800 w-1/2 rounded-full"></div></div>
                                    <p className="text-xs text-slate-500 mt-2 font-medium">{value as string}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 text-white rounded-xl p-8 shadow-xl">
                        <h3 className="font-bold text-white mb-8 flex items-center gap-2"><TrendingUp size={20} /> Stratejik Yol Haritası</h3>
                        <div className="space-y-8 relative">
                            <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-800"></div>
                            {['1_yil', '3_yil', '5_yil'].map((year, i) => (
                                <div key={i} className="relative pl-10">
                                    <div className="absolute left-0 top-1 w-6 h-6 bg-slate-800 border border-slate-600 rounded-full flex items-center justify-center text-[10px] font-bold text-emerald-400">{year[0]}</div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{year.replace('_', '. ')} Hedefi</h4>
                                    <p className="text-slate-300 text-sm leading-relaxed">{result.kariyer_stratejisi?.[year]}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}"use client";

import { useState } from 'react';



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

// Profesyonel İkon Seti

import {

  Briefcase,

  Brain,

  Target,

  ShieldAlert,

  TrendingUp,

  CheckCircle2,

  XCircle,

  FileText,

  Layers,

  User,

  ArrowRight,

  UploadCloud,

  Loader2,

  DollarSign,

  Award,

  Crown,        // Premium İkonu

  Unlock        // Kilit Açık İkonu

} from 'lucide-react';



ChartJS.register(ArcElement, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler);



export default function Home() {

  const API_URL = "https://rolescope-backend.onrender.com";



  // --- STATE ---

  const [file, setFile] = useState<File | null>(null);

  const [ilan, setIlan] = useState("");

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<any>(null);

  const [activeTab, setActiveTab] = useState("cv");



  // Test State'leri (Eski manuel test için - Şimdilik kalsın zararı yok)

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState<Record<string, any>>({});

  const [testCompleted, setTestCompleted] = useState(false);



  // --- DNA TEST SORULARI (Eski - Çalışan Hali) ---

  const questions = [

    { id: 1, text: "Belirsiz bir durumla karşılaştığında ilk tepkin ne olur?", options: ["Hemen aksiyon alır, yolda düzeltirim (Hız Odaklı).", "Önce tüm verileri toplar, analiz ederim (Analitik).", "Ekibimle konuşur, ortak karar alırım (Demokratik).", "Yöneticimden net talimat beklerim (Hiyerarşik)."] },

    { id: 2, text: "Seni en çok ne motive eder?", options: ["Zor ve karmaşık problemleri çözmek.", "İnsanlara yardım etmek ve mentörlük.", "Net, ölçülebilir başarılar ve yüksek kazanç.", "Sistemi kurmak, optimize etmek ve düzeni sağlamak."] },

    { id: 3, text: "Çatışma anında nasıl davranırsın?", options: ["Kendi fikrimi verilerle sonuna kadar savunurum.", "Orta yolu bulmaya çalışır, gerginliği alırım.", "Duyguları kenara bırakır, sadece işe odaklanırım.", "Ortamın sakinleşmesini bekler, sonra konuşurum."] },

    { id: 4, text: "Hangi çalışma ortamı sana daha uygun?", options: ["Hızlı, kaotik, sürekli değişen (Startup Kültürü).", "Kuralları belli, net süreçleri olan (Kurumsal).", "Özgür, saatten bağımsız, sonuç odaklı (Remote/Freelance).", "Sessiz, odaklanmaya müsait, derin iş (Ar-Ge)."] },

    { id: 5, text: "Bir projede en sevdiğin aşama hangisidir?", options: ["Fikir bulma ve strateji (Vizyoner).", "Planlama ve mimariyi kurma (Mimar).", "Uygulama ve kodlama (Operasyonel).", "Test etme ve mükemmelleştirme (Detaycı)."] },

    { id: 6, text: "Risk alma yaklaşımın nedir?", options: ["Büyük risk, büyük ödül. Kaybetmekten korkmam.", "Hesaplanmış riskleri alırım, B planım vardır.", "Mevcut yapıyı korumak benim için daha önemlidir.", "Riskten kaçınır, garanti ve denenmiş yolları seçerim."] },

    { id: 7, text: "Yöneticinden sert bir olumsuz geri bildirim (feedback) aldığında ne yaparsın?", options: ["Önce savunmaya geçerim, haksızlık yapıldığını düşünürüm.", "Duygusal olarak düşerim ama sonra toparlarım.", "Teşekkür eder, hemen düzeltmek için plan yaparım (Gelişim Odaklı).", "Verilerle hatanın bende olmadığını kanıtlamaya çalışırım."] },

    { id: 8, text: "Zaman çok kısıtlı ve elinde yeterli veri yok. Kritik bir karar vermen lazım. Ne yaparsın?", options: ["İçgüdülerime ve tecrübeme güvenir, kararı veririm.", "Kararı erteler, ne pahasına olursa olsun veri bulmaya çalışırım.", "Hızlıca küçük bir deney (test) yapar, sonuca göre ilerlerim.", "Sorumluluğu tek başıma almaz, ekibe veya yöneticiye danışırım."] }

  ];



  const handleOptionSelect = (option: any) => {

    setAnswers({ ...answers, [`Soru ${questions[currentQuestion].id}`]: option });

    if (currentQuestion < questions.length - 1) {

      setCurrentQuestion(currentQuestion + 1);

    } else {

      setTestCompleted(true);

    }

  };



  const handleFileChange = (e: any) => {

    if (e.target.files) {

      setFile(e.target.files[0]);

    }

  };



  const handleAnalyze = async () => {

    if (!file) return alert("Lütfen devam etmeden önce CV dosyanızı yükleyin.");

    setLoading(true);

    setResult(null);



    const formData = new FormData();

    formData.append("cv", file);

    if (activeTab === "cv") {

        formData.append("ilan", ilan);

    } else {

        formData.append("answers", JSON.stringify(answers));

    }



    try {

      const endpoint = activeTab === "cv" ? "/analiz-et" : "/analiz-dna";

      const response = await fetch(`${API_URL}${endpoint}`, { method: "POST", body: formData });

      if (!response.ok) throw new Error("Analiz sunucusu yanıt vermedi. (Backend uykuda olabilir, tekrar deneyin)");

      const data = await response.json();

      setResult(data);

    } catch (error: any) {

      alert("Hata: " + error.message);

    } finally {

      setLoading(false);

    }

  };



  // --- GRAFİK VERİLERİ ---

  const getScoreData = (score: number) => ({

    labels: ['Uyum', 'Eksik'],

    datasets: [{

      data: [score, 100 - score],

      backgroundColor: ['#0f172a', '#e2e8f0'],

      borderWidth: 0,

    }]

  });



  const getRadarData = (kirilimlar: any) => ({

    labels: ['Teknik', 'ATS Uyumu', 'Deneyim', 'Somut Çıktı (Sonuç)'],

    datasets: [{

      label: 'Profil Analizi',

      data: [

        kirilimlar?.teknik_yetkinlik || 0,

        kirilimlar?.ats_uyumu || 0,

        kirilimlar?.deneyim_seniority || 0,

        kirilimlar?.proje_odaklilik || 0

      ],

      backgroundColor: 'rgba(15, 23, 42, 0.2)',

      borderColor: '#0f172a',

      pointBackgroundColor: '#fff',

      borderWidth: 2,

    }]

  });



  return (

    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-slate-200">



      {/* --- PREMIUM BANNER (SOFT LOCK) --- */}

      <div className="bg-slate-900 text-white text-center py-3 px-4 text-xs font-medium tracking-wide relative z-[60] flex items-center justify-center gap-2">

        <span className="bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">BETA</span>

        <span>🚀 RoleScope AI: <span className="text-emerald-400 font-bold">Premium Kariyer Analizi & Maaş Stratejisi</span> sınırlı süre için ücretsiz.</span>

      </div>



      {/* HEADER */}

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



        {/* --- GİRİŞ EKRANI --- */}

        {!result && (

            <div className="grid lg:grid-cols-12 gap-12">

                {/* SOL PANEL */}

                <div className="lg:col-span-5 space-y-6">

                    <div>

                        <h2 className="text-3xl font-light text-slate-900 mb-2 flex items-center gap-2">

                            {activeTab === 'cv' ? 'Profesyonel CV Analizi' : <><span className="text-amber-500"><Crown size={28} /></span> Kariyer DNA Testi</>}

                        </h2>

                        <p className="text-slate-500 text-sm leading-relaxed">

                            {activeTab === 'cv' ? "Yapay zeka ile CV'nizi ATS standartlarına göre test edin, mülakat risklerini görün ve maaş pazarlığı için strateji geliştirin." : "Kişilik özelliklerinizi bilimsel yöntemlerle analiz ederek size en uygun çalışma ortamını ve rolü keşfedin."}

                        </p>

                    </div>



                    <div className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-xl p-8 hover:border-slate-400 transition-all group cursor-pointer relative">

                        <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />

                        <div className="flex flex-col items-center text-center">

                            <div className="p-4 bg-white rounded-full mb-4 shadow-sm"><UploadCloud size={24} className="text-slate-600" /></div>

                            <p className="font-medium text-slate-900">CV Dosyasını Yükle</p>

                            <p className="text-xs text-slate-400 mt-1">PDF formatı önerilir</p>

                            {file && <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100"><CheckCircle2 size={12} /> {file.name}</div>}

                        </div>

                    </div>



                    {activeTab === 'cv' && (

                        <div className="space-y-2">

                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">İş İlanı (Opsiyonel)</label>

                            <textarea placeholder="İlan metnini buraya yapıştırın..." className="w-full h-32 p-4 border border-slate-200 rounded-xl focus:ring-1 focus:ring-slate-900 outline-none resize-none text-sm bg-white" value={ilan} onChange={(e) => setIlan(e.target.value)} />

                        </div>

                    )}



                    {activeTab === 'cv' && (

                        <button onClick={handleAnalyze} disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-xl shadow-slate-200">

                            {loading ? <><Loader2 className="animate-spin" size={20} /> Analiz Ediliyor...</> : 'Analizi Başlat'}

                        </button>

                    )}

                </div>



                {/* SAĞ PANEL (TEST) */}

                <div className="lg:col-span-7">

                    {activeTab === 'dna' ? (

                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-full relative overflow-hidden">

                            {/* Premium Arkaplan Efekti */}

                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full blur-3xl opacity-50 -z-10"></div>



                            {!testCompleted ? (

                                <div>

                                    <div className="flex justify-between items-center mb-8">

                                        <span className="text-xs font-bold tracking-widest text-amber-600 uppercase flex items-center gap-1"><Crown size={12} /> Premium Envanter</span>

                                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">{currentQuestion + 1} / {questions.length}</span>

                                    </div>

                                    <h3 className="text-xl font-medium text-slate-900 mb-8 leading-relaxed">{questions[currentQuestion].text}</h3>

                                    <div className="space-y-3">

                                        {questions[currentQuestion].options.map((option, idx) => (

                                            <button key={idx} onClick={() => handleOptionSelect(option)} className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition-all text-slate-700 text-sm font-medium">{option}</button>

                                        ))}

                                    </div>

                                </div>

                            ) : (

                                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">

                                    <div className="bg-amber-50 p-6 rounded-full"><Crown size={48} className="text-amber-500" /></div>

                                    <div><h3 className="text-xl font-bold text-slate-900">Profilin Hazır</h3><p className="text-slate-500 mt-2 text-sm">Cevapların kaydedildi. CV verilerinle sentezleniyor.</p></div>

                                    <button onClick={handleAnalyze} disabled={loading} className="px-8 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all flex items-center gap-2">{loading ? <Loader2 className="animate-spin" /> : <>Sonuçları Göster <ArrowRight size={16} /></>}</button>

                                </div>

                            )}

                        </div>

                    ) : (

                        <div className="bg-slate-50 rounded-2xl h-full flex items-center justify-center border border-dashed border-slate-200 text-slate-400 text-sm p-8 text-center">

                            <p>RoleScope AI, CV'nizi ve hedeflerinizi analiz etmek için hazır.</p>

                        </div>

                    )}

                </div>

            </div>

        )}



        {/* --- SONUÇ EKRANI: CV ANALİZİ --- */}

        {result && activeTab === 'cv' && (

            <div className="space-y-8 animate-fade-in">

                <button onClick={() => setResult(null)} className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest flex items-center gap-2">← Yeni Analiz</button>



                {/* 1. ÜST PANEL */}

                <div className="grid md:grid-cols-3 gap-6">

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center relative">

                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Uyum Skoru</h3>

                        <div className="w-32 h-32 relative">

                            <Doughnut data={getScoreData(result.uyum_skoru?.toplam || 0)} options={{ cutout: '80%', plugins: { legend: { display: false } } }} />

                            <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-slate-900">{result.uyum_skoru?.toplam}</div>

                        </div>

                    </div>

                    <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">

                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Yetkinlik Analizi</h3>

                        <div className="h-48 w-full flex justify-center">

                            <Radar data={getRadarData(result.uyum_skoru?.alt_kirimlar)} options={{ maintainAspectRatio: false, scales: { r: { ticks: { display: false }, grid: { color: '#f1f5f9' } } }, plugins: { legend: { display: false } } }} />

                        </div>

                    </div>

                </div>



                {/* 2. ATS & KARAR */}

                <div className="grid md:grid-cols-2 gap-6">

                    <div className={`p-6 rounded-xl border ${result.uyum_skoru?.toplam < 70 ? 'bg-red-50 border-red-100 text-red-900' : 'bg-emerald-50 border-emerald-100 text-emerald-900'}`}>

                        <div className="flex items-center gap-3 mb-2 font-bold">{result.uyum_skoru?.toplam < 70 ? <ShieldAlert size={20} /> : <CheckCircle2 size={20} />} ATS Durumu</div>

                        <p className="text-sm opacity-90">{result.ats_red_sebebi}</p>

                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">

                        <div className="flex items-center gap-3 mb-4 font-bold text-slate-900"><User size={20} /> İşe Alım Kararı</div>

                        <p className="text-sm mb-2"><span className="font-semibold">Karar:</span> {result.hiring_manager_gozuyle?.ise_uygunluk}</p>

                        <div className="flex flex-col gap-1">{result.hiring_manager_gozuyle?.riskler?.map((r: string, i: number) => <span key={i} className="text-slate-500 text-xs flex items-center gap-2">• {r}</span>)}</div>

                    </div>

                </div>



                {/* 3. STRATEJİ & TEKNİK GÖREV (PREMIUM GÖRÜNÜMLÜ) */}

                <div className="grid md:grid-cols-2 gap-6">

                    {/* MAAŞ KARTI - SOFT LOCK GÖRÜNÜMÜ */}

                    <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm relative overflow-hidden">

                         <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">

                            <Unlock size={10} /> BETA'DA AÇIK

                         </div>

                         <div className="flex items-center gap-2 mb-6 text-slate-900">

                            <div className="bg-slate-100 p-2 rounded-lg"><DollarSign size={20} /></div>

                            <h3 className="font-bold">Mülakat Masasındaki Gücün</h3>

                        </div>

                        <p className="text-lg text-slate-700 italic font-medium mb-6">"{result.pazarlik_stratejisi?.taktik_cumlesi}"</p>

                        <div className="space-y-3">

                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kullanabileceğin Kozlar</span>

                            <div className="flex flex-wrap gap-2">

                                {result.pazarlik_stratejisi?.masadaki_kozlarin?.map((k: string, i: number) => (

                                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium border border-slate-200">{k}</span>

                                ))}

                            </div>

                        </div>

                    </div>



                    <div className="bg-slate-900 text-white rounded-xl p-8 shadow-xl">

                        <div className="flex items-center gap-2 mb-6 text-slate-400">

                            <div className="bg-slate-800 p-2 rounded-lg"><Award size={20} /></div>

                            <h3 className="font-bold uppercase tracking-widest text-xs">Teknik Kanıt Görevi</h3>

                        </div>

                        <h4 className="text-lg font-semibold mb-4 text-white">{result.teknik_kanit_gorevi?.proje_fikri}</h4>

                        <ul className="space-y-3 text-slate-300 text-sm">

                            {result.teknik_kanit_gorevi?.nasil_yapilir?.map((step: string, i: number) => (

                                <li key={i} className="flex gap-3"><ArrowRight size={16} className="mt-0.5 flex-shrink-0 text-emerald-400" /> {step}</li>

                            ))}

                        </ul>

                    </div>

                </div>

            </div>

        )}



        {/* --- SONUÇ EKRANI: DNA ANALİZİ (ESKİ) --- */}

        {result && activeTab === 'dna' && (

            <div className="space-y-12 animate-fade-in relative">

                 <button onClick={() => { setResult(null); setTestCompleted(false); setCurrentQuestion(0); }} className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest flex items-center gap-2">← Testi Yeniden Başlat</button>



                {/* PREMIUM TAG */}

                <div className="absolute top-0 right-0">

                    <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">

                        <Crown size={14} /> PREMIUM RAPOR

                    </div>

                </div>



                <div className="text-center max-w-3xl mx-auto">

                    <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase border border-slate-200 px-3 py-1 rounded-full">Kariyer Arketipi</span>

                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 mt-6 mb-4">{result.arketip_profili?.ana}</h1>

                    <p className="text-xl text-slate-500 font-light leading-relaxed">{result.karakter_ozeti}</p>

                </div>



                <div className="grid md:grid-cols-2 gap-8">

                    <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">

                        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2"><Layers size={20} /> Çalışma Dinamikleri</h3>

                        <div className="space-y-5">

                            {result.calisma_dinamigi && Object.entries(result.calisma_dinamigi).map(([key, value], index) => (

                                <div key={index}>

                                    <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold mb-2"><span>{key.split('_')[0]}</span><span>{key.split('_')[1]}</span></div>

                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden relative"><div className="absolute top-0 left-0 h-full bg-slate-800 w-1/2 rounded-full"></div></div>

                                    <p className="text-xs text-slate-500 mt-2 font-medium">{value as string}</p>

                                </div>

                            ))}

                        </div>

                    </div>



                    <div className="bg-slate-900 text-white rounded-xl p-8 shadow-xl">

                        <h3 className="font-bold text-white mb-8 flex items-center gap-2"><TrendingUp size={20} /> Stratejik Yol Haritası</h3>

                        <div className="space-y-8 relative">

                            <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-800"></div>

                            {['1_yil', '3_yil', '5_yil'].map((year, i) => (

                                <div key={i} className="relative pl-10">

                                    <div className="absolute left-0 top-1 w-6 h-6 bg-slate-800 border border-slate-600 rounded-full flex items-center justify-center text-[10px] font-bold text-emerald-400">{year[0]}</div>

                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{year.replace('_', '. ')} Hedefi</h4>

                                    <p className="text-slate-300 text-sm leading-relaxed">{result.kariyer_stratejisi?.[year]}</p>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>

            </div>

        )}

      </main>

    </div>

  );

}
