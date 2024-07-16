import Metronome from "../components/Metronome"
import Playlist from "@/components/Playlist";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Playlist />
    </main>
  );
}
