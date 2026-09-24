"use client";

import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import { invitedGuests } from "../lib/guests";

const mapUrl =
  "https://www.google.com/maps/search/?api=1&query=Odeh%20Hotel%20Aida%27s%20Garden";
const weddingDate = new Date("2026-10-10T18:00:00+03:00").getTime();
const detailImages = [
  "/detail-date.jpg",
  "/detail-location.jpg",
  "/detail-time.jpg",
  "/detail-adults.jpg",
];

type Lang = "en" | "ar";
type RsvpStatus = "idle" | "submitting" | "success" | "error";
type TimelineIconName = "reception" | "entrance" | "dinner" | "party";

const timelineIcons: Record<TimelineIconName, { src: string; width: number; height: number }> = {
  reception: { src: "/timeline-reception.png", width: 1165, height: 1350 },
  entrance: { src: "/timeline-entrance.png", width: 1341, height: 1173 },
  dinner: { src: "/timeline-dinner.png", width: 1169, height: 1346 },
  party: { src: "/timeline-party.png", width: 1303, height: 1207 },
};

function TimelineIcon({ name }: { name: TimelineIconName }) {
  const icon = timelineIcons[name];

  return (
    <Image
      className="timeline-icon"
      src={icon.src}
      alt=""
      width={icon.width}
      height={icon.height}
      unoptimized
      aria-hidden="true"
    />
  );
}

