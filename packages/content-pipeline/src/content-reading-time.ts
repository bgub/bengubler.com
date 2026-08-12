export type ReadingTime = {
  minutes: number;
  words: number;
};

export type ReadingTimeOptions = {
  wordsPerMinute?: number;
};

// Allocation-free equivalent of reading-time 1.5's word-counting algorithm.
export function getReadingTime(
  text: string,
  { wordsPerMinute = 200 }: ReadingTimeOptions = {},
): ReadingTime {
  if (!Number.isFinite(wordsPerMinute) || wordsPerMinute <= 0) {
    throw new Error("wordsPerMinute must be a positive number");
  }

  let words = 0;
  let start = 0;
  let end = text.length - 1;

  while (isWordBound(text.charCodeAt(start))) start++;
  while (isWordBound(text.charCodeAt(end))) end--;

  for (let index = start; index <= end; index++) {
    const current = text.charCodeAt(index);
    const next = charCodeAt(text, index + 1);

    if (
      isCjk(current) ||
      (!isWordBound(current) && (isWordBound(next) || isCjk(next)))
    ) {
      words++;
    }

    if (isCjk(current)) {
      while (
        index <= end &&
        (isPunctuation(charCodeAt(text, index + 1)) ||
          isWordBound(charCodeAt(text, index + 1)))
      ) {
        index++;
      }
    }
  }

  return {
    minutes: Math.ceil(Number((words / wordsPerMinute).toFixed(2))),
    words,
  };
}

function charCodeAt(text: string, index: number): number {
  return index === text.length ? 0x0a : text.charCodeAt(index);
}

function isWordBound(charCode: number): boolean {
  return (
    charCode === 0x20 ||
    charCode === 0x0a ||
    charCode === 0x0d ||
    charCode === 0x09
  );
}

function isCjk(charCode: number): boolean {
  return (
    (charCode >= 0x3040 && charCode <= 0x309f) ||
    (charCode >= 0x4e00 && charCode <= 0x9fff) ||
    (charCode >= 0xac00 && charCode <= 0xd7a3)
  );
}

function isPunctuation(charCode: number): boolean {
  return (
    (charCode >= 0x21 && charCode <= 0x2f) ||
    (charCode >= 0x3a && charCode <= 0x40) ||
    (charCode >= 0x5b && charCode <= 0x60) ||
    (charCode >= 0x7b && charCode <= 0x7e) ||
    (charCode >= 0x3000 && charCode <= 0x303f) ||
    (charCode >= 0xff00 && charCode <= 0xffef)
  );
}
