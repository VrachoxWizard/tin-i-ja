/**
 * Transactional email service using Resend.
 *
 * Domain note: Until a custom domain is verified in Resend, emails are sent
 * from noreply@resend.dev (Resend's shared domain). Set RESEND_FROM_EMAIL in
 * your environment to override once your domain is verified.
 *
 * All functions are fire-and-forget safe — errors are logged but don't throw.
 */

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/** Sender address — override in env once domain is verified */
const FROM = process.env.RESEND_FROM_EMAIL ?? "DealFlow <noreply@resend.dev>";
/** Admin inbox for internal alerts */
const ADMIN_EMAIL = process.env.RESEND_ADMIN_EMAIL ?? "";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── Shared helpers ────────────────────────────────────────────────────────────

function baseLayout(body: string, title: string): string {
  return `
<!DOCTYPE html>
<html lang="hr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #030712; color: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 580px; margin: 0 auto; padding: 48px 24px; }
    .logo { font-size: 22px; font-weight: 800; letter-spacing: -0.04em; color: #D4AF37; margin-bottom: 40px; }
    .card { background: #050a15; border: 1px solid #1e293b; border-radius: 2px; padding: 32px; margin-bottom: 24px; }
    .label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #94a3b8; margin-bottom: 8px; }
    .value { font-size: 15px; color: #f8fafc; font-weight: 600; }
    .btn { display: inline-block; background: #D4AF37; color: #030712; text-decoration: none; padding: 14px 28px; font-size: 12px; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; margin-top: 24px; }
    .divider { border: none; border-top: 1px solid #1e293b; margin: 24px 0; }
    .footer { font-size: 11px; color: #475569; text-align: center; margin-top: 40px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">DealFlow</div>
    ${body}
    <hr class="divider" />
    <p class="footer">© ${new Date().getFullYear()} DealFlow · Diskretna M&A platforma za Hrvatsku<br/>Ovaj email je automatski generiran — molimo ne odgovarajte.</p>
  </div>
</body>
</html>`;
}

// ── NDA Notifications ─────────────────────────────────────────────────────────

/**
 * Notify the seller that a buyer has requested NDA access to their listing.
 */
export async function sendNdaRequestEmail(params: {
  sellerEmail: string;
  sellerName: string;
  listingCode: string;
  dashboardUrl: string;
}): Promise<void> {
  const { sellerEmail, sellerName, listingCode, dashboardUrl } = params;
  const safeSellerName = escapeHtml(sellerName);
  const safeListingCode = escapeHtml(listingCode);

  const body = `
    <div class="card">
      <p class="label">Novi NDA zahtjev</p>
      <p style="font-size:18px;font-weight:700;color:#f8fafc;margin:8px 0 16px;">Kupac je zatražio pristup Deal Roomu</p>
      <p style="color:#94a3b8;font-size:14px;line-height:1.6;">
        Poštovani ${safeSellerName},<br/><br/>
        Primili smo NDA zahtjev za vaš oglas <strong style="color:#D4AF37;">${safeListingCode}</strong>. 
        Pregledajte zahtjev i odlučite o odobrenju ili odbijanju pristupa.
      </p>
      <a href="${dashboardUrl}" class="btn">Pregled zahtjeva →</a>
    </div>`;

  await resend.emails.send({
    from: FROM,
    to: sellerEmail,
    subject: `Novi NDA zahtjev — Oglas ${listingCode} | DealFlow`,
    html: baseLayout(body, "Novi NDA zahtjev"),
  }).catch((err) => console.error("[email] sendNdaRequestEmail failed:", err));
}

/**
 * Notify the buyer of an NDA decision (approved or rejected).
 */
