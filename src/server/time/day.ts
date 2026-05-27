export function startOfDayUTC(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function addDaysUTC(date: Date, days: number) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function getTzOffsetMinutesAt(args: { date: Date; timeZone: string }) {
  const { date, timeZone } = args;
  const parts = new Intl.DateTimeFormat("en", {
    timeZone,
    timeZoneName: "shortOffset",
  }).formatToParts(date);

  const tzName = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT";
  const m = tzName.match(/^GMT([+-])(\d{1,2})(?::?(\d{2}))?$/);
  if (!m) return 0;

  const sign = m[1] === "-" ? -1 : 1;
  const hh = Number.parseInt(m[2]!, 10);
  const mm = m[3] ? Number.parseInt(m[3], 10) : 0;
  return sign * (hh * 60 + mm);
}

export function localDateInTimeZone(args: { date: Date; timeZone: string }) {
  const { date, timeZone } = args;
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;
  if (!y || !m || !d) throw new Error("Failed to format local date");
  return `${y}-${m}-${d}`;
}

export function utcStartOfLocalDay(args: { localDate: string; timeZone: string }) {
  const { localDate, timeZone } = args;
  const [yStr, mStr, dStr] = localDate.split("-");
  const y = Number.parseInt(yStr ?? "", 10);
  const m = Number.parseInt(mStr ?? "", 10);
  const d = Number.parseInt(dStr ?? "", 10);
  if (!y || !m || !d) throw new Error(`Invalid localDate: ${localDate}`);

  // Guess local midnight as UTC midnight, then shift by offset at that instant.
  const guess = new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
  const offsetMinutes = getTzOffsetMinutesAt({ date: guess, timeZone });
  return new Date(guess.getTime() - offsetMinutes * 60 * 1000);
}
