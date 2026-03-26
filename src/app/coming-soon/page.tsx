import { ComingSoonClient } from "./coming-soon-client";

interface PageProps {
  searchParams: Promise<{
    actionKey?: string;
    title?: string;
    pillar?: "financial" | "career" | "health";
  }>;
}

export default async function ComingSoonPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return <ComingSoonClient params={params} />;
}
