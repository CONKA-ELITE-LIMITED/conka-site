/**
 * Videos ship as a trio of files sharing one basename (see
 * docs/development/VIDEO_OPTIMISATION.md):
 *
 *   Name.webm        VP9, primary source (smaller, Chrome/Firefox/Edge)
 *   Name.mp4         H.264, fallback (Safari/iOS)
 *   Name-poster.jpg  shown before playback / while loading
 *
 * Landing configs give the `.mp4` path, so the siblings are derived from it.
 * Anything that is not an `.mp4` is served as-is with no webm and no poster,
 * rather than guessing at siblings that may not exist.
 */
export function videoTrio(src: string) {
  if (!src.endsWith(".mp4")) return { webm: null, mp4: src, poster: undefined };
  const base = src.slice(0, -".mp4".length);
  return { webm: `${base}.webm`, mp4: src, poster: `${base}-poster.jpg` };
}
