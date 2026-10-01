const DEFAULT_TIME_ZONE = process.env.APP_TIME_ZONE || "Asia/Kolkata";

export function getTodayDateKey() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: DEFAULT_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const map = Object.fromEntries(parts.filter(p => p.type !== "literal").map(p => [p.type, p.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

export function dateFromKey(key: string) { return new Date(`${key}T00:00:00.000Z`); }

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "full", timeZone: "UTC" }).format(date);
}
