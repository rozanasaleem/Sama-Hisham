"use client";

import { useMemo, useState } from "react";
import { seatingGuests } from "../../lib/seating";

function normalizeName(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[''`.-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getMatchScore(guestName: string, query: string) {
  const normalizedName = normalizeName(guestName);
  const normalizedQuery = normalizeName(query);
  const queryTokens = normalizedQuery.split(" ").filter(Boolean);
  const nameTokens = normalizedName.split(" ").filter(Boolean);

  if (!normalizedQuery) {
    return 0;
  }

  if (normalizedName === normalizedQuery) {
    return 100;
  }

  if (queryTokens.length === 1 && nameTokens[0] === normalizedQuery) {
    return 95;
  }

  if (normalizedName.startsWith(normalizedQuery)) {
    return 80;
  }

  if (normalizedName.includes(normalizedQuery)) {
    return 60;
  }

  const matchingTokens = queryTokens.filter((token) =>
    nameTokens.some((nameToken) => nameToken.startsWith(token) || nameToken.includes(token)),
  );

  return matchingTokens.length === queryTokens.length ? 40 + matchingTokens.length : 0;
}

export function SeatingFinder() {
  const [query, setQuery] = useState("");
  const trimmedQuery = query.trim();
  const results = useMemo(() => {
    if (trimmedQuery.length < 2) {
      return [];
    }

    const normalizedQuery = normalizeName(trimmedQuery);
    const queryTokens = normalizedQuery.split(" ").filter(Boolean);
    const visibleGuests = seatingGuests.filter(
      (guest) => !normalizeName(guest.name).includes("marato"),
    );

    if (queryTokens.length === 1) {
      const firstNameMatches = visibleGuests.filter(
        (guest) => normalizeName(guest.name).split(" ")[0] === normalizedQuery,
      );

      if (firstNameMatches.length > 0) {
        return firstNameMatches
          .map((guest) => ({ ...guest, score: 95 }))
          .sort((a, b) => a.table - b.table || a.name.localeCompare(b.name));
      }
    }

    return visibleGuests
      .map((guest) => ({ ...guest, score: getMatchScore(guest.name, trimmedQuery) }))
      .filter((guest) => guest.score > 0)
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
      .slice(0, 24);
  }, [trimmedQuery]);

  const hasSearched = trimmedQuery.length >= 2;

  return (
    <main className="seating-page">
      <section className="seating-hero" aria-labelledby="seating-title">
        <a className="seating-home-link" href="/">
          Sama & Hisham
        </a>
        <div className="seating-panel">
          <p className="section-label">Wedding Seating</p>
          <h1 id="seating-title">Find your table</h1>
          <p className="seating-intro">
            Search your name below and your table number will appear right away.
          </p>

          <label className="seating-search">
            <span>Your name</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Start typing your name"
              autoComplete="name"
              autoFocus
            />
          </label>

          <div className="seating-results" aria-live="polite">
            {!hasSearched ? (
              <p className="seating-empty">Type at least two letters to search.</p>
            ) : results.length > 0 ? (
              results.map((guest) => (
                <article className="table-result" key={`${guest.name}-${guest.table}`}>
                  <div>
                    <span>Guest</span>
                    <strong>{guest.name}</strong>
                  </div>
                  <div className="table-number" aria-label={`Table ${guest.table}`}>
                    <span>Table</span>
                    <strong>{guest.table}</strong>
                  </div>
                </article>
              ))
            ) : (
              <div className="seating-empty">
                <strong>No match found</strong>
                <span>Please check the spelling or ask the welcome table for help.</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
