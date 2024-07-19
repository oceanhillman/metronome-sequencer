import Image from "next/image";
import Editor from "@/components/Editor";
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function Home() {


  
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Header />
      <Editor />
      <Footer />
    </main>
  );
}
