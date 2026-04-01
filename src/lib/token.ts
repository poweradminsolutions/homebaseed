import crypto from "crypto";

const SECRET = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "fallback-secret";

export function signToken(data: Record<string, unknown>): string {
  const payload = JSON.stringify(data);
  const hash = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("hex");
  return Buffer.from(`${payload}.${hash}`).toString("base64");
}

export function verifyToken(token: string): Record<string, unknown> | null {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [payload, hash] = decoded.split(".");

    const expectedHash = crypto
      .createHmac("sha256", SECRET)
      .update(payload)
      .digest("hex");

    if (hash !== expectedHash) {
      return null;
    }

    return JSON.parse(payload);
  } catch {
    return null;
  }
}
