/**
 * The test's image set and the balanced sequence builder, ported from the app
 * engine (utils/ImageService.js, utils/ImageSequenceService.js).
 *
 * Image ids encode their class: first letter t = animal (target), d = non-animal
 * (distractor); second letter is difficulty, h = super easy, b = easy,
 * m = medium, f = difficult. The files live at `${assetBaseUrl}/test/<id>.jpg`
 * and `${assetBaseUrl}/masks/<id>.png`.
 */

const MISSING = new Set(["df19", "df21", "df25", "df26", "dm27"]);

export const ALL_IMAGE_IDS: readonly string[] = ["db", "df", "dh", "dm", "tb", "tf", "th", "tm"]
  .flatMap((prefix) => Array.from({ length: 30 }, (_, i) => `${prefix}${i + 1}`))
  .filter((id) => !MISSING.has(id));

export const MASK_IDS = ["00", "01", "10", "11", "20", "21", "30", "31"] as const;

export const imageUrl = (assetBaseUrl: string, id: string) => `${assetBaseUrl}/test/${id}.jpg`;
export const maskUrl = (assetBaseUrl: string, id: string) => `${assetBaseUrl}/masks/${id}.png`;

function shuffle<T>(array: readonly T[]): T[] {
  const out = [...array];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** A fresh random order of the 8 masks, drawn for every step. */
export const maskSequence = (): string[] => shuffle(MASK_IDS);

function combine(count: number, animal: string[], nonAnimal: string[], preferAnimal: boolean): string[] {
  if (count === animal.length + nonAnimal.length) return shuffle([...animal, ...nonAnimal]);

  const a = shuffle(animal);
  const n = shuffle(nonAnimal);
  const half = Math.floor(count / 2);
  let combined = [...a.slice(0, half), ...n.slice(0, half)];
  const restA = a.slice(half);
  const restN = n.slice(half);

  if (count % 2 !== 0) {
    const extra = preferAnimal ? restA.pop() : restN.pop();
    if (extra !== undefined) combined.push(extra);
  }
  if (combined.length < count) {
    combined = combined.concat(shuffle([...restA, ...restN]).slice(0, count - combined.length));
  }
  return shuffle(combined);
}

const LEVELS = ["h", "b", "m", "f"] as const;

/**
 * The app's "random" display order: a pattern of roughly 25% per difficulty,
 * shuffled, then filled with animal and non-animal images balanced per level.
 */
export function buildImageSequence(count: number, images: readonly string[] = ALL_IMAGE_IDS): string[] {
  const quarter = Math.floor(count * 0.25);
  const pattern = shuffle([
    ...Array<string>(quarter).fill("h"),
    ...Array<string>(quarter).fill("b"),
    ...Array<string>(quarter).fill("m"),
    ...Array<string>(count - quarter * 3).fill("f"),
  ]);

  const pools: Record<string, string[]> = {};
  let preferAnimal = false;
  for (const level of LEVELS) {
    const expected = pattern.filter((p) => p === level).length;
    const animal = images.filter((id) => id[0] === "t" && id[1] === level);
    const nonAnimal = images.filter((id) => id[0] === "d" && id[1] === level);
    pools[level] = combine(expected, animal, nonAnimal, preferAnimal);
    if (expected % 2 !== 0) preferAnimal = !preferAnimal;
  }

  const sequence: string[] = [];
  for (const level of pattern) {
    const next = pools[level].pop();
    if (next !== undefined) sequence.push(next);
  }
  return sequence;
}

/**
 * Downloads and decodes the given images before the test starts, so no step
 * waits on the network. Resolves with the decoded elements; hold on to them
 * for the life of the test so the browser keeps them decoded.
 */
export async function preloadImages(urls: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(
    urls.map(async (url) => {
      const img = new Image();
      img.src = url;
      try {
        await img.decode();
      } catch {
        throw new Error(`Could not load test image ${url}`);
      }
      return img;
    }),
  );
}
