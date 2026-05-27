import test from "node:test";
import assert from "node:assert/strict";
import { localDateInTimeZone, utcStartOfLocalDay } from "@/server/time/day";

test("localDateInTimeZone formats YYYY-MM-DD in a timezone", () => {
  const d = new Date("2026-05-22T12:34:56.000Z");
  const sh = localDateInTimeZone({ date: d, timeZone: "Asia/Shanghai" });
  const la = localDateInTimeZone({ date: d, timeZone: "America/Los_Angeles" });

  assert.match(sh, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(la, /^\d{4}-\d{2}-\d{2}$/);
  // Same instant can be different local dates across timezones.
  assert.ok(typeof sh === "string" && typeof la === "string");
});

test("utcStartOfLocalDay returns a UTC instant that is local midnight", () => {
  const localDate = "2026-05-22";
  const tz = "Asia/Shanghai";
  const utc = utcStartOfLocalDay({ localDate, timeZone: tz });

  const local = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(utc);

  const get = (t: string) => local.find((p) => p.type === t)?.value;
  assert.equal(`${get("year")}-${get("month")}-${get("day")}`, localDate);
  assert.equal(get("hour"), "00");
  assert.equal(get("minute"), "00");
});

test("utcStartOfLocalDay handles DST transitions (America/Los_Angeles)", () => {
  // DST in LA ends early Nov; midnight should still map correctly.
  const tz = "America/Los_Angeles";
  const localDate = "2026-11-02";
  const utc = utcStartOfLocalDay({ localDate, timeZone: tz });

  const local = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(utc);
  const get = (t: string) => local.find((p) => p.type === t)?.value;

  assert.equal(`${get("year")}-${get("month")}-${get("day")}`, localDate);
  assert.equal(get("hour"), "00");
  assert.equal(get("minute"), "00");
});

