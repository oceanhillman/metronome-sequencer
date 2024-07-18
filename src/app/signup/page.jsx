'use client'

import { signIn } from "next-auth/react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default async function Signup() {
  return (
    <main className="flex min-h-screen flex-col items-center">
        <Header />
        <div>
            <h1>Sign In</h1>
            <button onClick={() => signIn("google")}>Sign in with Google</button>
        </div>
        <Footer />
    </main>
  );
}