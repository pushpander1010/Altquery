import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM || 'AltQuery <noreply@altquery.com>'
const APP_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'

// ─── Forgot password ──────────────────────────────────────────────────────────
export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Reset your AltQuery password',
    html: emailTemplate({
      title: 'Reset your password',
      preheader: 'You requested a password reset for your AltQuery account.',
      body: `
        <p style="margin:0 0 16px">Hi ${name},</p>
        <p style="margin:0 0 24px">We received a request to reset your password. Click the button below to choose a new one. This link expires in <strong>1 hour</strong>.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#7c3aed;color:#fff;font-weight:600;font-size:15px;padding:12px 28px;border-radius:8px;text-decoration:none">Reset Password</a>
        <p style="margin:24px 0 0;font-size:13px;color:#94a3b8">If you didn't request this, you can safely ignore this email. Your password won't change.</p>
        <p style="margin:12px 0 0;font-size:12px;color:#64748b;word-break:break-all">Or copy this link: ${resetUrl}</p>
      `,
    }),
  })
}

// ─── Email verification ───────────────────────────────────────────────────────
export async function sendVerificationEmail(email: string, name: string, token: string) {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Verify your AltQuery email',
    html: emailTemplate({
      title: 'Verify your email',
      preheader: 'One click to activate your AltQuery account.',
      body: `
        <p style="margin:0 0 16px">Hi ${name},</p>
        <p style="margin:0 0 24px">Thanks for signing up! Click the button below to verify your email address and activate your account. This link expires in <strong>24 hours</strong>.</p>
        <a href="${verifyUrl}" style="display:inline-block;background:#7c3aed;color:#fff;font-weight:600;font-size:15px;padding:12px 28px;border-radius:8px;text-decoration:none">Verify Email</a>
        <p style="margin:24px 0 0;font-size:13px;color:#94a3b8">If you didn't create an account, you can safely ignore this email.</p>
        <p style="margin:12px 0 0;font-size:12px;color:#64748b;word-break:break-all">Or copy this link: ${verifyUrl}</p>
      `,
    }),
  })
}

// ─── Shared HTML template ─────────────────────────────────────────────────────
function emailTemplate({ title, preheader, body }: { title: string; preheader: string; body: string }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <!-- preheader -->
  <span style="display:none;max-height:0;overflow:hidden">${preheader}</span>

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 16px">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#13131a;border:1px solid #2a2a3a;border-radius:16px;overflow:hidden">

        <!-- Header -->
        <tr>
          <td style="padding:28px 32px;border-bottom:1px solid #1e1e2e">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#7c3aed;border-radius:10px;width:36px;height:36px;text-align:center;vertical-align:middle">
                  <span style="color:#fff;font-size:18px;font-weight:700;line-height:36px">⚡</span>
                </td>
                <td style="padding-left:10px;font-size:18px;font-weight:700;color:#fff">AltQuery</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;color:#cbd5e1;font-size:15px;line-height:1.6">
            ${body}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #1e1e2e;font-size:12px;color:#475569;text-align:center">
            © ${new Date().getFullYear()} AltQuery · Viral Content Intelligence<br/>
            <span style="color:#334155">You're receiving this because you signed up at altquery.com</span>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}
