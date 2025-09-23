import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

function splitName(fullName?: string) {
    if (!fullName) return { firstName: undefined, lastName: undefined };
    const parts = fullName.split(' ');
    return {
        firstName: parts[0],
        lastName: parts.slice(1).join(' ') || undefined,
    };
}

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
        async jwt({ token, profile, account }) {
            // Guarda el googleId (sub) y nombre/apellido en el token
            if (profile) {
                token.googleId = profile.sub;
                const { firstName, lastName } = splitName(profile.name);
                token.firstName = firstName;
                token.lastName = lastName;
            }
            return token;
        },
        async session({ session, token }) {
            // Pasa googleId, firstName y lastName a la sesión del usuario
            if (session.user) {
                if (token.googleId) session.user.googleId = token.googleId as string;
                if (token.firstName) session.user.firstName = token.firstName as string;
                if (token.lastName) session.user.lastName = token.lastName as string;
            }
            return session;
        },
    },
});

export { handler as GET, handler as POST };