const copy = {
  en: {
    nav: { details: "Details", rsvp: "RSVP", map: "Map", switch: "عربي" },
    hero: {
      eyebrow: "The Wedding of",
      title: "Sama Matar & Hisham Daraghme",
      date: "Saturday, 10 October 2026",
      location: "Odeh Hotel, Aida's Garden",
      time: "5:00 PM",
      arrivalNote: "Entrance and celebration begin before sunset. Please arrive early.",
      rsvp: "RSVP",
      map: "Open Map",
      scroll: "Scroll for the celebration",
    },
    details: {
      label: "The Celebration",
      headline: "Everything you need for the wedding weekend.",
      cards: [
        ["Date", "Saturday, 10 October 2026"],
        ["Location", "Odeh Hotel, Aida's Garden"],
        ["Time", "5:00 PM. Entrance and celebration begin before sunset, so please arrive early."],
        ["Adults only", "A little evening off for your children."],
      ],
    },
    countdown: {
      title: "Our forever begins in",
      labels: ["Days", "Hours", "Minutes", "Seconds"],
    },
    timeline: {
      label: "Timeline",
      title: "A garden evening, softly unfolding.",
      items: [
        { time: "5:00 PM", title: "Reception", body: "Guests arrive before sunset to greet, settle in, and enjoy Aida's Garden." },
        { time: "6:00 PM", title: "Grand entrance", body: "A warm introduction as the evening officially begins." },
        { time: "8:00 PM", title: "Dinner", body: "Dinner, candlelight, and a table full of people we love." },
        { time: "", title: "Party", body: "Music, dancing, dessert, and a long night with the people we love." },
      ],
    },
    rsvp: {
      label: "RSVP",
      title: "Will you be there?",
      personalTitle: (name: string) => `${name}, will you be there?`,
      body: "We would love to see you there. Please RSVP by 3 October at the latest.",
      personalBody: "We would love to see you there. Please RSVP by 3 October at the latest.",
      missingGuest: "Open your personal invitation link to RSVP.",
      guestName: "Your name",
      plusOneName: "Plus-one name",
      plusOneHint: "Optional, if you already know who is joining you.",
      attend: "Attend",
      decline: "No attend",
      sending: "Sending...",
      success: "Thank you. Your RSVP has been saved.",
      error: "Something went wrong. Please try again.",
    },
  },
  ar: {
    nav: { details: "التفاصيل", rsvp: "أكدوا حضوركم", map: "الموقع", switch: "English" },
    hero: {
      eyebrow: "حفل زفاف",
      title: "سما مطر وهشام دراغمة",
      date: "السبت، 10 أكتوبر 2026",
      location: "فندق عودة، حديقة عايدة",
      time: "5:00 مساءً",
      arrivalNote: "الاستقبال والفرحة ببلشوا قبل الغروب، فبنستناكم تيجوا بكير.",
      rsvp: "أكدوا حضوركم",
      map: "افتحوا الموقع",
      scroll: "شوفوا تفاصيل الليلة",
    },
    details: {
      label: "تفاصيل الفرح",
      headline: "كل شي بدكم تعرفوه عن يومنا.",
      cards: [
        ["التاريخ", "السبت، 10 أكتوبر 2026"],
        ["المكان", "فندق عودة، حديقة عايدة"],
        ["الوقت", "5:00 مساءً. الاستقبال والفرحة ببلشوا قبل الغروب، فبنستناكم تيجوا بكير."],
        ["للكبار فقط", "خلّوا الصغار يرتاحوا، وتعالوا افرحوا معنا."],
      ],
    },
    countdown: {
      title: "باقي على فرحتنا",
      labels: ["يوم", "ساعة", "دقيقة", "ثانية"],
    },
    timeline: {
      label: "برنامج الليلة",
      title: "ليلتنا بحديقة عايدة، خطوة بخطوة.",
      items: [
        { time: "5:00 مساءً", title: "الاستقبال", body: "بنستقبلكم قبل الغروب، نسلم عليكم ونبلّش الليلة سوا بحديقة عايدة." },
        { time: "6:00 مساءً", title: "الدخول", body: "الدخلة وبلشة الفرح رسمياً، ووجودكم معنا هو الأجمل." },
        { time: "8:00 مساءً", title: "العشا", body: "عشا وضحكات وقعدة حلوة مع أهلنا وأصحابنا." },
        { time: "", title: "الحفلة", body: "موسيقى ورقص وحلو، وليلة حلوة بتكمل بمحبتكم." },
      ],
    },
    rsvp: {
      label: "أكدوا حضوركم",
      title: "بتكونوا معنا؟",
      personalTitle: (name: string) => `${name}، بتكونوا معنا؟`,
      body: "منحب نشوفكم معنا. يا ريت تأكدولنا حضوركم قبل 3 أكتوبر كحد أقصى.",
      personalBody: "منحب نشوفكم معنا. يا ريت تأكدولنا حضوركم قبل 3 أكتوبر كحد أقصى.",
      missingGuest: "افتحوا رابط دعوتكم الخاص عشان تأكدوا الحضور.",
      guestName: "الاسم",
      plusOneName: "اسم المرافق",
      plusOneHint: "اختياري، إذا بتعرفوا مين رح يكون معكم.",
      attend: "رح أحضر",
      decline: "مش رح أقدر",
      sending: "عم نرسل...",
      success: "شكراً إلكم. وصلنا ردكم.",
      error: "صار خطأ بسيط. جرّبوا كمان مرة.",
    },
  },
} as const;

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [status, setStatus] = useState<RsvpStatus>("idle");
  const [message, setMessage] = useState("");
  const [guestSlug, setGuestSlug] = useState("");
  const [countdown, setCountdown] = useState([0, 0, 0, 0]);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const t = copy[lang];
  const isArabic = lang === "ar";
  const selectedGuest = invitedGuests.find((guest) => guest.slug === guestSlug);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setGuestSlug(params.get("guest") ?? "");
  }, []);

  useEffect(() => {
    function updateCountdown() {
      const remaining = Math.max(0, weddingDate - Date.now());
      const days = Math.floor(remaining / 86_400_000);
      const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
      const minutes = Math.floor((remaining % 3_600_000) / 60_000);
      const seconds = Math.floor((remaining % 60_000) / 1000);
      setCountdown([days, hours, minutes, seconds]);
    }

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const playVideo = () => {
      video.muted = true;
      video.defaultMuted = true;
      void video
        .play()
        .then(() => {
          setVideoReady(true);
          setVideoFailed(false);
        })
        .catch(() => {
          window.setTimeout(() => {
            if (video.paused) {
              setVideoFailed(true);
            }
          }, 900);
        });
    };

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      playVideo();
    }

    const playWhenVisible = () => {
      if (document.visibilityState === "visible") {
        playVideo();
      }
    };

    video.addEventListener("loadedmetadata", playVideo);
    video.addEventListener("loadeddata", playVideo);
    video.addEventListener("canplay", playVideo);
    document.addEventListener("visibilitychange", playWhenVisible);
    window.addEventListener("focus", playVideo);
    window.requestAnimationFrame(playVideo);

    return () => {
      video.removeEventListener("loadedmetadata", playVideo);
      video.removeEventListener("loadeddata", playVideo);
      video.removeEventListener("canplay", playVideo);
      document.removeEventListener("visibilitychange", playWhenVisible);
      window.removeEventListener("focus", playVideo);
    };
  }, []);

  function handleHeroVideoPlay() {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.muted = true;
    video.defaultMuted = true;
    void video
      .play()
      .then(() => {
        setVideoReady(true);
        setVideoFailed(false);
      })
      .catch(() => setVideoFailed(true));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const form = event.currentTarget;
    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;
    const formData = new FormData(form);
    const payload = {
      guestSlug: String(formData.get("guestSlug") ?? ""),
      guestName: String(formData.get("guestName") ?? ""),
      plusOneName: String(formData.get("plusOneName") ?? ""),
      attending: submitter?.value === "no" ? "no" : "yes",
      website: String(formData.get("website") ?? ""),
    };

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? t.rsvp.error);
      }

      setStatus("success");
      setMessage(t.rsvp.success);
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : t.rsvp.error);
    }
  }

  return (
    <main className={isArabic ? "arabic" : ""} dir={isArabic ? "rtl" : "ltr"}>
      <section className="hero film-hero" aria-labelledby="hero-title">
        <div className="film-reel" aria-hidden="true">
          <Image
            className="film-fallback"
            src="/hero-fallback.jpg"
            alt=""
            fill
            priority
            unoptimized
            sizes="100vw"
          />
          <video
            ref={videoRef}
            className={`film-video ${videoReady && !videoFailed ? "is-ready" : ""}`}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/hero-fallback.jpg"
            onCanPlay={() => setVideoReady(true)}
            onPlaying={() => setVideoReady(true)}
            onError={() => setVideoFailed(true)}
          >
            <source src="/landing-video.mp4" type="video/mp4" />
            <source src="/landing-video.webm" type="video/webm" />
          </video>
        </div>
        <div className="film-overlay" aria-hidden="true" />
        {videoFailed ? (
          <button
            className="film-play-button"
            type="button"
            onClick={handleHeroVideoPlay}
            aria-label="Play wedding film"
          >
            <span aria-hidden="true" />
          </button>
        ) : null}
        <nav className="topline" aria-label="Wedding navigation">
          <a href="#details">{t.nav.details}</a>
          <a href="#rsvp">{t.nav.rsvp}</a>
          <a href={mapUrl} target="_blank" rel="noreferrer">
            {t.nav.map}
          </a>
          <button type="button" onClick={() => setLang(isArabic ? "en" : "ar")}>
            {t.nav.switch}
          </button>
        </nav>
        <div className="hero-copy">
          <div className="logo-crop" aria-hidden="true">
            <Image
              src="/monogram-mark.png"
              alt=""
              width={220}
              height={220}
              unoptimized
              priority
            />
          </div>
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1 id="hero-title">{t.hero.title}</h1>
          <div className="hero-actions">
            <a href="#rsvp" className="button primary">
              {t.hero.rsvp}
            </a>
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="button secondary"
            >
              {t.hero.map}
            </a>
          </div>
        </div>
        <p className="scroll-note">{t.hero.scroll}</p>
      </section>

      <section className="details" id="details" aria-label={t.details.label}>
        <div className="detail-grid">
          {t.details.cards.map(([title, body], index) => (
            <article key={title} tabIndex={0}>
              <Image
                className="detail-bg"
                src={detailImages[index]}
                alt=""
                fill
                unoptimized
                sizes="(max-width: 620px) 100vw, (max-width: 900px) 50vw, 25vw"
              />
              <div className="detail-kicker">
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="countdown-section" aria-labelledby="countdown-title">
        <h2 id="countdown-title">{t.countdown.title}</h2>
        <div className="countdown-grid">
          {countdown.map((value, index) => (
            <div className="countdown-unit" key={t.countdown.labels[index]}>
              <strong>{String(value).padStart(2, "0")}</strong>
              <span>{t.countdown.labels[index]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="timeline-section" aria-labelledby="timeline-title">
        <div className="timeline-heading">
          <p className="section-label">{t.timeline.label}</p>
          <h2 id="timeline-title">{t.timeline.title}</h2>
        </div>
        <div className="timeline-grid">
          {t.timeline.items.map((item, index) => (
            <article key={`${item.time}-${item.title}`}>
              <TimelineIcon
                name={
                  index === 0
                    ? "reception"
                    : index === 1
                      ? "entrance"
                      : index === 2
                        ? "dinner"
                        : "party"
                }
              />
              {item.time ? <span className="timeline-time">{item.time}</span> : null}
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rsvp-section" id="rsvp" aria-labelledby="rsvp-title">
        <div className="rsvp-heading">
          <p className="section-label">{t.rsvp.label}</p>
          <h2 id="rsvp-title">
            {selectedGuest ? t.rsvp.personalTitle(selectedGuest.name) : t.rsvp.title}
          </h2>
          <p>{selectedGuest ? t.rsvp.personalBody : t.rsvp.body}</p>
        </div>

        <form className="rsvp-form" onSubmit={handleSubmit}>
          {selectedGuest ? (
            <div className="invited-guest full">
              <span>{t.rsvp.guestName}</span>
              <strong>{selectedGuest.name}</strong>
              <input type="hidden" name="guestSlug" value={selectedGuest.slug} />
              <input type="hidden" name="guestName" value={selectedGuest.name} />
            </div>
          ) : (
            <p className="invitation-missing full">{t.rsvp.missingGuest}</p>
          )}

          {selectedGuest?.canBringPlusOne ? (
            <label className="full">
              {t.rsvp.plusOneName}
              <input
                name="plusOneName"
                type="text"
                autoComplete="name"
                placeholder={t.rsvp.plusOneHint}
              />
            </label>
          ) : null}

          <label className="honeypot">
            Website
            <input name="website" type="text" tabIndex={-1} autoComplete="off" />
          </label>

          <div className="rsvp-actions">
            <button
              type="submit"
              name="attending"
              value="yes"
              disabled={status === "submitting" || !selectedGuest}
            >
              {status === "submitting" ? t.rsvp.sending : t.rsvp.attend}
            </button>
            <button
              type="submit"
              name="attending"
              value="no"
              className="decline"
              disabled={status === "submitting" || !selectedGuest}
            >
              {t.rsvp.decline}
            </button>
          </div>
          {message ? (
            <p className={`form-message ${status}`} role="status">
              {message}
            </p>
          ) : null}
        </form>
      </section>
    </main>
  );
}
