import { Inter } from "next/font/google";
import Mapbox from "./mapbox";
// import data from "./data/data.csv"

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="flex min-h-screen items-center p-6">
      <Mapbox />
    </main>
  );
}
