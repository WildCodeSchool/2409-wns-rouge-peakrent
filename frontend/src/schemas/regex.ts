export const emailRegex = new RegExp(
  "^(?=.{1,64}@.{1,255}$)(?=.{1,254}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
);

export const passwordRegex = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
);

// Zipcode regex
export const zipCodeRegex = /^[a-z0-9][a-z0-9\- ]{0,10}[a-z0-9]$/i;

export const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/;

export const cityRegex =
  /^[A-Za-zÀ-ÖØ-öø-ÿĀ-žȘșȚțŁłčęėįųūăîâşţșțäöüßéèêëçîïôûùÿñ\s'-]+$/;

export const addressRegex = /^[A-Za-z0-9À-ÖØ-öø-ÿ\s,.-]+$/;

export const numberRegex = /^\d+$/;

export const letterRegex = /^[A-Za-z]+$/;
