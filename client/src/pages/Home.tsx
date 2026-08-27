/**
 * ERKAN AI — نبض المنشور المبسّط: يختار المستخدم لهجته أولًا ثم يكتب مقابل الكلمات الفصحى بها.
 * القاعدة الأسلوبية: تبقى الفصحى في بطاقة الكلمة، وتصبح لهجة المستخدم هي مساحة التعبير الوحيدة.
 */
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, Clock3, MapPin, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";

type Dialect = {
  id: string;
  label: string;
  region: string;
  example: string;
};

type WordPrompt = {
  word: string;
  hint: string;
};

const dialects: Dialect[] = [
  { id: "egypt", label: "المصرية", region: "مصر", example: "مثل: إزيك؟" },
  { id: "gulf", label: "الخليجية", region: "الخليج العربي", example: "مثل: شلونك؟" },
  { id: "levant", label: "الشامية", region: "بلاد الشام", example: "مثل: شو الأخبار؟" },
  { id: "iraq", label: "العراقية", region: "العراق", example: "مثل: شلونك؟" },
  { id: "maghreb", label: "المغاربية", region: "المغرب العربي", example: "مثل: كيداير؟" },
  { id: "other", label: "لهجتي الخاصة", region: "أي منطقة أخرى", example: "اكتب كما تتكلم" },
];

const words: WordPrompt[] = [
  { word: "الطريق", hint: "ما الكلمة التي تستخدمها عادةً بدل «الطريق» في لهجتك؟" },
  { word: "النافذة", hint: "كيف تسمّي «النافذة» عندما تتحدث بلهجتك؟" },
  { word: "المنزل", hint: "ما المقابل الذي تستعمله لكلمة «المنزل» في لهجتك؟" },
  { word: "الصباح", hint: "كيف تشير إلى «الصباح» في حديثك اليومي؟" },
  { word: "القريب", hint: "اكتب الكلمة التي تستعملها لمعنى «القريب» بلهجتك." },
  { word: "الماء", hint: "كيف تقول «الماء» في لهجتك اليومية؟" },
];

const TOTAL_SECONDS = 60;

function formatTime(seconds: number) {
  return `00:${String(seconds).padStart(2, "0")}`;
}

