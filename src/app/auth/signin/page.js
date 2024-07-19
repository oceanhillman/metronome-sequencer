

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SignInForm from "@/components/SignInForm";

export default async function Login() {


  return (
    <main className="flex min-h-screen flex-col items-center">
      <Header />
        <SignInForm

        />
      <Footer />
    </main>
  );
}