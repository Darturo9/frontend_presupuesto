import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        googleId?: string;
        firstName?: string;
        lastName?: string;
        avatar?: string;
        backendToken?: string;
    }

    interface Session {
        user?: User;
        backendToken?: string;
    }
}