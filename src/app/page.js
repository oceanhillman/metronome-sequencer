import Image from "next/image";
import { options } from "./api/auth/[...nextauth]/options"
import { getServerSession } from "next-auth/next"
import Editor from "@/components/Editor";
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default async function Home() {
  const session = await getServerSession(options);
  
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Header 
        user={session?.user}
      />
      <Editor />
      <Footer />
    </main>
  );
}
