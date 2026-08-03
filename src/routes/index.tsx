import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Hero } from "@/components/home/Hero";
import { ServerStatusBar } from "@/components/home/ServerStatusBar";
import {
  AboutSection,
  QuickInfoSection,
  RatesSection,
  DifferentialsSection,
  RealmMapStrip,
} from "@/components/home/InfoSections";
import {
  RankingPreviewSection,
  EventsSection,
  CastleSiegePreview,
  GuildCallSection,
} from "@/components/home/CompeteSections";
import {
  VipSection,
  NewsSection,
  DownloadsSection,
  CommunitySection,
  FaqSection,
  FinalCta,
} from "@/components/home/EngageSections";

const title = "MU Kame — Season 6.15 Medium";
const description =
  "Reviva a era de ouro do MU Online no MU Kame. Season 6.15, progressão Medium, eventos clássicos, rankings, guilds e Castle Siege.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://novo.mukame.online/" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "https://novo.mukame.online/" }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout>
      <Hero />
      <ServerStatusBar />
      <AboutSection />
      <QuickInfoSection />
      <RatesSection />
      <RealmMapStrip />
      <DifferentialsSection />
      <RankingPreviewSection />
      <EventsSection />
      <CastleSiegePreview />
      <GuildCallSection />
      <VipSection />
      <NewsSection />
      <DownloadsSection />
      <CommunitySection />
      <FaqSection />
      <FinalCta />
    </SiteLayout>
  );
}
