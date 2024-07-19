import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from "@/lib/mongodb"
import { encode, decode } from 'next-auth/jwt';

export const options = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email:",
                    type: "text",
                    placeholder: "enter email",
                },
                password: {
                    label: "Password:",
                    type: "password",
                    placeholder: "enter password",
                }
            },
            authorize: async (credentials) => {
                const client = await clientPromise;
                const users = client.db('userDatabase').collection('users');
                const user = await users.findOne({ email: credentials.email });
        
                if (user && user.password === credentials.password) {
                  return { email: user.email };
                } else {
                  return null;
                }
            },
        })
    ],

    pages: {
        signIn: '/auth/signin',
    },

    adapter: MongoDBAdapter(clientPromise),

    secret: process.env.NEXTAUTH_SECRET,

    session: {
        strategy: "jwt",
    },
    
    jwt: { encode, decode },

    callbacks: {
        async session({session, token}) {
            session.user.email = token.email;
            return session;
        }
    }
}