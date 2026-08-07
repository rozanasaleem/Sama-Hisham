"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

const mapUrl =
  "https://www.google.com/maps/search/?api=1&query=Odeh%20Hotel%20Aida%27s%20Garden";

type RsvpStatus = "idle" | "submitting" | "success" | "error";

export default function Home() {
  const [status, setStatus] = useState<RsvpStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      attending: String(formData.get("attending") ?? ""),
      guests: Number(formData.get("guests") ?? 1),
      contact: String(formData.get("contact") ?? ""),
      note: String(formData.get("note") ?? ""),
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
        throw new Error(result.error ?? "Unable to save your RSVP.");
      }

      setStatus("success");
      setMessage("Thank you. Your RSVP has been saved.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">10 October 2026</p>
          <h1 id="hero-title">Sama Matar & Hisham Daraghmeh</h1>
          <p className="intro">
            We would love to celebrate our wedding with you at Odeh Hotel,
            Aida's Garden.
          </p>
          <div className="hero-actions">
            <a href="#rsvp" className="button primary">
              RSVP
            </a>
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="button secondary"
            >
              Open Map
            </a>
          </div>
        </div>
        <div className="hero-image" aria-hidden="true">
          <Image
            src="/couple-hero.jpg"
            alt=""
            fill
            unoptimized
            priority
            sizes="(max-width: 900px) 100vw, 52vw"
          />
        </div>
      </section>

      <section className="details" aria-labelledby="details-title">
        <div>
          <p className="section-label">Wedding Day</p>
          <h2 id="details-title">Saturday evening, 10 October</h2>
        </div>
        <div className="detail-grid">
          <article>
            <span>01</span>
            <h3>Venue</h3>
            <p>Odeh Hotel, Aida's Garden</p>
          </article>
          <article>
            <span>02</span>
            <h3>Date</h3>
            <p>10 October 2026</p>
          </article>
          <article>
            <span>03</span>
            <h3>RSVP</h3>
            <p>Let us know whether you can join us.</p>
          </article>
        </div>
      </section>

      <section className="story-band">
        <div className="portrait">
          <Image
            src="/couple-arch.jpg"
            alt="Sama and Hisham standing together under an archway"
            fill
            unoptimized
            sizes="(max-width: 900px) 100vw, 34vw"
          />
        </div>
        <div className="story-copy">
          <p className="section-label">S & H</p>
          <h2>Simple, warm, and surrounded by the people we love.</h2>
          <p>
            Come as you are, ready for dinner, music, and a beautiful night in
            the garden.
          </p>
        </div>
      </section>

      <section className="rsvp-section" id="rsvp" aria-labelledby="rsvp-title">
        <div className="rsvp-heading">
          <p className="section-label">RSVP</p>
          <h2 id="rsvp-title">Will you be there?</h2>
          <p>Please send your response when you know your plans.</p>
        </div>

        <form className="rsvp-form" onSubmit={handleSubmit}>
          <label>
            Your name
            <input name="name" type="text" autoComplete="name" required />
          </label>

          <fieldset>
            <legend>Attendance</legend>
            <label className="radio-row">
              <input name="attending" type="radio" value="yes" required />
              Joyfully attending
            </label>
            <label className="radio-row">
              <input name="attending" type="radio" value="no" />
              Sadly cannot attend
            </label>
          </fieldset>

          <label>
            Number of guests
            <input
              name="guests"
              type="number"
              min="1"
              max="10"
              defaultValue="1"
              required
            />
          </label>

          <label>
            Phone or email
            <input name="contact" type="text" autoComplete="email" />
          </label>

          <label className="full">
            Notes or dietary needs
            <textarea name="note" rows={4} />
          </label>

          <label className="honeypot">
            Website
            <input name="website" type="text" tabIndex={-1} autoComplete="off" />
          </label>

          <button type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending..." : "Send RSVP"}
          </button>
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
