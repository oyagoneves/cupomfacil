import { useState, useEffect, useRef, useCallback } from 'react';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const CHECKOUT_LINK = 'https://SEU-LINK-AQUI';
const VIDEO_URL = '/video/video.mp4'; // coloque seu video na pasta public/ com nome video.mp4
const VIDEO_UNLOCK_SECONDS = 18;

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const globalStyles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    background: #080e1a;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #f0f6ff;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    letter-spacing: -0.011em;
  }
  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .page-wrap {
    width: 100%;
    max-width: 420px;
    min-height: 100vh;
    margin: 0 auto;
    position: relative;
    overflow-x: hidden;
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.75); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(22px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes popIn {
    0% { opacity: 0; transform: scale(0.85); }
    70% { transform: scale(1.03); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .fade-in-up { animation: fadeInUp 0.55s ease both; }
  .fade-in { animation: fadeIn 0.5s ease both; }
  .pop-in { animation: popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both; }
  .pulse-dot { animation: pulse-dot 1.5s ease-in-out infinite; }
  .spinner {
    width: 48px; height: 48px;
    border: 3px solid rgba(22,214,105,0.2);
    border-top-color: #16d669;
    border-radius: 50%;
    animation: spin 0.9s linear infinite;
  }
  .btn-primary {
    display: block; width: 100%;
    background: linear-gradient(135deg, #16d669 0%, #0db857 100%);
    color: #030a12;
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-size: 1.05rem;
    letter-spacing: -0.01em;
    padding: 18px 24px;
    border: none; cursor: pointer;
    border-radius: 14px;
    box-shadow: 0 8px 32px rgba(22,214,105,0.4);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    text-align: center;
    text-decoration: none;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(22,214,105,0.55); }
  .btn-primary:active { transform: translateY(0); }
  .card {
    background: rgba(13,22,40,0.85);
    border: 1px solid rgba(22,214,105,0.12);
    border-radius: 18px;
    backdrop-filter: blur(8px);
  }
  .green { color: #16d669; }
  .muted { color: #8ea5c8; }
  .badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(22,214,105,0.12);
    border: 1px solid rgba(22,214,105,0.3);
    color: #16d669;
    font-size: 0.78rem; font-weight: 600;
    padding: 5px 12px; border-radius: 100px;
    letter-spacing: -0.01em;
  }
  h1,h2,h3 { font-family: 'Inter', sans-serif; }
`;

// ─── TYPES ────────────────────────────────────────────────────────────────────
declare global {
  interface Window {
    confetti: (opts: Record<string, unknown>) => void;
  }
}

// ─── PAGE 1 — LANDING ─────────────────────────────────────────────────────────
function Page1({ onNext }: { onNext: () => void }) {
  return (
    <div className="page-wrap" style={{ background: 'radial-gradient(ellipse 80% 40% at 50% -10%, rgba(22,214,105,0.13) 0%, transparent 70%), linear-gradient(180deg,#080e1a 0%,#0d1628 100%)', padding: '0 0 48px' }}>
      {/* Logo bar */}
      <div className="fade-in-up" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '22px 24px 0' }}>
        <span className="pulse-dot" style={{ width: 10, height: 10, borderRadius: '50%', background: '#16d669', display: 'inline-block', flexShrink: 0 }} />
        <span style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.01em' }}>CupomFácil</span>
      </div>

      <div style={{ padding: '32px 20px 0', display: 'flex', flexDirection: 'column', gap: 22 }}>
        {/* Badge */}
        <div className="fade-in-up" style={{ animationDelay: '0.05s' }}>
          <span className="badge">✦ Ferramenta gratuita de economia</span>
        </div>

        {/* H1 */}
        <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h1 style={{ fontSize: 'clamp(1.65rem, 7vw, 2rem)', fontWeight: 800, lineHeight: 1.18, letterSpacing: '-0.02em' }}>
            Descubra quanto você pode{' '}
            <span className="green">economizar</span>{' '}
            comprando online
          </h1>
          <p className="muted" style={{ marginTop: 12, fontSize: '0.97rem', lineHeight: 1.6 }}>
            Pessoas estão economizando de <strong style={{ color: '#f0f6ff' }}>R$50 a R$200 por dia</strong> no Mercado Livre, Shopee e Shein — e você também pode.
          </p>
        </div>

        {/* Social proof */}
        <div className="fade-in-up card" style={{ animationDelay: '0.15s', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', flexShrink: 0 }}>
            {['👩', '👨', '👩‍🦱', '🧑', '👨‍🦳'].map((e, i) => (
              <span key={i} style={{ fontSize: '1.4rem', marginLeft: i === 0 ? 0 : -10, background: '#0d1628', border: '2px solid #080e1a', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{e}</span>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '0.9rem' }}>47.832+ pessoas já economizaram</div>
            <div style={{ color: '#f5c518', fontSize: '0.85rem', marginTop: 2 }}>★★★★★</div>
          </div>
        </div>

        {/* Platform chips */}
        <div className="fade-in-up" style={{ animationDelay: '0.2s', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['Mercado Livre', 'Shopee', 'Shein', 'Amazon'].map(p => (
            <span key={p} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: '5px 13px', fontSize: '0.8rem', color: '#c8d8ee' }}>{p}</span>
          ))}
        </div>

        {/* CTA */}
        <div className="fade-in-up" style={{ animationDelay: '0.25s' }}>
          <button className="btn-primary" onClick={onNext} style={{ fontSize: '1.1rem', padding: '20px 24px' }}>
            ✦ Responder Quiz Grátis
          </button>
          <p className="muted" style={{ textAlign: 'center', marginTop: 10, fontSize: '0.82rem' }}>
            Leva menos de 2 minutos • 100% gratuito
          </p>
        </div>

        {/* Trust indicators */}
        <div className="fade-in-up card" style={{ animationDelay: '0.3s', padding: '18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[['🔒', 'Sem cadastro'], ['⚡', 'Resultado imediato'], ['🎯', 'Personalizado', ], ['✅', '100% gratuito']].map(([icon, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.83rem', color: '#8ea5c8' }}>
              <span>{icon}</span><span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE 2 — QUIZ ────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    q: 'Com que frequência você faz compras pela internet?',
    opts: ['Todos os dias', 'Uma ou duas vezes por semana', 'Uma vez por mês', 'Raramente'],
  },
  {
    q: 'Quanto você gasta por mês com compras online?',
    opts: ['Menos de R$100', 'R$100–R$300', 'R$300–R$800', 'Mais de R$800'],
  },
  {
    q: 'Qual categoria você mais compra?',
    opts: ['Roupas e acessórios', 'Eletrônicos', 'Alimentos', 'Beleza e saúde'],
  },
  {
    q: 'Qual plataforma usa mais?',
    opts: ['Mercado Livre', 'Amazon', 'Shopee', 'Lojas próprias das marcas'],
  },
  {
    q: 'Como costuma pagar?',
    opts: ['Cartão parcelado', 'Cartão à vista', 'Pix ou boleto', 'Carteira digital'],
  },
  {
    q: 'Pesquisa preços antes de comprar?',
    opts: ['Sempre', 'Na maioria das vezes', 'Às vezes', 'Não, compro na primeira loja'],
  },
  {
    q: 'O que te faz desistir de uma compra?',
    opts: ['Frete caro', 'Falta de confiança', 'Produto mais barato em outro lugar', 'Pagamento complicado'],
  },
  {
    q: 'Com que antecedência planeja compras maiores?',
    opts: ['Compro no impulso', 'Pesquiso alguns dias', 'Espero promoções', 'Espero Black Friday'],
  },
  {
    q: 'Já teve problemas com compra online?',
    opts: ['Sim, várias vezes', 'Sim, uma ou duas', 'Nunca', 'Não, mas já desconfiei'],
  },
  {
    q: 'O que mais te influencia a comprar?',
    opts: ['Avaliações', 'Preço mais baixo', 'Frete grátis', 'Marca confiável'],
  },
  {
    q: 'R$50–R$200 de desconto todo dia te ajudaria?',
    opts: ['Sim, economizaria muito!', 'Dependeria dos produtos', 'Só se fosse fácil', 'Não faz diferença'],
  },
];

const LETTERS = ['A', 'B', 'C', 'D'];

function Page2({ onNext }: { onNext: () => void }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [pageKey, setPageKey] = useState(0);

  const progress = ((current + 1) / QUESTIONS.length) * 100;

  const handleSelect = (idx: number) => {
    if (selected !== null || loading) return;
    setSelected(idx);
    setTimeout(() => {
      if (current < QUESTIONS.length - 1) {
        setPageKey(k => k + 1);
        setCurrent(c => c + 1);
        setSelected(null);
      } else {
        setLoading(true);
        setLoadingStep(0);
        setTimeout(() => setLoadingStep(1), 2000);
        setTimeout(() => onNext(), 4000);
      }
    }, 380);
  };

  if (loading) {
    return (
      <div className="page-wrap" style={{ background: '#080e1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 24, padding: 32 }}>
        <div className="spinner" />
        <p style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '1.1rem', textAlign: 'center', transition: 'opacity 0.4s' }}>
          {loadingStep === 0 ? 'Analisando suas respostas...' : 'Encontramos descontos disponíveis para você 🎯'}
        </p>
      </div>
    );
  }

  const q = QUESTIONS[current];

  return (
    <div className="page-wrap" style={{ background: 'linear-gradient(180deg,#080e1a 0%,#0d1628 100%)', padding: '0 0 48px', minHeight: '100vh' }}>
      {/* Progress bar */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 100, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#16d669,#0db857)', borderRadius: 100, boxShadow: '0 0 10px rgba(22,214,105,0.7)', transition: 'width 0.4s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span className="muted" style={{ fontSize: '0.8rem' }}>Pergunta {current + 1} de {QUESTIONS.length}</span>
          <span className="green" style={{ fontSize: '0.8rem', fontWeight: 600 }}>{Math.round(progress)}%</span>
        </div>
      </div>

      <div key={pageKey} className="fade-in-up" style={{ padding: '28px 20px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h2 style={{ fontSize: 'clamp(1.05rem, 5vw, 1.25rem)', fontWeight: 700, lineHeight: 1.35, letterSpacing: '-0.01em' }}>
          {q.q}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 6 }}>
          {q.opts.map((opt, i) => {
            const isSelected = selected === i;
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: isSelected ? 'rgba(22,214,105,0.1)' : 'rgba(13,22,40,0.9)',
                  border: `1.5px solid ${isSelected ? '#16d669' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 14, padding: '14px 16px',
                  cursor: 'pointer', textAlign: 'left', width: '100%',
                  transition: 'all 0.2s ease',
                  color: '#f0f6ff',
                }}
              >
                <span style={{
                  width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isSelected ? '#16d669' : 'rgba(255,255,255,0.07)',
                  color: isSelected ? '#030a12' : '#8ea5c8',
                  fontFamily: 'Inter', fontWeight: 700, fontSize: '0.82rem',
                  transition: 'all 0.2s ease',
                }}>
                  {LETTERS[i]}
                </span>
                <span style={{ fontSize: '0.92rem', lineHeight: 1.4, fontWeight: isSelected ? 600 : 400 }}>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE 3 — VIDEO ───────────────────────────────────────────────────────────
function Page3({ onNext }: { onNext: () => void }) {
  const [elapsed, setElapsed] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [btnVisible, setBtnVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const startRef = useRef<number>(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const secs = Math.floor((Date.now() - startRef.current) / 1000);
      setElapsed(secs);
      if (secs >= VIDEO_UNLOCK_SECONDS && !unlocked) {
        setUnlocked(true);
        setTimeout(() => setBtnVisible(true), 50);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [unlocked]);

  const remaining = Math.max(0, VIDEO_UNLOCK_SECONDS - elapsed);

  return (
    <div className="page-wrap" style={{ background: 'linear-gradient(180deg,#080e1a 0%,#0d1628 100%)', padding: '0 0 48px', minHeight: '100vh' }}>
      <div style={{ padding: '28px 20px 0', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className="fade-in-up">
          <span className="badge">✦ Assista com atenção</span>
        </div>
        <h2 className="fade-in-up" style={{ fontWeight: 800, fontSize: 'clamp(1.3rem,6vw,1.6rem)', lineHeight: 1.2, letterSpacing: '-0.02em', animationDelay: '0.05s' }}>
          Veja como funciona <br /><span className="green">na prática</span>
        </h2>

        {/* Video container */}
        <div className="fade-in-up" style={{ animationDelay: '0.1s', position: 'relative', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', background: '#000' }}>
          <video
            ref={videoRef}
            src={VIDEO_URL}
            autoPlay
            playsInline
            controls
            style={{ width: '100%', aspectRatio: '16/9', display: 'block', borderRadius: 20 }}
          /> {/* alulaoo */}
          {/* Timer badge - destacado */}
          {!unlocked && (
            <div style={{
              position: 'absolute', top: 12, right: 12,
              background: 'linear-gradient(135deg, #16d669, #0db857)',
              borderRadius: 10,
              padding: '6px 14px',
              fontSize: '0.9rem',
              fontFamily: 'Inter',
              fontWeight: 800,
              color: '#030a12',
              boxShadow: '0 4px 16px rgba(22,214,105,0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <span style={{ fontSize: '1rem' }}>⏱</span>
              <span>{remaining}s</span>
            </div>
          )}
        </div>

        {/* CTA button area */}
        <div className="fade-in-up" style={{ animationDelay: '0.15s' }}>
          {btnVisible ? (
            <div className="fade-in" style={{ animationDuration: '0.6s' }}>
              <button className="btn-primary" onClick={onNext} style={{ fontSize: '1.05rem' }}>
                🎁 Resgatar Meu Desconto
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '14px 0' }}>
              <p className="muted" style={{ fontSize: '0.88rem' }}>O botão aparece em instantes...</p>
              <div style={{ marginTop: 8, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${(elapsed / VIDEO_UNLOCK_SECONDS) * 100}%`,
                  background: 'linear-gradient(90deg,#16d669,#0db857)',
                  borderRadius: 100,
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE 4 — PARABENS (POPUP) ────────────────────────────────────────────────
function Page4({ onNext }: { onNext: () => void }) {
  useEffect(() => {
    const fire = () => {
      const colors = ['#16d669', '#f5c518', '#ffffff', '#00e5ff', '#0db857'];
      window.confetti?.({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.4 },
        colors,
        startVelocity: 45,
        gravity: 0.9,
        scalar: 1.1,
      });
      setTimeout(() => window.confetti?.({ particleCount: 60, spread: 100, origin: { x: 0.1, y: 0.5 }, colors }), 400);
      setTimeout(() => window.confetti?.({ particleCount: 60, spread: 100, origin: { x: 0.9, y: 0.5 }, colors }), 600);
    };
    fire();
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(4,9,20,0.88)', backdropFilter: 'blur(10px)', padding: 20 }}>
      <div className="pop-in card" style={{ maxWidth: 380, width: '100%', padding: '40px 28px', textAlign: 'center', borderColor: 'rgba(22,214,105,0.25)', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ fontSize: '3.5rem', lineHeight: 1 }}>🎉</div>
        <h2 style={{ fontWeight: 800, fontSize: '1.8rem', letterSpacing: '-0.02em' }}>Parabéns!</h2>
        <p style={{ color: '#c8d8ee', fontSize: '0.97rem', lineHeight: 1.6 }}>
          Você recebeu até <strong style={{ color: '#16d669' }}>R$200 em descontos exclusivos</strong> para usar no Mercado Livre, Shopee e Shein. Resgate agora antes que expire!
        </p>
        <button className="btn-primary" onClick={onNext} style={{ fontSize: '1.05rem' }}>
          🏷️ Resgatar Cupons Agora
        </button>
        <p className="muted" style={{ fontSize: '0.82rem' }}>🔒 Acesso seguro e imediato</p>
      </div>
    </div>
  );
}

// ─── PAGE 5 — OFFER ───────────────────────────────────────────────────────────
function useCountdown(totalSeconds: number) {
  const [secs, setSecs] = useState(totalSeconds);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => s <= 1 ? totalSeconds : s - 1), 1000);
    return () => clearInterval(t);
  }, [totalSeconds]);
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
}

const BENEFITS = [
  { icon: '🤖', text: 'Descontos automáticos no Mercado Livre, Shopee e Shein' },
  { icon: '🔄', text: 'Cupons atualizados diariamente' },
  { icon: '💰', text: 'Economia de R$50 a R$200 por dia' },
  { icon: '⚡', text: 'Acesso imediato após o pagamento' },
  { icon: '🎧', text: 'Suporte completo incluído' },
];

function Page5() {
  const countdown = useCountdown(15 * 60);

  return (
    <div className="page-wrap" style={{ background: 'linear-gradient(180deg,#080e1a 0%,#0d1628 100%)', minHeight: '100vh' }}>
      {/* Sticky countdown - destaque */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'linear-gradient(90deg, #dc2626, #b91c1c)',
        borderBottom: '2px solid rgba(255,255,255,0.1)',
        padding: '12px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
        boxShadow: '0 4px 20px rgba(220,38,38,0.5)',
      }}>
        <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 6, padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          🔥 Oferta expira em
        </span>
        <span style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '1.35rem', color: '#fff', letterSpacing: '0.02em', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>{countdown}</span>
      </div>

      <div style={{ padding: '28px 20px 60px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Badge + headline */}
        <div className="fade-in-up">
          <span className="badge">⚡ Oferta especial</span>
          <h1 style={{ marginTop: 14, fontWeight: 800, fontSize: 'clamp(1.35rem,6.5vw,1.7rem)', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Acesse a ferramenta que encontra cupons e descontos <span className="green">automáticos</span> para você
          </h1>
          <p className="muted" style={{ marginTop: 10, fontSize: '0.95rem', lineHeight: 1.6 }}>
            Sem precisar garimpar horas na internet. A ferramenta faz tudo por você.
          </p>
        </div>

        {/* Price card */}
        <div className="fade-in-up card" style={{ animationDelay: '0.08s', padding: '28px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6, borderColor: 'rgba(22,214,105,0.25)' }}>
          <span className="muted" style={{ fontSize: '0.88rem', textDecoration: 'line-through' }}>De R$97,90</span>
          <span className="muted" style={{ fontSize: '0.82rem' }}>por apenas</span>
          <div style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(2.8rem,13vw,3.4rem)', color: '#16d669', lineHeight: 1, letterSpacing: '-0.03em' }}>
            R$19,90
          </div>
          <span className="muted" style={{ fontSize: '0.82rem' }}>pagamento único · sem mensalidade</span>
          <div style={{ marginTop: 8 }}>
            <span className="badge" style={{ fontSize: '0.82rem' }}>↓ 80% de desconto hoje</span>
          </div>
        </div>

        {/* CTA button */}
        <div className="fade-in-up" style={{ animationDelay: '0.12s' }}>
          <a href={CHECKOUT_LINK} className="btn-primary" style={{ fontSize: '1.1rem', padding: '20px 24px' }}>
            ⚡ Ativar Ferramenta Agora
          </a>
          <p className="muted" style={{ textAlign: 'center', marginTop: 8, fontSize: '0.82rem' }}>
            por R$19,90 · acesso imediato
          </p>
        </div>

        {/* Benefits */}
        <div className="fade-in-up" style={{ animationDelay: '0.16s', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '0.92rem', color: '#8ea5c8', letterSpacing: '0.04em', textTransform: 'uppercase' }}>O que você recebe</p>
          {BENEFITS.map(({ icon, text }) => (
            <div key={text} className="card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{icon}</span>
              <span style={{ fontSize: '0.9rem', lineHeight: 1.45, color: '#c8d8ee' }}>{text}</span>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
          <a href={CHECKOUT_LINK} className="btn-primary" style={{ fontSize: '1.1rem', padding: '20px 24px' }}>
            ⚡ Ativar Ferramenta Agora
          </a>
          <p className="muted" style={{ textAlign: 'center', marginTop: 8, fontSize: '0.82rem' }}>
            🔒 Compra 100% segura · Garantia de 7 dias
          </p>
        </div>

        {/* Trust seals */}
        <div className="fade-in-up card" style={{ animationDelay: '0.24s', padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[['🛡️', 'Garantia 7 dias'], ['🔒', 'Pagamento seguro'], ['⚡', 'Acesso imediato'], ['🎧', 'Suporte incluso']].map(([icon, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.8rem', color: '#8ea5c8' }}>
              <span>{icon}</span><span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState(0);

  const goTo = useCallback((n: number) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setPage(n);
  }, []);

  return (
    <>
      <style>{globalStyles}</style>
      {page === 0 && <Page1 onNext={() => goTo(1)} />}
      {page === 1 && <Page2 onNext={() => goTo(2)} />}
      {page === 2 && <Page3 onNext={() => goTo(3)} />}
      {page === 3 && <Page4 onNext={() => goTo(4)} />}
      {page === 4 && <Page5 />}
    </>
  );
}
