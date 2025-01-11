import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { client } from "./sanity/lib/client"
import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/queries"
import { writeClient } from "./sanity/lib/write-client"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ user: { name, email, image }, profile }) {
      const exisitingUser = await client.withConfig({ useCdn: false }).fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id: profile?.id })

      if (!exisitingUser) {
        await writeClient.create({
          _type: 'author',
          id: profile?.id,
          name,
          username: profile?.login,
          email,
          image,
          bio: profile?.bio || ''
        })
      }

      return true
    },

    // allows to connect a specific github user with a sanity author who could then create posts/pitches/startup
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const user = await client.withConfig({ useCdn: false }).fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id: profile.id })

        token.id = user?._id
      }

      return token
    },

    async session({ session, token }) {
      Object.assign(session, { id: token.id })
      return session
    }

  }
})