
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import SongLibrary from "@/components/SongLibrary"

// app/profile/page.js
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default withPageAuthRequired(function MySongs() {

    return (
        <main className="flex min-h-screen flex-col items-center">
            <Header />
            <SongLibrary />
            <Footer />
        </main>
    );

}, { returnTo: '/my-songs' })