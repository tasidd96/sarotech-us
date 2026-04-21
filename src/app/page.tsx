import type { Metadata } from "next";
import PromoBanner from "@/components/layout/PromoBanner";
import HeroBanner from "@/components/home/HeroBanner";
import PopularProducts from "@/components/home/PopularProducts";
import ShopByCategory from "@/components/home/ShopByCategory";
import ProjectGallery from "@/components/home/ProjectGallery";
import FeaturedProject from "@/components/home/FeaturedProject";
import LocationsSection from "@/components/home/LocationsSection";

export const metadata: Metadata = {
  title: "Home | SARO TECH USA",
  description:
    "Next-generation WPC architectural finishes — siding, decking, wall panels, and synthetic marble. Now open in Houston, TX and shipping nationwide.",
};

export default function Home() {
  return (
    <>
      <PromoBanner />
      <HeroBanner />
      <PopularProducts />
      <ShopByCategory />
      <FeaturedProject />
      <ProjectGallery />
      <LocationsSection />
    </>
  );
}
