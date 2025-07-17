import { transporter } from "./config";

export async function sendConfirmEmail(to: string, token: string) {
  if (process.env.NODE_ENV === "testing") {
    return;
  }

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

export async function sendConfirmNewEmail(to: string, token: string) {
  if (process.env.NODE_ENV === "testing") {
    return;
  }

  const confirmUrl = `${process.env.FRONTEND_URL}/confirm-new-email?token=${token}`;

  await transporter.sendMail({
    from: `"PeakRent" <${process.env.SMTP_USER}>`,
    to,
    subject: "Confirmez votre nouvelle adresse email",
    html: `
      <p>Bonjour 👋</p>
      <p>Vous avez demandé à changer votre adresse email sur PeakRent.</p>
      <p>Pour confirmer cette modification, veuillez cliquer sur le lien ci-dessous :</p>
      <p><a href="${confirmUrl}">${confirmUrl}</a></p>
      <p>Ce lien est valable pendant 15 minutes.</p>
      <p>Si vous n'avez pas demandé ce changement, vous pouvez ignorer ce message.</p>
      <br/>
      <p>— L'équipe PeakRent</p>
    `,
  });
}