export async function sendNdaDecisionEmail(params: {
  buyerEmail: string;
  buyerName: string;
  listingCode: string;
  decision: "approve" | "reject";
  dashboardUrl: string;
}): Promise<void> {
  const { buyerEmail, buyerName, listingCode, decision, dashboardUrl } = params;
  const approved = decision === "approve";
  const safeBuyerName = escapeHtml(buyerName);
  const safeListingCode = escapeHtml(listingCode);

  const body = `
    <div class="card">
      <p class="label">${approved ? "NDA odobren" : "NDA odbijen"}</p>
      <p style="font-size:18px;font-weight:700;color:${approved ? "#D4AF37" : "#ef4444"};margin:8px 0 16px;">
        ${approved ? "Pristup Deal Roomu je odobren" : "Vaš NDA zahtjev je odbijen"}
      </p>
      <p style="color:#94a3b8;font-size:14px;line-height:1.6;">
        Poštovani ${safeBuyerName},<br/><br/>
        ${approved
          ? `Vaš zahtjev za pristup Deal Roomu oglasa <strong style="color:#D4AF37;">${safeListingCode}</strong> je <strong style="color:#D4AF37;">odobren</strong>. Sada možete pregledati povjerljivu dokumentaciju.`
          : `Vaš zahtjev za pristup Deal Roomu oglasa <strong style="color:#ef4444;">${safeListingCode}</strong> nažalost nije odobren u ovom trenutku.`
        }
      </p>
      ${approved ? `<a href="${dashboardUrl}" class="btn">Otvori Deal Room →</a>` : ""}
    </div>`;

  await resend.emails.send({
    from: FROM,
    to: buyerEmail,
    subject: `NDA ${approved ? "odobren" : "odbijen"} — Oglas ${listingCode} | DealFlow`,
    html: baseLayout(body, `NDA ${approved ? "odobren" : "odbijen"}`),
  }).catch((err) => console.error("[email] sendNdaDecisionEmail failed:", err));
}

// ── Match Notification ────────────────────────────────────────────────────────

/**
 * Notify a buyer when a new listing matches their investment profile.
 */
export async function sendMatchEmail(params: {
  buyerEmail: string;
  buyerName: string;
  listingCode: string;
  industry: string;
  region: string;
  dashboardUrl: string;
}): Promise<void> {
  const { buyerEmail, buyerName, listingCode, industry, region, dashboardUrl } = params;
  const safeBuyerName = escapeHtml(buyerName);
  const safeListingCode = escapeHtml(listingCode);
  const safeIndustry = escapeHtml(industry);
  const safeRegion = escapeHtml(region);

  const body = `
    <div class="card">
      <p class="label">Nova investicijska prilika</p>
      <p style="font-size:18px;font-weight:700;color:#D4AF37;margin:8px 0 16px;">Pronađeno uparivanje s vašim profilom</p>
      <p style="color:#94a3b8;font-size:14px;line-height:1.6;">
        Poštovani ${safeBuyerName},<br/><br/>
        AI sustav je pronašao novi oglas koji odgovara vašim investicijskim kriterijima.
      </p>
      <div style="border-top:1px solid #1e293b;margin:20px 0;padding-top:20px;">
        <p class="label">Sektor</p><p class="value">${safeIndustry}</p>
        <p class="label" style="margin-top:12px;">Regija</p><p class="value">${safeRegion}</p>
        <p class="label" style="margin-top:12px;">Šifra oglasa</p><p class="value" style="color:#D4AF37;">${safeListingCode}</p>
      </div>
      <a href="${dashboardUrl}" class="btn">Pregledaj teaser →</a>
    </div>`;

  await resend.emails.send({
    from: FROM,
    to: buyerEmail,
    subject: `Nova M&A prilika — ${industry}, ${region} | DealFlow`,
    html: baseLayout(body, "Nova investicijska prilika"),
  }).catch((err) => console.error("[email] sendMatchEmail failed:", err));
}

// ── Contact Form ──────────────────────────────────────────────────────────────

/**
 * Forward a contact form submission to the admin inbox.
 */
export async function sendContactEmail(params: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  if (!ADMIN_EMAIL) {
    console.warn("[email] RESEND_ADMIN_EMAIL not set — contact form email skipped");
    return;
  }

  const { name, email, message } = params;
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message);

  const body = `
    <div class="card">
      <p class="label">Kontakt forma</p>
      <p style="font-size:18px;font-weight:700;color:#f8fafc;margin:8px 0 16px;">Nova poruka s web stranice</p>
      <p class="label">Ime</p><p class="value">${safeName}</p>
      <p class="label" style="margin-top:12px;">Email</p><p class="value"><a href="mailto:${safeEmail}" style="color:#D4AF37;">${safeEmail}</a></p>
      <p class="label" style="margin-top:12px;">Poruka</p>
      <p style="color:#94a3b8;font-size:14px;line-height:1.6;white-space:pre-wrap;">${safeMessage}</p>
    </div>`;

  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    replyTo: email,
    subject: `Kontakt: ${name} | DealFlow`,
    html: baseLayout(body, "Nova kontakt poruka"),
  }).catch((err) => console.error("[email] sendContactEmail failed:", err));
}
