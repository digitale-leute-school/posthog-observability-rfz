"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight, CalendarDays, Check, ChevronRight,
  Clock3, Compass, FileText, Lightbulb, MapPin, RotateCcw, Search,
  Sparkles, Wrench,
} from "lucide-react";
import { journeyEvent } from "@/lib/analytics";
import { PageHead, SuccessHead } from "@/components/page-parts";
import { features } from "@/features";
import { copy, type Language } from "@/lib/copy";

type Screen = "home" | "report" | "report-review" | "report-done" | "track" | "track-result" | "book" | "book-done";
type Report = { id: string; kind: string; location: string; details: string; status: string; created: string };
type Booking = { id: string; service: string; day: string; time: string };

const seedReport: Report = {
  id: "NS-1042", kind: "Streetlight", location: "Maple Street, near number 12",
  details: "The streetlight beside the crossing is not working.",
  status: "In progress", created: "Demo report",
};
const kinds = ["Streetlight", "Road or pavement", "Waste collection", "Other"];
const services = ["Housing advice", "Permits and forms", "General help"];
const days = [
  { label: "Today", caption: "Fully booked", slots: [] as string[] },
  { label: "Tomorrow", caption: "2 times", slots: ["09:30", "14:00"] },
  { label: "Next day", caption: "2 times", slots: ["10:15", "16:30"] },
];
type Text = typeof copy.en | typeof copy.de;

// Opening hours per slot, used to validate a selected time.
const slotHours: Record<string, { opens: string; closes: string }> = {
  "09:30": { opens: "09:00", closes: "12:00" },
  "10:15": { opens: "09:00", closes: "12:00" },
};
function checkSlot(slot: string) {
  const hours = slotHours[slot];
  return hours.opens <= slot && slot < hours.closes;
}

function issueLabel(value: string, c: Text) {
  if (value === "Streetlight") return c.streetlight;
  if (value === "Road or pavement") return c.road;
  if (value === "Waste collection") return c.waste;
  return c.other;
}
function serviceLabel(value: string, c: Text) {
  if (value === "Housing advice") return c.housing;
  if (value === "Permits and forms") return c.permits;
  return c.general;
}
function dayLabel(value: string, c: Text) {
  if (value === "Today") return c.today;
  if (value === "Tomorrow") return c.tomorrow;
  return c.nextDay;
}

function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

