import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Song from './Song';

export default function SongPage() {

  return (
    <main className="flex min-h-screen flex-col items-center">
      <Header />
      <Song />
      <Footer />
    </main>
  );
}
