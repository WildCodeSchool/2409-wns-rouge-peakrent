import { transporter } from "./config";

export async function sendRecoverEmail(to: string, token: string) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"PeakRent" <${process.env.SMTP_USER}>`,
    to,
    subject: "Réinitialisation de votre mot de passe",
    html: `
      <p>Bonjour,</p>
      <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous pour continuer :</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>Ce lien expirera dans 1 heure.</p>
      <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer ce message.</p>
    `,
  });
}
