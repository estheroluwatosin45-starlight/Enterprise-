import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen pt-28">
      <Navbar />
      <main className="flex-grow flex flex-col relative z-0">
        {children}
      </main>
      <Footer />
    </div>
  );
}
