/**
 * ERKAN AI — نبض المنشور: رحلة من ثلاث محطات، ترحيب ثم لهجة ثم تدريب فصيح بصوت المستخدم.
 * القاعدة البصرية: الواجهة هادئة ومضيئة بالإشارة الزرقاء، فيما تظل إجابة المستخدم باللهجة هي نقطة الفعل.
 */
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, ChevronLeft, Clock3, MapPin, Play, RotateCcw, Sparkles, Volume2 } from "lucide-react";
import { toast } from "sonner";

type Stage = "welcome" | "dialect" | "practice";

type Dialect = {
  id: string;
  label: string;
  region: string;
  sample: string;
};

type Prompt = {
  kind: "كلمة فصيحة" | "نص فصيح";
  category: "فعل" | "اسم" | "صفة" | "تعبير";
  text: string;
  helper: string;
};

const dialects: Dialect[] = [
  { id: "egypt", label: "المصرية", region: "مصر", sample: "إزيك؟" },
  { id: "gulf", label: "الخليجية", region: "الخليج العربي", sample: "شلونك؟" },
  { id: "levant", label: "الشامية", region: "بلاد الشام", sample: "شو الأخبار؟" },
  { id: "iraq", label: "العراقية", region: "العراق", sample: "شلونك؟" },
  { id: "maghreb", label: "المغاربية", region: "المغرب العربي", sample: "كيداير؟" },
  { id: "other", label: "لهجتي الخاصة", region: "منطقة أخرى", sample: "اكتب كما تتكلم" },
];

const prompts: Prompt[] = [
  { kind: "كلمة فصيحة", category: "فعل", text: "ذهب", helper: "كيف تقول هذه الكلمة في حديثك اليومي؟" },
  { kind: "كلمة فصيحة", category: "فعل", text: "سأل", helper: "اكتب المقابل الذي تستعمله لهذه الكلمة في لهجتك." },
  { kind: "كلمة فصيحة", category: "اسم", text: "المنزل", helper: "بأي كلمة تشير إلى هذا المكان عندما تتحدث؟" },
  { kind: "كلمة فصيحة", category: "اسم", text: "النافذة", helper: "اكتب ما تسميه بلهجتك، كما تنطقه عادةً." },
  { kind: "كلمة فصيحة", category: "صفة", text: "قريب", helper: "ما الكلمة التي تستعملها بدل هذه الصفة؟" },
  { kind: "كلمة فصيحة", category: "صفة", text: "هادئ", helper: "كيف تصف شخصًا أو مكانًا بهذه الصفة في لهجتك؟" },
  { kind: "نص فصيح", category: "تعبير", text: "أحتاج إلى وقتٍ لأفكّر في الأمر.", helper: "اكتب هذا المعنى بصياغتك ولهجتك الطبيعية." },
  { kind: "نص فصيح", category: "تعبير", text: "ذهب إلى المنزل بعد انتهاء العمل.", helper: "كيف تقول هذه الجملة كما تتحدث مع من حولك؟" },
  { kind: "نص فصيح", category: "تعبير", text: "هل تستطيع مساعدتي في هذا الأمر؟", helper: "اكتبها بلهجتك من دون تحويلها إلى الفصحى." },
  { kind: "نص فصيح", category: "تعبير", text: "أصبح الطريق طويلًا اليوم.", helper: "عبّر عن المعنى نفسه بلهجتك المعتادة." },
];

const ROUND_SECONDS = 60;

