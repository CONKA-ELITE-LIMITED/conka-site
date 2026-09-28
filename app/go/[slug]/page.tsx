import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLandingConfig, landingSlugs } from "@/app/lib/landings";
import QuizEngine from "@/app/components/go/QuizEngine";
import ListicleRenderer from "@/app/components/go/listicle/ListicleRenderer";
import SimpleListicleRenderer from "@/app/components/go/listicle/SimpleListicleRenderer";
import OfferRenderer from "@/app/components/go/offer/OfferRenderer";
import Footer from "@/app/components/footer";

/**
 * Ad landing pages. Each slug maps to a config in app/lib/landings/.
 * No site navigation: an ad landing has one exit, its CTA, so the header menu
 * would only leak clicks. Listicles keep the footer for the legal links.
 * Not indexed and not linked from the site; these are ad destinations.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return landingSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = getLandingConfig(slug);
  if (!config) return {};
  return {
    title: `${config.title} | CONKA`,
    robots: { index: false, follow: false },
  };
}

export default async function GoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = getLandingConfig(slug);
  if (!config) notFound();
  if (config.format === "listicle") {
    // The config picks its template: "mm" is the editorial layout, "im8" the
    // denser one. Narrowing here hands each renderer its exact config type.
    const content =
      config.template === "mm" ? (
        <SimpleListicleRenderer config={config} />
      ) : (
        <ListicleRenderer config={config} />
      );
    return (
      <div style={{ background: "var(--color-bone, #F9F9F9)" }}>
        {content}
        <Footer />
      </div>
    );
  }
  if (config.format === "offer") {
    // Single-offer page. The renderer owns nav and footer, inside the PDP's
    // brand-clinical root so its reused PDP parts render as they do there.
    return <OfferRenderer config={config} />;
  }
  return <QuizEngine config={config} />;
}
