/**
 * ERKAN AI — نبض المنشور: سطح عمل عربي غير متماثل للمحادثة، طبقات داكنة وإشارات ضوئية دقيقة.
 * لا تضف زخرفة لا تقود إلى فعل أو ترفع وضوح المحادثة؛ تحقّق دائمًا من أن الاختيار يعزّز الفلسفة.
 */
import { FormEvent, useMemo, useState } from "react";
import {
  ArrowUpLeft,
  Bot,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  Clock3,
  Compass,
  FileText,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  PanelRightOpen,
  Plus,
  Search,
  Send,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

const userLogo = "/manus-storage/erkan-ai-user-logo_68fdf050.png";
const brandSymbol = "/manus-storage/erkan-symbol_3fdbeab7.png";
const horizonImage = "/manus-storage/erkan-neural-horizon_07178e9e.png";
const orbitalCore = "/manus-storage/erkan-orbital-core_f348ec93.png";
const signalStrands = "/manus-storage/erkan-signal-strands_578d902e.png";

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  body: string;
  time: string;
};

const modes = [
  { id: "strategy", label: "استراتيجية", icon: Target, detail: "رتّب القرار التالي" },
  { id: "research", label: "بحث", icon: Search, detail: "لخّص بوضوح" },
  { id: "writing", label: "كتابة", icon: FileText, detail: "اصنع مسودة أدق" },
];

const starterPrompts = [
  "حلّل فرص النمو في مشروعي خلال 90 يومًا",
  "أنشئ خطة محتوى موجزة لهذا الأسبوع",
  "حوّل هذه الفكرة إلى قرار قابل للتنفيذ",
];

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    role: "assistant",
    body: "أهلًا بك في ERKAN AI. اكتب هدفك كما هو، وسأساعدك في تنظيمه إلى خطوات واضحة وقابلة للتنفيذ.",
    time: "الآن",
  },
];

