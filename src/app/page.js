import Editor from "@/components/Editor";
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center">
            <Header />
            <Editor />
            <Footer />
        </main>
    );
}
