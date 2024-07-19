import { UserProvider } from '@auth0/nextjs-auth0/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";



export const metadata = {
  title: "Metronome Sequencer",
  description: "Practice songs with changes",
};

export default function RootLayout({ children }) {
  return (
    <UserProvider>
      <html lang="en">
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="bg-black">{children}</body>
      </html>
    </UserProvider>
  );
}
