import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOTPEmail({ email, otp, userName = "there" }) {
  const sender = process.env.EMAIL_FROM || `"Art Hall Support" <${process.env.EMAIL_USER}>`;
  const otpDisplay = otp.slice(0, 3) + " " + otp.slice(3);
  const digits = otp.split("");

  const info = await transporter.sendMail({
    from: sender,
    to: email,
    subject: `${otp} — ArtHall Password Reset Code`,
    text: `Your ArtHall password reset verification code is: ${otp}. It will expire in 10 minutes.`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password - ArtHall</title>
</head>
<body style="margin:0;padding:0;background-color:#0A0A0A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;" cellpadding="0" cellspacing="0">

          <!-- Main Card -->
          <tr>
            <td style="background:linear-gradient(160deg,#181818,#101010);border:1px solid rgba(212,175,55,0.35);border-radius:24px;padding:0;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.8);">

              <!-- Gold top accent bar -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="height:4px;background:linear-gradient(90deg,#997300,#FFE58F,#D4AF37,#AA7C11);"></td>
                </tr>
              </table>

              <!-- Inner Content -->
              <table width="100%" cellpadding="0" cellspacing="0" style="padding:42px 38px 36px;">

                <!-- Logo & Brand Header -->
                <tr>
                  <td align="center" style="padding-bottom:26px;">
                    <p style="margin:0;font-size:28px;font-weight:900;color:#D4AF37;letter-spacing:5px;text-transform:uppercase;">ARTHALL</p>
                    <p style="margin:6px 0 0;font-size:11px;color:#888888;letter-spacing:2.5px;text-transform:uppercase;">Creative Art &amp; Collector Platform</p>
                  </td>
                </tr>

                <!-- Subtle gold divider -->
                <tr>
                  <td style="padding-bottom:28px;">
                    <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(212,175,55,0.4),transparent);"></div>
                  </td>
                </tr>

                <!-- Heading -->
                <tr>
                  <td style="padding-bottom:10px;">
                    <p style="margin:0;font-size:22px;font-weight:700;color:#FFFFFF;letter-spacing:0.5px;">Password Reset Request</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:28px;">
                    <p style="margin:0;font-size:14px;color:#AAAAAA;line-height:1.7;">
                      Hello <strong style="color:#FFE58F;">${userName}</strong>,<br>
                      We received a request to reset your password. Use the 6-digit verification code below to proceed:
                    </p>
                  </td>
                </tr>

                <!-- OTP Code Display Card -->
                <tr>
                  <td align="center" style="padding-bottom:20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(145deg,#1E1E1E,#141414);border:1px solid rgba(212,175,55,0.4);border-radius:18px;padding:26px 20px;text-align:center;">
                      <tr>
                        <td align="center">
                          <p style="margin:0 0 12px;font-size:11px;font-weight:600;color:#A0A0A0;letter-spacing:3px;text-transform:uppercase;">VERIFICATION CODE</p>

                          <!-- Digit Boxes -->
                          <table cellpadding="0" cellspacing="0" style="margin:0 auto 16px;">
                            <tr>
                              ${digits.map((d, i) => `
                              <td style="padding:0 ${i === 2 ? '8px' : '4px'} 0 ${i === 3 ? '8px' : '4px'};">
                                <div style="width:42px;height:52px;background:#0F0F0F;border:1.5px solid rgba(212,175,55,0.5);border-radius:10px;line-height:50px;font-size:26px;font-weight:800;color:#FFE58F;text-align:center;">${d}</div>
                              </td>`).join("")}
                            </tr>
                          </table>

                          <!-- Single Copy-Paste Box -->
                          <div style="display:inline-block;background:#0A0A0A;border:1px dashed rgba(212,175,55,0.6);border-radius:10px;padding:10px 24px;margin-top:6px;">
                            <span style="font-size:26px;font-weight:900;letter-spacing:8px;color:#D4AF37;font-family:Consolas,Monaco,'Courier New',monospace;-webkit-user-select:all;user-select:all;">${otp}</span>
                          </div>
                          <p style="margin:10px 0 0;font-size:12px;color:#888888;">Select and copy the code above to paste directly</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Time Validity -->
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    <p style="margin:0;font-size:13px;color:#C49B2F;font-weight:500;">
                      ⏱ This code is valid for <strong>10 minutes</strong>.
                    </p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding-bottom:20px;">
                    <div style="height:1px;background:rgba(255,255,255,0.08);"></div>
                  </td>
                </tr>

                <!-- Security Notice -->
                <tr>
                  <td>
                    <p style="margin:0;font-size:12px;color:#666666;line-height:1.6;">
                      🔒 <strong>Security Tip:</strong> If you did not request this password reset, please disregard this email. Your ArtHall account remains secure.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td align="center" style="padding-top:26px;">
                    <p style="margin:0;font-size:11px;color:#444444;">&copy; ${new Date().getFullYear()} ArtHall. All rights reserved.</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
    `,
  });

  console.log("[Email] OTP sent to:", email, "| Message ID:", info.messageId);
  return { success: true, messageId: info.messageId };
}
