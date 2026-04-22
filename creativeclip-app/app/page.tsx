import { AuthHeader } from "@/components/layout/auth-header";
import { HomeHero } from "@/components/home/hero";

export default function Home() {
  return (
    <div className="min-h-screen">
      <AuthHeader />
      <HomeHero />
    </div>
  );
}
