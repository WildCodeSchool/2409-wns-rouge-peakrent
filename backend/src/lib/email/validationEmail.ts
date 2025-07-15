import { transporter } from "./config";

export async function sendConfirmEmail(to: string, token: string) {
  const confirmUrl = `${process.env.FRONTEND_URL}/validate-email?token=${token}`;

  await transporter.sendMail({
    from: `"PeakRent" <${process.env.SMTP_USER}>`,
    to,
    subject: "Confirmez votre adresse email",
    html: `
      <p>Bienvenue sur PeakRent 👋</p>
      <p>Merci de vous être inscrit ! Pour activer votre compte, veuillez confirmer votre adresse email en cliquant sur le lien ci-dessous :</p>
      <p><a href="${confirmUrl}">${confirmUrl}</a></p>
      <p>Ce lien est valable pendant 24 heures.</p>
      <p>Si vous n'avez pas créé de compte, vous pouvez ignorer ce message.</p>
      <br/>
      <p>— L'équipe PeakRent</p>
    `,
  });
}