export default function Home() {
  const [selectedDialect, setSelectedDialect] = useState<Dialect | null>(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [answer, setAnswer] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const currentWord = words[wordIndex];
  const progress = (secondsLeft / TOTAL_SECONDS) * 100;
  const ringOffset = useMemo(() => 213.6 - (213.6 * progress) / 100, [progress]);

  useEffect(() => {
    if (!selectedDialect || secondsLeft <= 0) {
      if (selectedDialect && secondsLeft <= 0) setIsComplete(true);
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((time) => Math.max(0, time - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [selectedDialect, secondsLeft]);

  const startDialect = (dialect: Dialect) => {
    setSelectedDialect(dialect);
    setWordIndex(0);
    setSecondsLeft(TOTAL_SECONDS);
    setAnswer("");
    setIsComplete(false);
  };

  const resetCurrentWord = () => {
    setSecondsLeft(TOTAL_SECONDS);
    setIsComplete(false);
  };

  const changeDialect = () => {
    setSelectedDialect(null);
    setWordIndex(0);
    setSecondsLeft(TOTAL_SECONDS);
    setAnswer("");
    setIsComplete(false);
  };

  const goToNextWord = (event?: FormEvent) => {
    event?.preventDefault();

    if (answer.trim()) {
      toast.success(`تم حفظ كلمتك باللهجة ${selectedDialect?.label ?? "المختارة"}.`);
    } else {
      toast.message("انتقلت من دون كتابة كلمة.");
    }

    setWordIndex((index) => (index + 1) % words.length);
    setAnswer("");
    setSecondsLeft(TOTAL_SECONDS);
    setIsComplete(false);
  };

  if (!selectedDialect) {
    return (
      <main dir="rtl" className="dialect-site picker-site">
        <div className="ambient-light ambient-one" />
        <div className="ambient-light ambient-two" />
        <header className="site-header">
          <div className="site-brand">
            <span className="brand-glyph" aria-hidden="true"><i /><b /></span>
            <span><b>ERKAN AI</b><small>مساحة اللهجة</small></span>
          </div>
          <div className="header-note"><span /> خطوة البداية</div>
        </header>

        <section className="dialect-picker" aria-labelledby="dialect-title">
          <aside className="picker-rail picker-rail-right" aria-label="خطوات التجربة">
            <span>المسار</span>
            <strong>01<br /><em>اختر لهجتك</em></strong>
            <i><b /><b /><b /></i>
            <small>02 اكتب المقابل المحلي</small>
          </aside>

          <div className="picker-main">
            <div className="picker-brand-anchor"><span className="brand-glyph" aria-hidden="true"><i /><b /></span><b>ERKAN AI</b><small>معجم الصوت المحلي</small></div>
            <div className="picker-signal" aria-hidden="true"><i /><b /><i /></div>
            <p className="picker-kicker"><Sparkles size={14} /> ابدأ من طريقتك في الكلام</p>
            <h1 id="dialect-title">اختر <em>لهجتك</em> أولًا</h1>
            <p className="picker-intro">سنكتب لك كلمات بالعربية الفصحى، وأنت اكتب ما تقوله لها بلهجتك كما تنطقها في الواقع.</p>

            <div className="dialect-grid" role="list" aria-label="اللهجات المتاحة">
              {dialects.map((dialect) => (
                <button key={dialect.id} className="dialect-card" onClick={() => startDialect(dialect)} role="listitem">
                  <span className="dialect-map"><MapPin size={17} /></span>
                  <span className="dialect-info"><b>{dialect.label}</b><small>{dialect.region}</small></span>
                  <span className="dialect-example">{dialect.example}</span>
                  <ChevronLeft className="dialect-arrow" size={17} />
                </button>
              ))}
            </div>
            <p className="picker-footnote">يمكنك تغيير لهجتك في أي وقت قبل الانتقال إلى كلمة جديدة.</p>
            <p className="pre-registration-stat" aria-label="236848 تسجيلًا مسبقًا"><b>236,848</b><span>تسجيلًا مسبقًا</span></p>
          </div>

          <aside className="picker-rail picker-rail-left" aria-label="قاعدة الإجابة">
            <span>قاعدة التجربة</span>
            <strong>الفصحى <em>في الكلمة</em></strong>
            <strong>اللهجة <em>في جوابك</em></strong>
            <i><b /><b /></i>
          </aside>
        </section>
      </main>
    );
  }

  return (
    <main dir="rtl" className="dialect-site">
      <div className="ambient-light ambient-one" />
      <div className="ambient-light ambient-two" />

      <header className="site-header">
        <button className="site-brand brand-button" onClick={changeDialect} aria-label="تغيير اللهجة">
          <span className="brand-glyph" aria-hidden="true"><i /><b /></span>
          <span><b>ERKAN AI</b><small>مساحة اللهجة</small></span>
        </button>
        <button className="header-note header-dialect" onClick={changeDialect}><MapPin size={13} /><span /> لهجتك: {selectedDialect.label}</button>
      </header>

      <section id="main-word" className="question-stage" aria-labelledby="word-title">
        <aside className="side-rail session-rail" aria-label="معلومات الجلسة">
          <p>اللهجة المختارة</p>
          <strong>{selectedDialect.label}<span>{selectedDialect.region}</span></strong>
          <div className="named-signal"><span>مسار الكلمة</span><i><b /><b /><b /></i></div>
          <small>الكلمة {String(wordIndex + 1).padStart(2, "0")} من {String(words.length).padStart(2, "0")}</small>
        </aside>

        <div className="stage-core">
          <div className="stage-art" aria-hidden="true" />
          <div className="question-card">
            <div className="card-topline">
              <span className="prompt-type"><Sparkles size={14} /> كلمة بالفصحى</span>
              <span className="topline-meta"><span className="card-brand-stamp"><span className="brand-glyph" aria-hidden="true"><i /><b /></span><b>ERKAN AI</b></span><span className="question-count">{String(wordIndex + 1).padStart(2, "0")} / {String(words.length).padStart(2, "0")}</span></span>
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
                <button className="restart-button" onClick={resetCurrentWord} title="إعادة 60 ثانية"><RotateCcw size={14} /> إعادة</button>
              </div>

              <div className="question-copy">
                <p className="mini-label">الكلمة بالفصحى</p>
                <h1 id="word-title">{currentWord.word}</h1>
                <p>{currentWord.hint}</p>
              </div>
            </div>

            <form className="answer-form" onSubmit={goToNextWord}>
              <label htmlFor="dialect-answer">اكتبها بلهجتك {selectedDialect.label}</label>
              <div className={`answer-box ${isComplete ? "is-complete" : ""}`}>
                <textarea
                  id="dialect-answer"
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  placeholder={`اكتب المقابل كما تقوله باللهجة ${selectedDialect.label}…`}
                  maxLength={280}
                  autoFocus
                />
                <div className="answer-footer">
                  <span>{answer.length} / 280</span>
                  {isComplete ? <b><Clock3 size={14} /> انتهت الدقيقة</b> : <b><Check size={14} /> نريدها كما تنطقها</b>}
                </div>
              </div>

              <div className="form-actions">
                <p>الكلمة الظاهرة فصحى؛ إجابتك تبقى بلهجتك المختارة.</p>
                <button className="next-button" type="submit">
                  {isComplete ? "انتقل إلى الكلمة التالية" : "احفظ وانتقل إلى الكلمة التالية"}
                  <ChevronLeft size={17} />
                </button>
              </div>
            </form>
          </div>

          <footer className="stage-footer">
            <span className="footer-signal"><i /><b /><i /></span>
            اقرأ الكلمة بالفصحى، ثم اكتب ما تقوله لها بلهجتك.
            <span className="footer-stat"><b>236,848</b> تسجيلًا مسبقًا</span>
          </footer>
        </div>

        <aside className="side-rail guidance-rail" aria-label="تذكير بالأسلوب">
          <p>تذكير قصير</p>
          <strong>اكتبها كما تقولها، لا كما تُصحّحها.</strong>
          <span className="guide-mark"><i /><b /></span>
        </aside>
      </section>
    </main>
  );
}
