import { rsvps } from "../../../db/schema";
import { findInvitedGuest } from "../../../lib/guests";

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function toRouteErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected error";

  if (message.includes("Cloudflare D1 binding `DB` is unavailable")) {
    return "The RSVP table is not connected on this deployment yet. Please try again later.";
  }

  if (message.includes("no such table") || message.includes('from "rsvps"')) {
    return "The RSVP table is not ready yet. Please try again after the site finishes publishing.";
  }

  return "Unable to save your RSVP. Please try again.";
}

async function saveToGoogleSheet(rsvp: {
  guestSlug: string;
  guestName: string;
  firstName: string;
  lastName: string;
  plusOneIncluded: boolean;
  plusOneName: string | null;
  attending: "yes" | "no";
}) {
  const webhookUrl = process.env.RSVP_GOOGLE_SHEET_WEBHOOK_URL;

  if (!webhookUrl) {
    return false;
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      ...rsvp,
      secret: process.env.RSVP_GOOGLE_SHEET_WEBHOOK_SECRET ?? "",
      submittedAt: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error("Google Sheet RSVP sync failed.");
  }

  return true;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      guestSlug?: string;
      guestName?: string;
      firstName?: string;
      lastName?: string;
      plusOneIncluded?: string;
      plusOneName?: string;
      attending?: string;
      website?: string;
    };

    if (payload.website) {
      return Response.json({ ok: true }, { status: 201 });
    }

    const guestSlug = cleanText(payload.guestSlug, 80);
    const invitedGuest = guestSlug ? findInvitedGuest(guestSlug) : undefined;
    const guestName = invitedGuest?.name ?? cleanText(payload.guestName, 120);
    const nameParts = guestName.split(/\s+/);
    const firstName = cleanText(
      payload.firstName ?? nameParts[0] ?? "",
      80
    );
    const lastName = cleanText(
      payload.lastName ?? nameParts.slice(1).join(" "),
      80
    );
    const attending = payload.attending === "no" ? "no" : "yes";
    const plusOneIncluded = payload.plusOneIncluded !== "no";
    const plusOneName =
      attending === "yes" && invitedGuest?.canBringPlusOne && plusOneIncluded
        ? cleanText(payload.plusOneName, 120)
        : "";

    if (!invitedGuest) {
      return Response.json(
        { error: "Please open your personal invitation link to RSVP." },
        { status: 400 }
      );
    }

    if (!firstName || !lastName) {
      return Response.json(
        { error: "Please add your first and last name." },
        { status: 400 }
      );
    }

    const rsvp = {
      guestSlug,
      guestName,
      firstName,
      lastName,
      plusOneName: plusOneName || null,
      plusOneIncluded,
      attending,
    } as const;

    const savedToGoogleSheet = await saveToGoogleSheet(rsvp);

    if (savedToGoogleSheet) {
      return Response.json({ ok: true }, { status: 201 });
    }

    try {
      const { getDb } = await import("../../../db");
      const db = getDb();
      await db.insert(rsvps).values({
        guestName: rsvp.guestName,
        firstName: rsvp.firstName,
        lastName: rsvp.lastName,
        plusOneName: rsvp.plusOneName,
        attending: rsvp.attending,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";

      const isMissingDatabase =
        message.includes("Cloudflare D1 binding `DB` is unavailable") ||
        message.includes("cloudflare:workers");

      if (!isMissingDatabase) {
        throw error;
      }

      console.info("RSVP submitted without database binding", {
        ...rsvp,
        guestSlug,
        submittedAt: new Date().toISOString(),
      });
    }

    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: toRouteErrorMessage(error) },
      { status: 500 }
    );
  }
}