export default function Home() {
  const [activeNav, setActiveNav] = useState("المحادثة");
  const [activeMode, setActiveMode] = useState("strategy");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isThinking, setIsThinking] = useState(false);

  const selectedMode = useMemo(
    () => modes.find((mode) => mode.id === activeMode) ?? modes[0],
    [activeMode],
  );

  const showComingSoon = (label: string) => {
    toast.info(`${label} ستكون متاحة قريبًا في الإصدار القادم.`);
  };

  const startNewConversation = () => {
    setMessages(initialMessages);
    setPrompt("");
    setIsThinking(false);
    toast.success("بدأت جلسة جديدة.");
  };

  const submitPrompt = (event?: FormEvent) => {
    event?.preventDefault();
    const value = prompt.trim();
    if (!value || isThinking) return;

    const timestamp = new Intl.DateTimeFormat("ar-SA", {
      hour: "numeric",
      minute: "numeric",
    }).format(new Date());

    setMessages((current) => [
      ...current,
      { id: Date.now(), role: "user", body: value, time: timestamp },
    ]);
    setPrompt("");
    setIsThinking(true);

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          body: `سأتعامل مع طلبك بوضع «${selectedMode.label}». في النسخة المتكاملة، سيحوّل ERKAN AI هذا الهدف إلى تحليل منظم وخطوات عملية. هذه النسخة تعرض تجربة الواجهة التفاعلية فقط.`,
          time: "الآن",
        },
      ]);
      setIsThinking(false);
    }, 650);
  };

  return (
    <main dir="rtl" className="app-shell min-h-screen overflow-x-hidden bg-[#050b16] text-slate-100">
      <aside className="main-sidebar">
        <div className="sidebar-brand">
          <img src={brandSymbol} alt="رمز ERKAN AI" className="brand-mark" />
          <div>
            <strong>ERKAN</strong>
            <span>مساحة العمل الذكية</span>
          </div>
        </div>

        <button className="new-chat-button" onClick={startNewConversation}>
          <Plus size={18} strokeWidth={2.4} />
          <span>محادثة جديدة</span>
          <span className="shortcut">⌘ K</span>
        </button>

        <nav className="sidebar-nav" aria-label="التنقل الرئيسي">
          {[
            { label: "لوحة التحكم", icon: LayoutDashboard },
            { label: "المحادثة", icon: MessageSquareText },
            { label: "مساحة الأفكار", icon: BrainCircuit },
            { label: "المكتبة", icon: FileText },
          ].map(({ label, icon: Icon }) => (
            <button
              className={`nav-item ${activeNav === label ? "is-active" : ""}`}
              key={label}
              onClick={() => {
                setActiveNav(label);
                if (label !== "المحادثة") showComingSoon(label);
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
              {label === "المحادثة" && <span className="nav-signal" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-spacer" />
        <div className="sidebar-utility">
          <button className="nav-item" onClick={() => showComingSoon("اختصارات العمل")}>
            <Compass size={18} />
            <span>اختصارات العمل</span>
          </button>
          <button className="account-card" onClick={() => showComingSoon("حسابك")}>
            <span className="account-initials">EA</span>
            <span className="account-info"><strong>فريق ERKAN</strong><small>خطة العمل</small></span>
            <MoreHorizontal size={18} />
          </button>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="topbar-title">
            <span className="status-pulse" />
            <span>مساحة العمل</span>
            <ChevronDown size={15} />
          </div>
          <div className="topbar-actions">
            <button className="icon-button" onClick={() => showComingSoon("البحث") } aria-label="بحث"><Search size={19} /></button>
            <button className="icon-button mobile-menu" onClick={() => showComingSoon("القائمة") } aria-label="القائمة"><Menu size={20} /></button>
            <button className="profile-button" onClick={() => showComingSoon("حسابك")}><span>EA</span><ChevronDown size={14} /></button>
          </div>
        </header>

        <div className="content-stage">
          <section className="hero-card">
            <img className="hero-art" src={horizonImage} alt="خلفية ضوء شبكي مجردة" />
            <div className="hero-overlay" />
            <div className="hero-reasoning-route" aria-hidden="true"><i /><b /><i /></div>
            <div className="hero-content">
              <div className="eyebrow"><Sparkles size={15} /> الذكاء في مسار واضح</div>
              <h1>اسأل بوضوح.<br /><em>وتحرّك بثقة.</em></h1>
              <p>مساعدك العربي لتنظيم الفكرة، بناء القرار، وتحويل النية إلى خطوة تالية مفهومة.</p>
              <button className="hero-link" onClick={() => document.getElementById("composer")?.focus()}>
                ابدأ من هدفك التالي <ArrowUpLeft size={17} />
              </button>
            </div>
            <div className="hero-status"><span>ERKAN AI</span><b><i /> متصل</b></div>
          </section>

          <section className="workspace-grid">
            <div className="conversation-column">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">المساعد الذكي</p>
                  <h2>ما الذي تريد أن تنجزه اليوم؟</h2>
                </div>
                <span className="section-signal" aria-hidden="true"><i /><b /><i /></span>
                <button className="subtle-button" onClick={startNewConversation}><Plus size={15} /> جلسة جديدة</button>
              </div>

              <div className="mode-selector" aria-label="اختيار نمط المساعدة">
                {modes.map(({ id, label, icon: Icon, detail }) => (
                  <button
                    key={id}
                    className={`mode-chip ${activeMode === id ? "is-selected" : ""}`}
                    onClick={() => setActiveMode(id)}
                  >
                    <Icon size={16} />
                    <span><b>{label}</b><small>{detail}</small></span>
                  </button>
                ))}
              </div>

              <div className="chat-panel">
                <div className="chat-panel-topline"><span><Bot size={15} /> مساعد ERKAN</span><span className="model-label">ERKAN / 01</span></div>
                <div className="messages" aria-live="polite">
                  {messages.map((message) => (
                    <article className={`message-row ${message.role}`} key={message.id}>
                      {message.role === "assistant" ? (
                        <img className="assistant-avatar" src={userLogo} alt="ERKAN AI" />
                      ) : (
                        <span className="user-avatar">EA</span>
                      )}
                      <div className="message-content">
                        <div className="message-meta"><b>{message.role === "assistant" ? "ERKAN AI" : "أنت"}</b><time>{message.time}</time></div>
                        <p>{message.body}</p>
                      </div>
                    </article>
                  ))}
                  {isThinking && (
                    <article className="message-row assistant thinking-row">
                      <img className="assistant-avatar" src={userLogo} alt="ERKAN AI" />
                      <div className="thinking-dots" aria-label="ERKAN AI يكتب"><i /><i /><i /></div>
                    </article>
                  )}
                </div>

                {messages.length < 2 && (
                  <div className="suggestion-list">
                    {starterPrompts.map((text) => (
                      <button key={text} onClick={() => setPrompt(text)}><span>{text}</span><ChevronLeft size={16} /></button>
                    ))}
                  </div>
                )}

                <form className="composer" onSubmit={submitPrompt}>
                  <span className="composer-mode"><Zap size={14} /> {selectedMode.label}</span>
                  <input
                    id="composer"
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    placeholder="اكتب ما تريد إنجازه…"
                    aria-label="رسالتك إلى ERKAN AI"
                  />
                  <button className="send-button" type="submit" disabled={!prompt.trim() || isThinking} aria-label="إرسال الرسالة"><Send size={18} /></button>
                </form>
                <p className="composer-note">هذه واجهة تجريبية. تحقّق دائمًا من المعلومات قبل اعتماد أي قرار مهم.</p>
              </div>
            </div>

            <aside className="context-column">
              <section className="session-card">
                <span className="session-signal" aria-hidden="true"><i /><b /></span>
                <div className="session-card-heading"><span>مؤشر اليوم</span><MoreHorizontal size={18} /></div>
                <div className="session-score"><span>06</span><small>خطوات مكتملة</small></div>
                <div className="progress-track"><i /></div>
                <p>بدأت رحلة تركيزك. ابدأ بسؤال واحد يهمك.</p>
              </section>

              <section className="signal-card">
                <img src={signalStrands} alt="مسارات إشارة رقمية" />
                <div className="signal-content"><span className="signal-icon"><BrainCircuit size={17} /></span><h3>توضيح المسار</h3><p>حوّل الفكرة الكبيرة إلى عناصر يمكن متابعتها.</p><button onClick={() => setPrompt("ساعدني في توضيح المسار لقراري التالي")}>استكشف الإطار <ChevronLeft size={15} /></button></div>
              </section>

              <section className="activity-card">
                <div className="activity-heading"><h3>نشاط حديث</h3><button onClick={() => showComingSoon("كل النشاط")}>الكل</button></div>
                <div className="activity-line"><span><Clock3 size={15} /></span><p><b>جلسة جديدة</b><small>تبدأ عندما تكون مستعدًا</small></p></div>
                <div className="activity-line"><span className="blue"><CheckCircle2 size={15} /></span><p><b>مساحة آمنة</b><small>لا توجد مهام معلّقة</small></p></div>
              </section>
            </aside>
          </section>
        </div>
      </section>

      <div className="orbital-decoration" aria-hidden="true"><img src={orbitalCore} alt="" /></div>
    </main>
  );
}
