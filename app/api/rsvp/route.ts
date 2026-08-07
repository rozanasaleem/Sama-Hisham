import { getDb } from "../../../db";
import { rsvps } from "../../../db/schema";

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function toRouteErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected error";

  if (message.includes("no such table") || message.includes('from "rsvps"')) {
    return "The RSVP table is not ready yet. Please try again after the site finishes publishing.";
  }

  return "Unable to save your RSVP. Please try again.";
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      name?: string;
      attending?: string;
      guests?: number;
      contact?: string;
      note?: string;
      website?: string;
    };

    if (payload.website) {
      return Response.json({ ok: true }, { status: 201 });
    }

    const name = cleanText(payload.name, 120);
    const attending = payload.attending === "no" ? "no" : "yes";
    const guests = Number.isFinite(payload.guests)
      ? Math.min(Math.max(Math.round(Number(payload.guests)), 1), 10)
      : 1;
    const contact = cleanText(payload.contact, 180);
    const note = cleanText(payload.note, 500);

    if (!name) {
      return Response.json({ error: "Please add your name." }, { status: 400 });
    }

    const db = getDb();
    await db.insert(rsvps).values({ name, attending, guests, contact, note });

    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: toRouteErrorMessage(error) },
      { status: 500 }
    );
  }
}
