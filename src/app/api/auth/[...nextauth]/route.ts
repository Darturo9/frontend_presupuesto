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
            console.log('🔐 [SIGNIN] Iniciando signIn callback');
            console.log('🔐 [SIGNIN] Provider:', account?.provider);
            console.log('🔐 [SIGNIN] User:', JSON.stringify(user, null, 2));
            console.log('🔐 [SIGNIN] Profile:', JSON.stringify(profile, null, 2));

            if (account?.provider === 'google' && profile) {
                console.log('✅ [SIGNIN] Es login con Google, preparando llamada al backend');

                const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
                const payload = {
                    email: profile.email,
                    googleId: profile.sub,
                    firstName: (profile as any).given_name,
                    lastName: (profile as any).family_name,
                    avatar: (profile as any).picture
                };

                console.log('🌐 [SIGNIN] Backend URL:', backendUrl);
                console.log('📦 [SIGNIN] Payload:', JSON.stringify(payload, null, 2));

                try {
                    // Llamar a tu backend para obtener JWT
                    console.log('⏳ [SIGNIN] Enviando petición al backend...');
                    const response = await axios.post(backendUrl, payload);

                    console.log('✅ [SIGNIN] Respuesta del backend recibida');
                    console.log('📥 [SIGNIN] Status:', response.status);
                    console.log('📥 [SIGNIN] Data:', JSON.stringify(response.data, null, 2));

                    // Guardamos el token en el user object
                    user.backendToken = response.data.access_token;
                    console.log('✅ [SIGNIN] Token guardado exitosamente');
                    return true;
                } catch (error) {
                    console.error('❌ [SIGNIN] Error al conectar con backend:', error);
                    if (axios.isAxiosError(error)) {
                        console.error('❌ [SIGNIN] Status code:', error.response?.status);
                        console.error('❌ [SIGNIN] Response data:', error.response?.data);
                        console.error('❌ [SIGNIN] Request config:', error.config);
                    }
                    return false;
                }
            }
            console.log('⚠️ [SIGNIN] No es Google login, permitiendo acceso');
            return true;
        },

        async jwt({ token, user, profile }) {
            console.log('🎫 [JWT] Iniciando jwt callback');
            console.log('🎫 [JWT] Token actual:', JSON.stringify(token, null, 2));
            console.log('🎫 [JWT] User:', JSON.stringify(user, null, 2));

            // Si tenemos token del backend, lo guardamos
            if (user?.backendToken) {
                console.log('✅ [JWT] Guardando backendToken en token');
                token.backendToken = user.backendToken;
            }

            // Guardamos también los datos del perfil para la sesión
            if (profile) {
                console.log('✅ [JWT] Guardando datos del perfil en token');
                token.googleId = profile.sub;
                token.firstName = (profile as any).given_name;
                token.lastName = (profile as any).family_name;
                token.avatar = (profile as any).picture;
            }

            console.log('🎫 [JWT] Token final:', JSON.stringify(token, null, 2));
            return token;
        },

        async session({ session, token }) {
            console.log('👤 [SESSION] Iniciando session callback');
            console.log('👤 [SESSION] Session inicial:', JSON.stringify(session, null, 2));
            console.log('👤 [SESSION] Token recibido:', JSON.stringify(token, null, 2));

            // Pasamos toda la información a la sesión
            if (session.user) {
                console.log('✅ [SESSION] Pasando datos del token a la sesión');
                if (token.backendToken) session.backendToken = token.backendToken as string;
                if (token.googleId) session.user.googleId = token.googleId as string;
                if (token.firstName) session.user.firstName = token.firstName as string;
                if (token.lastName) session.user.lastName = token.lastName as string;
                if (token.avatar) session.user.avatar = token.avatar as string;
            }

            console.log('👤 [SESSION] Session final:', JSON.stringify(session, null, 2));
            return session;
        },
    },
});

export { handler as GET, handler as POST };