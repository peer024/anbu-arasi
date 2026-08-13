import { memories } from "./memories";
import { quotes } from "./quotes";
import { songs } from "./songs";

const BIRTHDAY_DATE = new Date(
  "2027-03-03T00:00:00+05:30"
);

const START_DATE = new Date(
  "2026-08-14T00:00:00+05:30"
);

/* =========================================================
   TYPES
========================================================= */

type DailyContent = {
  day: number;
  daysRemaining: number;
  memory?: (typeof memories)[number];
  quote?: (typeof quotes)[number];
  song?: (typeof songs)[number];
};

/* =========================================================
   CURRENT DAY
========================================================= */

export function getCurrentDay(): number {
  const now = new Date();

  const difference =
    now.getTime() -
    START_DATE.getTime();

  const day =
    Math.floor(
      difference /
        (1000 * 60 * 60 * 24)
    ) + 1;

  return Math.max(day, 1);
}

/* =========================================================
   DAYS REMAINING
========================================================= */

export function getDaysRemaining(): number {
  const now = new Date();

  const difference =
    BIRTHDAY_DATE.getTime() -
    now.getTime();

  if (difference <= 0) {
    return 0;
  }

  return Math.ceil(
    difference /
      (1000 * 60 * 60 * 24)
  );
}

/* =========================================================
   MEMORY
========================================================= */

function getMemory(day: number) {
  if (memories.length === 0) {
    return undefined;
  }

  const index =
    (day - 1) % memories.length;

  return memories[index];
}

/* =========================================================
   QUOTE
========================================================= */

function getQuote(
  day: number
) {
  if (quotes.length === 0) {
    return undefined;
  }

  const exactQuote =
    quotes.find(
      (quote) =>
        quote.day === day
    );

  if (exactQuote) {
    return exactQuote;
  }

  /*
    Reuse quotes when the
    available list is shorter
    than the number of days.
  */

  const index =
    (day - 1) %
    quotes.length;

  return quotes[index];
}

/* =========================================================
   SONG
========================================================= */

function getSong(
  day: number
) {
  if (songs.length === 0) {
    return undefined;
  }

  const exactSong =
    songs.find(
      (song) =>
        song.day === day
    );

  if (exactSong) {
    return exactSong;
  }

  /*
    Reuse available songs when
    there is no exact day.
  */

  const index =
    (day - 1) %
    songs.length;

  return songs[index];
}

/* =========================================================
   DAILY CONTENT
========================================================= */

export function getDailyContent(
  previewDay?: number
): DailyContent {
  const day =
    previewDay !== undefined
      ? Math.max(
          1,
          Math.floor(previewDay)
        )
      : getCurrentDay();

  return {
    day,

    daysRemaining:
      getDaysRemaining(),

    memory:
      getMemory(day),

    quote:
      getQuote(day),

    song:
      getSong(day),
  };
}