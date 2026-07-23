import { useEffect } from "react";

/**
 * Pin the page to a hash target on arrival (e.g. #product from the brain-age
 * quiz). The page is media-heavy, so elements above the target shift as images
 * load and a one-shot native scroll misses; re-pin to the target a few times
 * until layout settles, and bail the moment the user scrolls themselves.
 *
 * Shared by both listicle renderers (ListicleRenderer, SimpleListicleRenderer).
 */
export function useHashScroll() {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    let done = false;
    const scrollToTarget = () => {
      if (done) return;
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    };
    const stop = () => {
      done = true;
    };
    window.addEventListener("wheel", stop, { passive: true, once: true });
    window.addEventListener("touchmove", stop, { passive: true, once: true });
    const timers = [0, 150, 400, 800, 1400].map((d) =>
      window.setTimeout(scrollToTarget, d),
    );
    window.addEventListener("load", scrollToTarget);
    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener("load", scrollToTarget);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
    };
  }, []);
}
