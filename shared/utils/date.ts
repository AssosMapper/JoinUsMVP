export function friendlyDate(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const inputDate = new Date(date);
  const inputDay = new Date(
    inputDate.getFullYear(),
    inputDate.getMonth(),
    inputDate.getDate()
  );

  const timeStr =
    inputDate.getHours().toString().padStart(2, "0") +
    "h" +
    (inputDate.getMinutes() > 0
      ? inputDate.getMinutes().toString().padStart(2, "0")
      : "");

  if (inputDay.getTime() === today.getTime()) {
    return `Aujourd'hui à ${timeStr}`;
  } else if (inputDay.getTime() === tomorrow.getTime()) {
    return `Demain à ${timeStr}`;
  } else if (inputDay.getTime() === yesterday.getTime()) {
    return `Hier à ${timeStr}`;
  }

  const days = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];
  const months = [
    "jan.",
    "fév.",
    "mars",
    "avr.",
    "mai",
    "juin",
    "juil.",
    "août",
    "sept.",
    "oct.",
    "nov.",
    "déc.",
  ];

  return `${days[inputDate.getDay()]} ${inputDate.getDate()} ${
    months[inputDate.getMonth()]
  }, ${timeStr}`;
}
