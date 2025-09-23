import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        googleId?: string;
        firstName?: string;
        lastName?: string;
    }
    interface Session {
        user?: User;
    }
}