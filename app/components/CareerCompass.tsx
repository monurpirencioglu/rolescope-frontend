"use client";

import { useState } from "react";
import { ArrowRight, RefreshCcw, Target } from "lucide-react";

const QUESTIONS = [
  {
    id: 1,
    text: "Belirsiz bir görev verildiğinde ne yaparsın?",
    options: [
      { text: "Hemen başlarım", scores: { ambiguity: 2, pace: 1 } },
      { text: "Analiz ederim", scores: { depth: 2 } },
      { text: "Konuşurum", scores: { people: 2 } },
      { text: "Netlik beklerim", scores: { autonomy: -1 } }
    ]
  },
  {
    id: 2,
    text: "Bir işte seni en çok ne yorar?",
    options: [
      { text: "Anlamsız toplantılar", scores: { depth: 1 } },
      { text: "Tek başına kalmak", scores: { people: -1 } },
      { text: "Net hedef olmaması", scores: { ambiguity: -1 } },
      { text: "Yavaş ilerlemek", scores: { pace: 2 } }
    ]
  },
  {
    id: 3,
    text: "Bir problemi çözmek senin için ne demek?",
    options: [
      { text: "Kök nedenini bulmak", scores: { depth: 2 } },
      { text: "İnsanları hizalamak", scores: { people: 2 } },
      { text: "Hızlı çözüm üretmek", scores: { pace: 2 } },
      { text: "Sistemi kurmak", scores: { autonomy: 1 } }
    ]
  },
  {
    id: 4,
    text: "Nasıl bir ortamda daha iyi çalışırsın?",
    options: [
      { text: "Hızlı ve kaotik", scores: { ambiguity: 2 } },
      { text: "Sessiz ve derin", scores: { depth: 2 } },
      { text: "İnsanlarla iç içe", scores: { people: 2 } },
      { text: "Kuralları belli", scores: { autonomy: -1 } }
    ]
  },
  {
    id: 5,
    text: "Bir işi neden yaparsın?",
    options: [
      { text: "Etki yaratmak için", scores: { motivation: 2 } },
      { text: "Öğrenmek için", scores: { depth: 1 } },
      { text: "Takdir edilmek için", scores: { people: 1 } },
      { text: "Güvenli olduğu için", scores: { autonomy: -1 } }
    ]
  },
  {
    id: 6,
    text: "Zor bir karar alman gerektiğinde?",
    options: [
      { text: "Risk alırım", scores: { ambiguity: 2 } },
      { text: "Veriye bakarım", scores: { depth: 2 } },
      { text: "Danışırım", scores: { people: 2 } },
      { text: "Kaçınırım", scores: { pace: -1 } }
    ]
  },
  {
    id: 7,
    text: "Bir projede en keyif aldığın an?",
    options: [
      { text: "Fikir aşaması", scores: { ambiguity: 1 } },
      { text: "Planlama", scores: { depth: 1 } },
      { text: "Uygulama", scores: { pace: 2 } },
      { text: "Sonuç paylaşımı", scores: { people: 1 } }
    ]
  },
  {
    id: 8,
    text: "Tek başına çalışmak?",
    options: [
      { text: "Enerji verir", scores: { autonomy: 2 } },
      { text: "Sıkar", scores: { people: -1 } },
      { text: "Duruma bağlı", scores: {} },
      { text: "Zorlanırım", scores: { autonomy: -1 } }
    ]
  },
  {
    id: 9,
    text: "Yeni bir konu öğrenirken?",
    options: [
      { text: "Derine inerim", scores: { depth: 2 } },
      { text: "Hızlıca denerim", scores: { pace: 2 } },
      { text: "Birine sorarım", scores: { people: 1 } },
      { text: "Gerekmedikçe öğrenmem", scores: { motivation: -1 } }
    ]
  },
  {
    id: 10,
    text: "Başarı senin için?",
    options: [
      { text: "Ölçülebilir sonuç", scores: { motivation: 2 } },
      { text: "İnsanların faydalanması", scores: { people: 2 } },
      { text: "Zor problemi çözmek", scores: { depth: 2 } },
      { text: "Sorunsuz ilerleme", scores: { ambiguity: -1 } }
    ]
  },
  {
    id: 11,
    text: "Baskı altında?",
    options: [
      { text: "Daha iyi çalışırım", scores: { pace: 2 } },
      { text: "Donarım", scores: { pace: -1 } },
      { text: "Sakinleşirim", scores: { depth: 1 } },
      { text: "Destek ararım", scores: { people: 1 } }
    ]
  },
  {
    id: 12,
    text: "Bir işi bırakma sebebin?",
    options: [
      { text: "Anlamsız gelmesi", scores: { motivation: -2 } },
      { text: "Gelişim olmaması", scores: { depth: -1 } },
      { text: "İnsan problemi", scores: { people: -1 } },
      { text: "Aşırı stres", scores: { pace: -1 } }
    ]
  }
];