function timeLabel(seconds: number) {
  return `00:${String(seconds).padStart(2, "0")}`;
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("welcome");
  const [selectedDialect, setSelectedDialect] = useState<Dialect | null>(null);
  const [promptIndex, setPromptIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);
  const [answer, setAnswer] = useState("");
  const [roundEnded, setRoundEnded] = useState(false);
  const [completedRounds, setCompletedRounds] = useState(0);

  const prompt = prompts[promptIndex];
  const timeProgress = (secondsLeft / ROUND_SECONDS) * 100;
  const ringOffset = useMemo(() => 213.6 - (213.6 * timeProgress) / 100, [timeProgress]);

  useEffect(() => {
    if (stage !== "practice" || roundEnded || secondsLeft <= 0) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [stage, roundEnded, secondsLeft]);

  useEffect(() => {
    if (stage === "practice" && secondsLeft === 0 && !roundEnded) {
      setRoundEnded(true);
      toast.message("انتهت الدقيقة. يمكنك حفظ إجابتك والانتقال.");
    }
  }, [stage, secondsLeft, roundEnded]);

  const begin = () => setStage("dialect");

  const chooseDialect = (dialect: Dialect) => {
    setSelectedDialect(dialect);
    setStage("practice");
    setSecondsLeft(ROUND_SECONDS);
    setRoundEnded(false);
    setAnswer("");
  };

  const restartRound = () => {
    setSecondsLeft(ROUND_SECONDS);
    setRoundEnded(false);
  };

  const nextPrompt = (event?: FormEvent) => {
    event?.preventDefault();
    if (answer.trim()) {
      toast.success("حُفظت إجابتك بلهجتك.");
    } else {
      toast.message("انتقلت من دون إجابة لهذه الجولة.");
    }
    setPromptIndex((index) => (index + 1) % prompts.length);
    setCompletedRounds((value) => value + 1);
    setAnswer("");
    setSecondsLeft(ROUND_SECONDS);
    setRoundEnded(false);
  };

  if (stage === "welcome") {
    return (
      <main dir="rtl" className="erkan-flow welcome-screen">
        <div className="ambient-light ambient-one" />
        <div className="ambient-light ambient-two" />
        <header className="flow-header"><Brand /><span className="header-step"><i /> البداية</span></header>
        <section className="welcome-stage" aria-labelledby="welcome-title">
          <div className="welcome-side welcome-side-right"><span>المسار 01</span><i /><b>رسالة<br />ترحيبية</b><small>02 اختر لهجتك</small></div>
          <div className="welcome-core">
            <div className="welcome-mark" aria-hidden="true"><span className="brand-glyph"><i /><b /></span><em /><em /><em /></div>
            <p className="eyebrow"><Sparkles size={14} /> مساحة اللهجة العربية</p>
            <h1 id="welcome-title">ثبّت <em>صوتك المحلي</em> قبل البدء</h1>
            <p className="welcome-copy">مرحبًا بك في ERKAN AI. اختر لهجتك، ثم عبّر بها كما تستخدمها في حياتك اليومية؛ لا نعيد كتابة صوتك بالفصحى.</p>
            <div className="welcome-context"><span>إجراء الجولة</span><b>اقرأ فصيحًا، ثم اكتب بصوتك الحقيقي</b><SignalLine /></div>
            <button className="continue-button" onClick={begin}>متابعة <ArrowLeft size={18} /></button>
            <p className="welcome-note">ثلاث خطوات قصيرة · دقيقة واحدة لكل جولة</p>
          </div>
          <div className="welcome-side welcome-side-left"><span>سياق الجولة</span><i /><b>نص فصيح<br />وجواب محلي</b><small>03 أجب بلهجتك</small></div>
        </section>
        <footer className="flow-footer"><SignalLine /> الفصحى في النص، ولهجتك في الإجابة.</footer>
      </main>
    );
  }

  if (stage === "dialect") {
    return (
      <main dir="rtl" className="erkan-flow picker-screen">
        <div className="ambient-light ambient-one" />
        <div className="ambient-light ambient-two" />
        <header className="flow-header"><Brand /><span className="header-step"><i /> الخطوة 01 من 03</span></header>
        <section className="dialect-stage" aria-labelledby="dialect-title">
          <aside className="journey-rail journey-right"><span>المسار</span><b>01 <em>اختر لهجتك</em></b><SignalLine /><small>02 اقرأ النص الفصيح</small></aside>
          <div className="dialect-core">
            <div className="brand-badge"><span className="brand-glyph"><i /><b /></span><b>ERKAN AI</b><small>معجم الصوت المحلي</small></div>
            <p className="eyebrow"><Sparkles size={14} /> هذه نقطة البداية</p>
            <h1 id="dialect-title">اختر <em>لهجتك</em></h1>
            <p className="stage-intro">سنكتب لك كلمات ونصوصًا بالفصحى. اكتب مقابلها بصوتك ولهجتك كما تنطقها فعلًا.</p>
            <div className="dialect-grid" role="list" aria-label="اللهجات المتاحة">
              {dialects.map((dialect) => (
                <button className="dialect-card" key={dialect.id} onClick={() => chooseDialect(dialect)} role="listitem">
                  <span className="dialect-icon"><MapPin size={17} /></span>
                  <span><b>{dialect.label}</b><small>{dialect.region}</small></span>
                  <em>مثل: {dialect.sample}</em><ChevronLeft size={17} />
                </button>
              ))}
            </div>
            <p className="stage-footnote">يمكنك تغيير اللهجة لاحقًا من أعلى الشاشة.</p>
          </div>
          <aside className="journey-rail journey-left"><span>القاعدة</span><b>الفصحى <em>في النص</em></b><b>لهجتك <em>في الجواب</em></b><SignalLine /></aside>
        </section>
      </main>
    );
  }

  return (
    <main dir="rtl" className="erkan-flow practice-screen">
      <div className="ambient-light ambient-one" />
      <div className="ambient-light ambient-two" />
      <header className="flow-header"><button className="brand-button" onClick={() => setStage("dialect")} aria-label="تغيير اللهجة"><Brand /></button><button className="dialect-switch" onClick={() => setStage("dialect")}><MapPin size={13} /> لهجتك: {selectedDialect?.label}</button></header>
      <section className="practice-stage" aria-labelledby="prompt-title">
        <aside className="practice-rail profile-rail"><span>اللهجة المختارة</span><strong>{selectedDialect?.label}<em>{selectedDialect?.region}</em></strong><SignalLine /><small>الجولة {String(completedRounds + 1).padStart(2, "0")}</small></aside>
        <div className="practice-core">
          <div className="signal-orbit" aria-hidden="true"><i /><b /><i /></div>
          <article className="prompt-card">
            <div className="prompt-top"><span><Sparkles size={14} /> {prompt.kind}</span><b>{String(promptIndex + 1).padStart(2, "0")} / {String(prompts.length).padStart(2, "0")}</b></div>
            <div className="prompt-main">
              <div className="timer-panel">
                <div className={`timer-ring ${secondsLeft <= 10 ? "is-urgent" : ""}`}><svg viewBox="0 0 80 80" aria-hidden="true"><circle className="timer-track" cx="40" cy="40" r="34" /><circle className="timer-value" cx="40" cy="40" r="34" style={{ strokeDashoffset: ringOffset }} /></svg><b>{timeLabel(secondsLeft)}</b></div>
                <small><Clock3 size={13} /> الوقت المتبقي</small>
                <button onClick={restartRound} title="إعادة المدة"><RotateCcw size={14} /> إعادة</button>
              </div>
              <div className="prompt-copy">
                <p><span>{prompt.category}</span> نص بالعربية الفصحى</p>
                <h1 id="prompt-title" key={promptIndex}>{prompt.text}</h1>
                <small>{prompt.helper}</small>
              </div>
            </div>
            <form className="response-form" onSubmit={nextPrompt}>
              <label htmlFor="dialect-response">اكتب إجابتك بلهجتك {selectedDialect?.label}</label>
              <div className={`response-box ${roundEnded ? "round-ended" : ""}`}>
                <textarea id="dialect-response" value={answer} onChange={(event) => setAnswer(event.target.value)} maxLength={320} autoFocus placeholder={`اكتبها كما تقولها باللهجة ${selectedDialect?.label}…`} />
                <div><span>{answer.length} / 320</span><b>{roundEnded ? <><Clock3 size={14} /> انتهت الجولة</> : <><Volume2 size={14} /> اكتب كما تتحدث</>}</b></div>
              </div>
              <div className="response-actions"><p>الإجابة لا تُحوّل إلى الفصحى؛ نريد صياغتك الحقيقية.</p><button type="submit">احفظ وانتقل <ChevronLeft size={17} /></button></div>
            </form>
          </article>
          <footer className="flow-footer"><SignalLine /> جولة {completedRounds + 1} · تتغير الكلمة أو العبارة بعد الحفظ.</footer>
        </div>
        <aside className="practice-rail guide-rail"><span>تذكير</span><strong>اكتبها كما تقولها، لا كما تُصحّحها.</strong><SignalLine /><small>كلمات ونصوص فصحى</small></aside>
      </section>
    </main>
  );
}

function Brand() {
  return <span className="site-brand"><span className="brand-glyph" aria-hidden="true"><i /><b /></span><span><b>ERKAN AI</b><small>مساحة اللهجة</small></span></span>;
}

function SignalLine() {
  return <span className="signal-line" aria-hidden="true"><i /><b /><i /></span>;
}
