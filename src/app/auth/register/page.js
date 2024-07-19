
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RegistrationForm from "@/components/RegistrationForm";

export default async function Register() {


  return (
    <main className="flex min-h-screen flex-col items-center">
        <Header />
        <RegistrationForm

        />
        <Footer />
    </main>
  );
}