export default function CareerCompass() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleOptionSelect = (option: any) => {
    const currentQ = QUESTIONS[currentStep];
    const newAnswers = { ...answers, [currentQ.id]: option.scores };
    setAnswers(newAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      submitAnalysis(newAnswers);
    }
  };

  const submitAnalysis = async (finalAnswers: any) => {
    setLoading(true);
    try {
      // Backend URL'ini buraya sabitliyoruz
      const res = await fetch("https://rolescope-backend.onrender.com/career-compass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Hata:", error);
      alert("Analiz sırasında bir hata oluştu. Backend çalışıyor mu?");
    } finally {
      setLoading(false);
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  };

  if (result) {
    return (
      <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 text-white max-w-2xl mx-auto shadow-2xl mt-10">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-green-500/20 rounded-full mb-4">
            <Target className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Analiz Tamamlandı!</h2>
          <p className="text-gray-400">Senin çalışma karakterine en uygun roller:</p>
        </div>

        <div className="space-y-4 mb-8">
          {result.top_matches.map((match: any, index: number) => (
            <div key={index} className="bg-gray-800 p-5 rounded-xl border border-gray-700 flex items-center justify-between hover:border-green-500/50 transition-colors">
              <div>
                <h3 className="text-xl font-bold text-white">{match.role}</h3>
                <p className="text-sm text-gray-400 mt-1">Uyum Skoru</p>
              </div>
              <div className="text-right">
                <span className={`text-2xl font-bold ${index === 0 ? 'text-green-400' : 'text-blue-400'}`}>
                  %{match.match_score}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button onClick={restart} className="w-full py-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-white font-semibold transition-colors flex items-center justify-center gap-2">
          <RefreshCcw className="w-5 h-5" />
          Testi Tekrarla
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-20 text-white mt-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-xl">Yapay zeka profilini analiz ediyor...</p>
      </div>
    );
  }

  const currentQ = QUESTIONS[currentStep];
  const progress = ((currentStep) / QUESTIONS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto mt-12 mb-20 px-4">
       <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Kariyer Pusulası 🧭</h2>
        <p className="text-gray-400 text-sm">CV yüklemeden, 12 soruda karakterine uygun mesleği bul.</p>
      </div>

      <div className="w-full bg-gray-800 h-2 rounded-full mb-8">
        <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-xl min-h-[300px] flex flex-col justify-center">
        <span className="text-blue-400 font-medium text-sm mb-4 block">Soru {currentStep + 1} / {QUESTIONS.length}</span>

        <h2 className="text-xl md:text-2xl font-bold text-white mb-8 leading-tight">
          {currentQ.text}
        </h2>

        <div className="grid grid-cols-1 gap-3">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
              className="w-full text-left p-4 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-all duration-200 group flex items-center justify-between"
            >
              <span className="text-gray-300 group-hover:text-white font-medium">{option.text}</span>
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}