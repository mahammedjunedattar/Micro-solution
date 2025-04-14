import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
const jwtSecret = 'Abbaammi@123';

const uri = 'mongodb+srv://junedattar455:Abbaammi123@cluster0.ladkaob.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const clientPromise = new MongoClient(uri).connect();

export const authOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 1 week
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
          
          const user = await db.collection('reminder-user').findOne({ 
            email: credentials.email 
          });

          if (!user) {
            console.log('User not found:', credentials.email);
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

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
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user = {
          id: token.id,
          email: token.email,
          role: token.role
        };
      }
      return session;
    },
  },
  secret: jwtSecret|| 'your-fallback-secret',
  pages: {
    signIn: '/login',
    error: '/login/error'
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