export default function Home() {
  const [lang, setLang] = useState<Language>("en");
  const c = copy[lang];
  const [screen, setScreen] = useState<Screen>("home");
  const [reports, setReports] = useState<Report[]>(() => typeof window === "undefined" ? [] : readStored<Report[]>("northstar-reports", []));
  const [bookings, setBookings] = useState<Booking[]>(() => typeof window === "undefined" ? [] : readStored<Booking[]>("northstar-bookings", []));
  const [kind, setKind] = useState("");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [reportError, setReportError] = useState<"" | "chooseIssueError" | "locationError" | "detailsError">("");
  const [latestReport, setLatestReport] = useState<Report | null>(null);
  const [lookup, setLookup] = useState("NS-1042");
  const [foundReport, setFoundReport] = useState<Report | null>(null);
  const [lookupError, setLookupError] = useState(false);
  const [service, setService] = useState(services[0]);
  const [dayIndex, setDayIndex] = useState(0);
  const [time, setTime] = useState("");
  const [bookingError, setBookingError] = useState(false);
  const [latestBooking, setLatestBooking] = useState<Booking | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [featureId, setFeatureId] = useState<string | null>(null);
  const liveFeatures = features.filter((f) => f.ready);
  const activeFeature = liveFeatures.find((f) => f.id === featureId);

  useEffect(() => { window.localStorage.setItem("northstar-reports", JSON.stringify(reports)); }, [reports]);
  useEffect(() => { window.localStorage.setItem("northstar-bookings", JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [screen]);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  // Demo only: /?view=book opens the booking screen on "Tomorrow", so a saved heatmap can render it.
  // It sends no booking_started event, so opening it doesn't count as a booking attempt.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- read the URL once after hydration */
    const view = new URLSearchParams(window.location.search).get("view");
    if (view === "book") { setDayIndex(1); setScreen("book"); }
    // /?view=<feature id> opens a feature without sending its started event (for saved heatmaps).
    else if (view && features.some((f) => f.ready && f.id === view)) setFeatureId(view);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const goHome = () => { setFeatureId(null); setScreen("home"); };
  const startFeature = (id: string) => {
    const feature = features.find((f) => f.id === id);
    if (!feature) return;
    journeyEvent(feature.events.started);
    setFeatureId(id);
  };
  const startReport = () => {
    setKind(""); setLocation(""); setDetails(""); setReportError("");
    journeyEvent("report_started"); setScreen("report");
  };
  const reviewReport = () => {
    if (!kind) return setReportError("chooseIssueError");
    if (location.trim().length < 6) return setReportError("locationError");
    if (details.trim().length < 12) return setReportError("detailsError");
    setReportError(""); setScreen("report-review");
  };
  const submitReport = () => {
    const report: Report = {
      id: `NS-${1043 + reports.length}`, kind, location: location.trim(),
      details: details.trim(), status: "Received", created: "Just now",
    };
    setReports((current) => [report, ...current]); setLatestReport(report);
    journeyEvent("report_completed", { issue_type: kind }); setScreen("report-done");
  };
  const startTrack = () => { setLookup("NS-1042"); setLookupError(false); journeyEvent("tracking_started"); setScreen("track"); };
  const searchReport = () => {
    const match = [seedReport, ...reports].find((report) => report.id.toLowerCase() === lookup.trim().toLowerCase());
    if (!match) return setLookupError(true);
    setLookupError(false); setFoundReport(match);
    journeyEvent("tracking_completed", { status: match.status }); setScreen("track-result");
  };
  const startBooking = () => {
    setService(services[0]); setDayIndex(0); setTime(""); setBookingError(false);
    journeyEvent("booking_started"); setScreen("book");
  };
  const submitBooking = () => {
    if (!time) return setBookingError(true);
    const booking: Booking = { id: `AP-${3021 + bookings.length}`, service, day: days[dayIndex].label, time };
    setBookings((current) => [booking, ...current]); setLatestBooking(booking);
    journeyEvent("booking_completed", { service }); setScreen("book-done");
  };
  const resetDemo = () => {
    window.localStorage.removeItem("northstar-reports");
    window.localStorage.removeItem("northstar-bookings");
    setReports([]); setBookings([]); setScreen("home"); setResetOpen(false);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={goHome} aria-label={c.footerName}>
          <span className="brand-mark"><Compass size={23} strokeWidth={2.2} /></span>
          <span><strong>northstar</strong><small>{c.brand}</small></span>
        </button>
        <div className="topbar-controls">
          <div className="language-toggle" role="group" aria-label="Language / Sprache">
            <button type="button" onClick={() => setLang("en")} aria-pressed={lang === "en"} className={lang === "en" ? "active" : ""}>EN</button>
            <button type="button" onClick={() => setLang("de")} aria-pressed={lang === "de"} className={lang === "de" ? "active" : ""}>DE</button>
          </div>
          <span className="demo-pill"><span className="demo-dot" /> {c.demoMode}</span>
        </div>
      </header>

      <main className="main-content">
        {activeFeature && <activeFeature.Screen lang={lang} onBack={goHome} onDone={goHome} />}
        {!activeFeature && screen === "home" && <>
          <section className="hero surface">
            <div className="hero-copy">
              <span className="eyebrow"><Sparkles size={14} /> {c.heroEyebrow}</span>
              <h1>{c.heroLineOne}<br /><em>{c.heroLineTwo}</em></h1>
              <p>{c.heroDescription}</p>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="orbit orbit-one" /><div className="orbit orbit-two" />
              <div className="hero-icon"><Lightbulb size={38} strokeWidth={1.7} /></div>
              <div className="tiny-star star-one">✦</div><div className="tiny-star star-two">✧</div>
            </div>
          </section>

          <div className="section-heading"><span>{c.choosePath}</span><span>01 / {String(3 + liveFeatures.length).padStart(2, "0")}</span></div>
          <section className="action-grid" aria-label={c.services}>
            <button className="action-card surface" onClick={startReport}>
              <span className="action-icon blue"><Wrench size={24} /></span>
              <span className="action-text"><strong>{c.reportAction}</strong><small>{c.reportActionDescription}</small></span>
              <span className="circle-arrow"><ArrowRight size={19} /></span>
            </button>
            <button className="action-card surface" onClick={startTrack}>
              <span className="action-icon peach"><Search size={24} /></span>
              <span className="action-text"><strong>{c.trackAction}</strong><small>{c.trackActionDescription}</small></span>
              <span className="circle-arrow"><ArrowRight size={19} /></span>
            </button>
            <button className="action-card surface" onClick={startBooking}>
              <span className="action-icon lilac"><CalendarDays size={24} /></span>
              <span className="action-text"><strong>{c.bookAction}</strong><small>{c.bookActionDescription}</small></span>
              <span className="circle-arrow"><ArrowRight size={19} /></span>
            </button>
            {liveFeatures.map((f) => (
              <button key={f.id} className="action-card surface" onClick={() => startFeature(f.id)}>
                <span className={`action-icon ${f.tone}`}><f.icon size={24} /></span>
                <span className="action-text"><strong>{f.title[lang]}</strong><small>{f.description[lang]}</small></span>
                <span className="circle-arrow"><ArrowRight size={19} /></span>
              </button>
            ))}
          </section>
        </>}

        {!activeFeature && screen === "report" && <>
          <PageHead back={goHome} backText={c.back} eyebrow={c.reportEyebrow} title={c.reportTitle} sub={c.reportSubtitle} />
          <section className="form-card surface">
            <div className="step-row"><span className="step-number">01</span><div><strong>{c.whatHappened}</strong><small>{c.closestMatch}</small></div></div>
            <div className="choice-grid" role="group" aria-label={c.issueType}>
              {kinds.map((item) => <button key={item} type="button" className={`choice ${kind === item ? "selected" : ""}`} onClick={() => { setKind(item); setReportError(""); }} aria-pressed={kind === item}>{issueLabel(item, c)}{kind === item && <Check size={16} />}</button>)}
            </div>
            <div className="field-group"><label htmlFor="report-location">{c.where}</label><span className="field-hint">{c.landmarkHint}</span><div className="input-wrap"><MapPin size={19} /><input id="report-location" value={location} onChange={(e) => { setLocation(e.target.value); setReportError(""); }} placeholder={c.locationPlaceholder} /></div></div>
            <div className="field-group"><label htmlFor="report-details">{c.whatNoticed}</label><textarea id="report-details" value={details} onChange={(e) => { setDetails(e.target.value); setReportError(""); }} placeholder={c.detailsPlaceholder} rows={4} /></div>
            {reportError && <p className="field-error" role="alert">{c[reportError]}</p>}
            <button className="primary-button" onClick={reviewReport}>{c.reviewReport} <ArrowRight size={18} /></button>
          </section>
        </>}

        {!activeFeature && screen === "report-review" && <>
          <PageHead back={() => setScreen("report")} backText={c.back} eyebrow={c.reviewEyebrow} title={c.reviewTitle} sub={c.reviewSubtitle} />
          <section className="form-card surface review-card">
            <InfoRow label={c.issue} value={issueLabel(kind, c)} /><InfoRow label={c.location} value={location} /><InfoRow label={c.details} value={details} />
            <div className="review-actions"><button className="text-button" onClick={() => setScreen("report")}>{c.editDetails}</button><button className="primary-button" onClick={submitReport}>{c.sendReport} <ArrowRight size={18} /></button></div>
          </section>
        </>}

        {!activeFeature && screen === "report-done" && latestReport && <>
          <SuccessHead allDoneText={c.allDone} title={c.reportSent} sub={c.reportSentSubtitle} />
          <section className="form-card surface success-card"><span className="caption">{c.yourReference}</span><strong className="reference">{latestReport.id}</strong><p>{c.referenceHelp}</p><button className="primary-button" onClick={() => { setLookup(latestReport.id); setFoundReport(latestReport); setScreen("track-result"); }}>{c.viewReport} <ArrowRight size={18} /></button></section>
          <button className="below-link" onClick={goHome}>{c.backHome}</button>
        </>}

        {!activeFeature && screen === "track" && <>
          <PageHead back={goHome} backText={c.back} eyebrow={c.trackEyebrow} title={c.trackTitle} sub={c.trackSubtitle} />
          <section className="form-card surface"><div className="field-group"><label htmlFor="lookup">{c.reportReference}</label><div className="input-wrap"><FileText size={19} /><input id="lookup" value={lookup} onChange={(e) => { setLookup(e.target.value); setLookupError(false); }} onKeyDown={(e) => { if (e.key === "Enter") searchReport(); }} placeholder="NS-1042" /></div><span className="field-hint">{c.demoReference}</span></div>{lookupError && <p className="field-error" role="alert">{c.referenceError}</p>}<button className="primary-button" onClick={searchReport}>{c.findReport} <ArrowRight size={18} /></button></section>
        </>}

        {!activeFeature && screen === "track-result" && foundReport && <>
          <PageHead back={() => setScreen("track")} backText={c.back} eyebrow={c.updateEyebrow} title={c.updateTitle} sub={`${c.reference} ${foundReport.id}`} />
          <section className="form-card surface"><div className="status-top"><span className="status-badge"><span /> {foundReport.status === "In progress" ? c.inProgress : c.received}</span><span className="muted-small">{foundReport.created === "Demo report" ? c.demoReport : c.justNow}</span></div><h2 className="result-title">{issueLabel(foundReport.kind, c)}</h2><p className="result-location"><MapPin size={17} />{foundReport.id === seedReport.id ? c.seedLocation : foundReport.location}</p><p className="result-description">{foundReport.id === seedReport.id ? c.seedDetails : foundReport.details}</p><div className="timeline"><div className="timeline-item done"><span className="timeline-dot"><Check size={12} /></span><div><strong>{c.reportReceived}</strong><small>{c.receivedDetails}</small></div></div><div className={`timeline-item ${foundReport.status === "In progress" ? "done" : ""}`}><span className="timeline-dot">{foundReport.status === "In progress" ? <Check size={12} /> : null}</span><div><strong>{c.teamReview}</strong><small>{foundReport.status === "In progress" ? c.teamWorking : c.nextStep}</small></div></div><div className="timeline-item"><span className="timeline-dot" /><div><strong>{c.resolved}</strong><small>{c.resolutionNote}</small></div></div></div></section>
          <button className="below-link" onClick={goHome}>{c.backHome}</button>
        </>}

        {!activeFeature && screen === "book" && <>
          <PageHead back={goHome} backText={c.back} eyebrow={c.bookEyebrow} title={c.bookTitle} sub={c.bookSubtitle} />
          <section className="form-card surface">
            <div className="field-group"><label htmlFor="service">{c.visitAbout}</label><div className="select-wrap"><select id="service" value={service} onChange={(e) => setService(e.target.value)}>{services.map((item) => <option key={item} value={item}>{serviceLabel(item, c)}</option>)}</select><ChevronRight size={19} /></div></div>
            <div className="field-group"><label>{c.pickDay}</label><div className="day-grid" role="group" aria-label={c.appointmentDay}>{days.map((item, index) => <button key={item.label} type="button" className={`day-choice ${dayIndex === index ? "selected" : ""}`} onClick={() => { setDayIndex(index); setTime(""); setBookingError(false); }} aria-pressed={dayIndex === index}><strong>{dayLabel(item.label, c)}</strong><small>{index === 0 ? c.fullyBooked : c.twoTimes}</small></button>)}</div></div>
            <div className="field-group"><label>{c.availableTimes}</label>{days[dayIndex].slots.length ? <div className="slot-grid" role="group" aria-label={c.appointmentTime}>{days[dayIndex].slots.map((slot) => <button key={slot} type="button" className={`slot ${time === slot ? "selected" : ""}`} onClick={() => { if (!checkSlot(slot)) return; setTime(slot); setBookingError(false); }} aria-pressed={time === slot}><Clock3 size={16} />{slot}</button>)}</div> : <div className="empty-slots"><CalendarDays size={22} /><span>{c.noTimes}</span></div>}</div>
            {bookingError && <p className="field-error" role="alert">{c.chooseTimeError}</p>}
            <button className="primary-button" onClick={submitBooking}>{c.confirmVisit} <ArrowRight size={18} /></button>
          </section>
        </>}

        {!activeFeature && screen === "book-done" && latestBooking && <>
          <SuccessHead allDoneText={c.allDone} title={c.booked} sub={c.bookedSubtitle} />
          <section className="form-card surface success-card"><span className="caption">{c.yourVisit}</span><strong className="booking-summary">{dayLabel(latestBooking.day, c)} {c.at} {latestBooking.time}</strong><p>{serviceLabel(latestBooking.service, c)} · {c.reference} {latestBooking.id}</p><button className="primary-button" onClick={goHome}>{c.done} <ArrowRight size={18} /></button></section>
        </>}
      </main>

      <footer className="footer"><span>{c.footerName} <span className="footer-separator">·</span> {c.localDemo}</span><button onClick={() => setResetOpen(true)}><RotateCcw size={14} /> {c.resetDemo}</button></footer>
      {resetOpen && <div className="modal-backdrop" role="presentation"><section className="reset-modal surface" role="dialog" aria-modal="true" aria-labelledby="reset-title"><span className="action-icon peach"><RotateCcw size={23} /></span><h2 id="reset-title">{c.resetTitle}</h2><p>{c.resetDescription}</p><div className="modal-actions"><button className="text-button" onClick={() => setResetOpen(false)}>{c.keepWork}</button><button className="primary-button" onClick={resetDemo}>{c.resetDemo}</button></div></section></div>}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return <div className="info-row"><span>{label}</span><strong>{value}</strong></div>;
}
