import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null // Return null instead of throwing error
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })
          console.log(user)

          if (!user || !user.password) {
            return null
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name
          }
        } catch (error) {
          console.error('Authorization error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login',
    error: 
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      session.user.email = token.email
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development' // Enable debug in development
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
