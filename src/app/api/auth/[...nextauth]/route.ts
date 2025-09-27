import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from 'axios';

const handler = NextAuth({
    debug: true,
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === 'google' && profile) {
                try {
                    // Llamar a tu backend para obtener JWT
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
                        email: profile.email,
                        googleId: profile.sub,
                        firstName: (profile as any).given_name,
                        lastName: (profile as any).family_name,
                        avatar: (profile as any).picture
                    });

                    // Guardamos el token en el user object
                    user.backendToken = response.data.access_token;
                    return true;
                } catch (error) {
                    console.error('Error al conectar con backend:', error);
                    return false;
                }
            }
            return true;
        },

        async jwt({ token, user, profile }) {
            // Si tenemos token del backend, lo guardamos
            if (user?.backendToken) {
                token.backendToken = user.backendToken;
            }

            // Guardamos también los datos del perfil para la sesión
            if (profile) {
                token.googleId = profile.sub;
                token.firstName = (profile as any).given_name;
                token.lastName = (profile as any).family_name;
                token.avatar = (profile as any).picture;
            }

            return token;
        },

        async session({ session, token }) {
            // Pasamos toda la información a la sesión
            if (session.user) {
                if (token.backendToken) session.backendToken = token.backendToken as string;
                if (token.googleId) session.user.googleId = token.googleId as string;
                if (token.firstName) session.user.firstName = token.firstName as string;
                if (token.lastName) session.user.lastName = token.lastName as string;
                if (token.avatar) session.user.avatar = token.avatar as string;
            }
            return session;
        },
    },
});

export { handler as GET, handler as POST };