/**
 * ERKAN AI — نبض المنشور المبسّط: سؤال فصيح واحد، وقت واضح، ومساحة مطمئنة للجواب باللهجة.
 * القاعدة الأسلوبية: لا لوحات تحكم ولا تشتيت؛ مركز الثقل هو الكلمة والسؤال والجواب المحلي.
 */
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, Clock3, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";

type Prompt = {
  type: "سؤال بالفصحى" | "كلمة بالفصحى";
  text: string;
  supportingText: string;
};

const prompts: Prompt[] = [
  {
    type: "سؤال بالفصحى",
    text: "كيف تصف صباحًا مثاليًا بالنسبة لك؟",
    supportingText: "لا توجد إجابة نموذجية؛ اكتب كما تتحدث عادةً.",
  },
  {
    type: "كلمة بالفصحى",
    text: "السَّمَر",
    supportingText: "ماذا تعني لك هذه الكلمة؟ عبّر عنها بطريقتك.",
  },
  {
    type: "سؤال بالفصحى",
    text: "ما أكثر شيء يجعلك تشعر بالراحة في يومك؟",
    supportingText: "أجب بصيغة طبيعية وباللهجة التي تستخدمها مع من حولك.",
  },
  {
    type: "كلمة بالفصحى",
    text: "الأُلْفَة",
    supportingText: "اكتب أول معنى أو موقف يخطر في بالك، بلهجتك المحلية.",
  },
  {
    type: "سؤال بالفصحى",
    text: "ماذا تقول لصديقك عندما تريد أن تشجعه؟",
    supportingText: "يمكنك كتابة جملة قصيرة كما تنطقها في الواقع.",
  },
  {
    type: "سؤال بالفصحى",
    text: "كيف تسأل شخصًا قريبًا عن أحواله؟",
    supportingText: "اكتب التحية أو السؤال بأسلوبك المحلي المعتاد.",
  },
];

const TOTAL_SECONDS = 60;

function formatTime(seconds: number) {
  return `00:${String(seconds).padStart(2, "0")}`;
}

export default function Home() {
  const [promptIndex, setPromptIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [answer, setAnswer] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const currentPrompt = prompts[promptIndex];
  const progress = (secondsLeft / TOTAL_SECONDS) * 100;
  const ringOffset = useMemo(() => 213.6 - (213.6 * progress) / 100, [progress]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      setIsComplete(true);
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((time) => Math.max(0, time - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  const resetCurrentPrompt = () => {
    setSecondsLeft(TOTAL_SECONDS);
    setIsComplete(false);
  };

  const goToNextPrompt = (event?: FormEvent) => {
    event?.preventDefault();
    const hasAnswer = answer.trim().length > 0;

    if (hasAnswer) {
      toast.success("تم حفظ جوابك كما كتبته.");
    } else {
      toast.message("انتقلت من دون كتابة جواب.");
    }

    setPromptIndex((index) => (index + 1) % prompts.length);
    setAnswer("");
    setSecondsLeft(TOTAL_SECONDS);
    setIsComplete(false);
  };

  return (
    <main dir="rtl" className="dialect-site">
      <div className="ambient-light ambient-one" />
      <div className="ambient-light ambient-two" />

      <header className="site-header">
        <a className="site-brand" href="#main-question" aria-label="ERKAN AI">
          <span className="brand-glyph" aria-hidden="true"><i /><b /></span>
          <span><b>ERKAN AI</b><small>مساحة اللهجة</small></span>
        </a>
        <div className="header-note"><span /> سؤال واحد · دقيقة واحدة</div>
      </header>

      <section id="main-question" className="question-stage" aria-labelledby="question-title">
        <aside className="side-rail session-rail" aria-label="معلومات الجلسة">
          <p>الجلسة الحالية</p>
          <strong>دقيقة <span>بصوتك</span></strong>
          <div className="named-signal"><span>مسار الإشارة</span><i><b /><b /><b /></i></div>
          <small>السؤال {String(promptIndex + 1).padStart(2, "0")} من {String(prompts.length).padStart(2, "0")}</small>
        </aside>

        <div className="stage-core">
          <div className="stage-art" aria-hidden="true" />
          <div className="question-card">
          <div className="card-topline">
            <span className="prompt-type"><Sparkles size={14} /> {currentPrompt.type}</span>
            <span className="topline-meta"><span className="card-brand-stamp"><span className="brand-glyph" aria-hidden="true"><i /><b /></span><b>ERKAN AI</b></span><span className="question-count">{String(promptIndex + 1).padStart(2, "0")} / {String(prompts.length).padStart(2, "0")}</span></span>
          </div>

          <div className="question-zone">
            <div className="timer-column" aria-label={`الوقت المتبقي ${formatTime(secondsLeft)}`}>
              <div className={`timer-ring ${secondsLeft <= 10 ? "is-urgent" : ""}`}>
                <svg viewBox="0 0 80 80" aria-hidden="true">
                  <circle className="timer-base" cx="40" cy="40" r="34" />
                  <circle className="timer-progress" cx="40" cy="40" r="34" style={{ strokeDashoffset: ringOffset }} />
                </svg>
                <span>{formatTime(secondsLeft)}</span>
              </div>
              <div className="timer-caption"><Clock3 size={13} /> الوقت المتبقي</div>
              <button className="restart-button" onClick={resetCurrentPrompt} title="إعادة 60 ثانية"><RotateCcw size={14} /> إعادة</button>
            </div>

            <div className="question-copy">
              <p className="mini-label">{currentPrompt.type}</p>
              <h1 id="question-title">{currentPrompt.text}</h1>
              <p>{currentPrompt.supportingText}</p>
            </div>
          </div>

          <form className="answer-form" onSubmit={goToNextPrompt}>
            <label htmlFor="dialect-answer">اكتب جوابك بلهجتك</label>
            <div className={`answer-box ${isComplete ? "is-complete" : ""}`}>
              <textarea
                id="dialect-answer"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="مثال: أكتب مثل ما تتكلم عادةً…"
                maxLength={280}
                autoFocus
              />
              <div className="answer-footer">
                <span>{answer.length} / 280</span>
                {isComplete ? <b><Clock3 size={14} /> انتهت الدقيقة</b> : <b><Check size={14} /> اللهجة المحلية مرحّب بها</b>}
              </div>
            </div>

            <div className="form-actions">
              <p>تظل إجابتك بلهجتك، من غير تحويل إلى الفصحى.</p>
              <button className="next-button" type="submit">
                {isComplete ? "انتقل إلى السؤال التالي" : "احفظ وانتقل إلى السؤال التالي"}
                <ChevronLeft size={17} />
              </button>
            </div>
          </form>
          </div>

          <footer className="stage-footer">
            <span className="footer-signal"><i /><b /><i /></span>
            اقرأ النص بالفصحى، ثم أجب باللهجة التي تستخدمها فعلًا.
          </footer>
        </div>

        <aside className="side-rail guidance-rail" aria-label="تذكير بالأسلوب">
          <p>تذكير قصير</p>
          <strong>اكتب كما تنطقها، لا كما تُصحّحها.</strong>
          <span className="guide-mark"><i /><b /></span>
        </aside>
      </section>
    </main>
  );
}
