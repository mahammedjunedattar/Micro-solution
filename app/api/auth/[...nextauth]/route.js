// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const uri = process.env.MONGODB_URI;
const clientPromise = new MongoClient(uri).connect();

export const authOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const client = await clientPromise;
          const db = client.db('reminder');
          
          // Case-sensitive email search
          const user = await db.collection('reminder-user').findOne({ 
            email: credentials.email 
          });

          console.log('Found user:', user); // Debug log

          if (!user) {
            console.log('No user found for email:', credentials.email);
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log('Password valid:', isValid); // Debug log

          if (!isValid) {
            console.log('Invalid password for:', credentials.email);
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name || '',
            role: user.role || 'user'
          };
          
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
        role: token.role
      };
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login/error'
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true // Enable debug logs
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
