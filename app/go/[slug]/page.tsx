import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLandingConfig, landingSlugs } from "@/app/lib/landings";
import QuizEngine from "@/app/components/go/QuizEngine";
import ListicleRenderer from "@/app/components/go/listicle/ListicleRenderer";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";

/**
 * Ad landing pages. Each slug maps to a config in app/lib/landings/.
 * Deliberately no Navigation/Footer: the experience owns the viewport.
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
    return (
      // Bone behind the nav spacer so no white sliver shows above the hero
      <div style={{ background: "var(--color-bone, #F9F9F9)" }}>
        <Navigation />
        <ListicleRenderer config={config} />
        <Footer />
      </div>
    );
  }
  return <QuizEngine config={config} />;
}
