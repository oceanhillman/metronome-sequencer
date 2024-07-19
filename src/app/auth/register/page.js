
import { options } from "../../api/auth/[...nextauth]/options"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RegistrationForm from "@/components/RegistrationForm";

export default async function Register() {
  const session = await getServerSession(options);

  if (session) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
        <Header />
        <RegistrationForm

        />
        <Footer />
    </main>
  );
}