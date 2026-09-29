import { ArrowLeft, CheckCircle2 } from "lucide-react";

// Shared page building blocks, so every journey (including the new features) looks the same.
export function PageHead({ back, backText, eyebrow, title, sub }: { back: () => void; backText: string; eyebrow: string; title: string; sub: string }) {
  return <div className="page-head"><button className="back-button" onClick={back}><ArrowLeft size={18} /> {backText}</button><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{sub}</p></div>;
}
export function SuccessHead({ allDoneText, title, sub }: { allDoneText: string; title: string; sub: string }) {
  return <div className="success-head"><span className="success-icon"><CheckCircle2 size={36} /></span><span className="eyebrow">{allDoneText}</span><h1>{title}</h1><p>{sub}</p></div>;
}
