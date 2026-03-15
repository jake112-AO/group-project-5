import crypto from "crypto";

export function createVerificationCode() {
  const code = `${Math.floor(100000 + Math.random() * 900000)}`;
  const codeHash = crypto.createHash("sha256").update(code).digest("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 15);

  return { code, codeHash, expiresAt };
}

export function hashVerificationCode(code) {
  return crypto.createHash("sha256").update(String(code).trim()).digest("hex");
}
