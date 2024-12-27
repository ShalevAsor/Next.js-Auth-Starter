// import NextAuth, { AuthOptions } from "next-auth";
// import GithubProvider from "next-auth/providers/github";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import prisma from "@/lib/db";
// import bcrypt from "bcryptjs";

// export const authOptions: AuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Invalid credentials");
//         }

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//         });

//         if (!user || !user?.password) {
//           throw new Error("Invalid credentials");
//         }

//         const isCorrectPassword = await bcrypt.compare(
//           credentials.password,
//           user.password
//         );

//         if (!isCorrectPassword) {
//           throw new Error("Invalid credentials");
//         }

//         return user;
//       },
//     }),
//     GithubProvider({
//       clientId: process.env.GITHUB_ID as string,
//       clientSecret: process.env.GITHUB_SECRET as string,
//       profile(profile) {
//         return {
//           id: profile.id.toString(),
//           name: profile.name || profile.login,
//           email: profile.email,
//           image: profile.avatar_url,
//           username: profile.login,
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     async session({ session, token }) {
//       if (session?.user) {
//         const dbUser = await prisma.user.findUnique({
//           where: { email: session.user.email! },
//           select: { username: true },
//         });
//         session.user.username = dbUser?.username;
//       }
//       return session;
//     },
//     async signIn({ user, account }) {
//       if (account?.provider === "github") {
//         try {
//           const existingUser = await prisma.user.findUnique({
//             where: { email: user.email! },
//           });

//           if (!existingUser) {
//             const username = (user as any).username || `user-${Date.now()}`;
//             await prisma.user.create({
//               data: {
//                 email: user.email!,
//                 name: user.name,
//                 username: username,
//                 image: user.image,
//               },
//             });
//           }
//           return true;
//         } catch (error) {
//           console.error("Error during sign in:", error);
//           return false;
//         }
//       }
//       return true;
//     },
//     async redirect({ url, baseUrl }) {
//       // Allows relative callback URLs
//       if (url.startsWith("/")) return `${baseUrl}${url}`;
//       // Allows callback URLs on the same origin
//       else if (new URL(url).origin === baseUrl) return url;
//       return baseUrl;
//     },
//   },
//   pages: {
//     signIn: "/auth/signin",
//     error: "/auth/signin",
//   },
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   debug: process.env.NODE_ENV === "development",
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
