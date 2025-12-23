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
  Lightbulb,
  Info,
  Briefcase,
  Brain,
  Target,
  XCircle,
  Loader2,
  Database
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
    let interval: any;
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
    { id: 7, text: "Yöneticinden sert bir olumsuz geri bildirim aldığında ne yaparsın?", options: ["Önce savunmaya geçerim, haksızlık yapıldığını düşünürüm.", "Duygusal olarak düşerim ama sonra toparlarım.", "Teşekkür eder, hemen düzeltmek için plan yaparım.", "Verilerle hatanın bende olmadığını kanıtlamaya çalışırım."] },
    { id: 8, text: "Zaman çok kısıtlı ve veri yok. Kritik bir karar vermen lazım. Ne yaparsın?", options: ["İçgüdülerime güvenir, kararı veririm.", "Kararı erteler, veri aramaya devam ederim.", "Hızlıca küçük bir test yapar, sonuca göre ilerlerim.", "Sorumluluğu paylaşır, ekibe danışırım."] },
    { id: 10, text: "Takım içinde genellikle hangi rolü üstlenirsin?", options: ["Liderlik eden ve yön gösteren (Kaptan).", "Ortamı yumuşatan ve bağları kuran (Diplomat).", "Eksikleri gören ve eleştirel bakan (Kalite Kontrol).", "Verilen görevi sessizce yapan (Uygulayıcı)."] },
    { id: 11, text: "Seni iş hayatında en çok ne tüketir?", options: ["Mikro yönetim ve sürekli kontrol.", "Yaptığım işin anlamsız olduğunu hissetmek.", "Aşırı belirsizlik ve kaos.", "Sürekli tekrarlayan, monoton işler."] },
    { id: 12, text: "Harika bir iş çıkardım demeni sağlayan nedir?", options: ["Listemdeki tüm maddeleri bitirmek.", "Zor bir sorunu çözmek.", "Takdir ve övgü almak.", "Yeni ve yaratıcı bir şey ortaya koymak."] }
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
    if (file) formData.append("cv", file as any);
    if (activeTab === "cv") formData.append("ilan", ilan);
    else formData.append("answers", JSON.stringify(answers));

    try {
      const endpoint = activeTab === "cv" ? "/analiz-et" : "/analiz-dna";
      const response = await fetch(`${API_URL}${endpoint}`, { method: "POST", body: formData });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert("Hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreData = (score: number) => ({
    labels: ['Uyum', 'Eksik'],
    datasets: [{ data: [score || 0, 100 - (score || 0)], backgroundColor: ['#0f172a', '#e2e8f0'], borderWidth: 0 }]
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
            <p className="text-xl md:text-3xl font-medium text-slate-800 max-w-2xl animate-pulse">
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
                        <input type="file" onChange={(e: any) => setFile(e.target.files ? e.target.files[0] : null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className="flex flex-col items-center text-center">
                            <div className="p-4 bg-white rounded-full mb-4 shadow-sm"><UploadCloud size={24} className="text-slate-600" /></div>
                            <p className="font-medium text-slate-900">{file ? (file as any).name : (activeTab === 'cv' ? "CV Dosyasını Yükle (Zorunlu)" : "CV Dosyasını Yükle (Opsiyonel)")}</p>
                        </div>
                    </div>

                    {activeTab === 'cv' && (
                        <textarea placeholder="İş ilanı metni (Kopyalanamıyorsa unvan yazın)..." className="w-full h-32 p-4 border border-slate-200 rounded-xl outline-none text-sm bg-white" value={ilan} onChange={(e) => setIlan(e.target.value)} />
                    )}

                    <button onClick={handleAnalyze} disabled={!file && activeTab === 'cv'} className="w-full py-4 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50">
                        {activeTab === 'cv' && !file ? "Önce CV Yükleyin" : "Stratejik Analizi Başlat"}
                    </button>
                </div>

                <div className="lg:col-span-7">
                    {activeTab === 'dna' && (
                        <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden h-full">
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
                                    <div className="bg-amber-50 p-6 rounded-full mb-6 text-center"><Crown size={48} className="text-amber-500 mx-auto" /></div>
                                    <h3 className="text-xl font-bold text-slate-900">Profilin Hazır</h3>
                                    <p className="text-slate-500 text-sm mt-2">Karakterin ile profesyonel potansiyelin sentezleniyor.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        ) : (
          /* SONUÇ EKRANI */
          <div className="space-y-12 animate-fade-in text-left">
            <button onClick={() => setResult(null)} className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest flex items-center gap-2">← Yeni Analiz</button>

            {activeTab === 'dna' ? (
              <div className="space-y-12">
                {!file && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-3 text-amber-800 text-sm max-w-4xl mx-auto">
                        <Info size={20} />
                        <span>CV yüklenmediği için bu analiz sadece karakter DNA'nıza dayanmaktadır.</span>
                    </div>
                )}
                <div className="text-center max-w-4xl mx-auto">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase border border-slate-200 px-3 py-1 rounded-full">Kariyer Arketipi</span>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 mt-6 mb-4 leading-tight">{result.arketip_profili?.ana}</h1>
                    
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
                  <p className="text-2xl text-slate-700 leading-relaxed font-medium italic border-l-8 border-slate-900 pl-10 py-6 bg-white rounded-r-[3rem] shadow-sm">
                    "{result.karakter_ozeti}"
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {Object.entries(result.calisma_dinamigi || {}).map(([key, value]: any) => (
                    <div key={key} className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{key.replace(/_/g, ' ')}</p>
                      <p className="text-xl font-bold leading-tight">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-slate-200 rounded-[3rem] p-12 shadow-sm">
                  <h3 className="text-3xl font-black text-slate-900 mb-10 flex items-center gap-4"><Target className="text-slate-900" size={32} /> 5 Yıllık KPI & Gelişim Rotası</h3>
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
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Uyum Skoru</h3>
                            <div className="w-40 h-40 relative">
                                <Doughnut data={getScoreData(result.uyum_skoru?.toplam || 0)} options={{ cutout: '85%', plugins: { legend: { display: false } } }} />
                                <div className="absolute inset-0 flex items-center justify-center text-5xl font-black">{result.uyum_skoru?.toplam}</div>
                            </div>
                        </div>
                        <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Yetkinlik Analizi</h3>
                            <div className="h-56">
                              <Radar 
                                data={getRadarData(result.uyum_skoru?.alt_kirimlar)} 
                                options={{ 
                                  maintainAspectRatio: false, 
                                  scales: { 
                                    r: { 
                                      min: 40, 
                                      max: 100, 
                                      ticks: { display: false }, 
                                      grid: { color: '#f1f5f9' },
                                      angleLines: { color: '#f1f5f9' },
                                      pointLabels: { font: { size: 10, weight: 600 } }
                                    } 
                                  }, 
                                  plugins: { legend: { display: false } } 
                                }} 
                              />
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className={`p-8 rounded-3xl border-2 ${result.uyum_skoru?.toplam < 70 ? 'bg-red-50 border-red-100 text-red-900' : 'bg-emerald-50 border-emerald-100 text-emerald-900'}`}>
                            <div className="flex items-center gap-3 mb-4 font-black uppercase text-sm tracking-widest">{result.uyum_skoru?.toplam < 70 ? <ShieldAlert size={20} /> : <CheckCircle2 size={20} />} ATS Durumu</div>
                            <p className="text-lg font-medium">{result.ats_red_sebebi}</p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-6 font-black uppercase text-sm tracking-widest text-slate-900"><User size={20} /> Hiring Manager Notu</div>
                            <p className="text-slate-700 font-medium mb-4 italic leading-relaxed">"{result.hiring_manager_gozuyle?.ise_uygunluk}"</p>
                            <div className="flex flex-wrap gap-2">{result.hiring_manager_gozuyle?.riskler?.map((r: any, i: number) => <span key={i} className="text-[10px] font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase tracking-tighter">• {r}</span>)}</div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-blue-600 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-6 right-6 bg-white/20 text-[10px] font-bold px-3 py-1 rounded-full tracking-widest">BETA PREMIUM</div>
                            <div className="flex items-center gap-4 mb-8"><div className="bg-white/10 p-3 rounded-2xl"><DollarSign size={24} /></div><h3 className="text-xl font-bold uppercase tracking-tighter">Maaş Pazarlığı Kozun</h3></div>
                            <p className="text-2xl font-black leading-tight mb-8">"{result.pazarlik_stratejisi?.taktik_cumlesi}"</p>
                            <div className="flex flex-wrap gap-2">{result.pazarlik_stratejisi?.masadaki_kozlarin?.map((k: any, i: number) => <span key={i} className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-xs font-bold">{k}</span>)}</div>
                        </div>
                        <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="bg-white/10 p-3 rounded-2xl"><Lightbulb size={24} className="text-amber-400" /></div>
                                <h3 className="text-xl font-bold uppercase tracking-tighter">Teknik Kanıt Görevi</h3>
                            </div>
                            <h4 className="text-2xl font-bold mb-4 text-white leading-tight">{result.teknik_kanit_gorevi?.proje_fikri}</h4>
                            
                            {/* YENİ: VERİ KAYNAĞI REHBERİ */}
                            {result.teknik_kanit_gorevi?.veri_kaynagi_rehberi && (
                              <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-2xl">
                                <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                  <Database size={12} /> Veri Kaynağı Stratejisi
                                </p>
                                <p className="text-xs text-slate-300 leading-relaxed italic">
                                  {result.teknik_kanit_gorevi.veri_kaynagi_rehberi}
                                </p>
                              </div>
                            )}

                            <ul className="space-y-4">
                                {result.teknik_kanit_gorevi?.nasil_yapilir?.map((step: any, i: number) => (
                                    <li key={i} className="flex gap-4 text-slate-400 text-sm font-medium">
                                        <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">{i+1}</div>
                                        {step}
                                    </li>
                                ))}
                            </ul>
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
