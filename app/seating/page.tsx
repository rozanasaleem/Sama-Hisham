import type { Metadata } from "next";
import { SeatingFinder } from "./SeatingFinder";

export const metadata: Metadata = {
  title: "Find Your Table | Sama & Hisham",
  description: "Search your name to find your wedding table number.",
};

export default function SeatingPage() {
  return <SeatingFinder />;
}
