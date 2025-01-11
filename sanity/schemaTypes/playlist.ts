import { defineField, defineType } from "sanity";

// each playlist will refer to multiple startups and will have a title of its own like "Top 10 Startups in 2021", "Startups of the day" etc.
export const playlist = defineType({
    name: 'playlist',
    title: 'Playlists',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            type: 'string'
        }),
        defineField({
            name: 'slug',
            type: 'slug',
            options: {

                source: 'title'
            }
        }),
        defineField({
            name: 'select',
            type: 'array',
            of: [{

                type: 'reference',
                to: [{ type: "startup" }]
            }]
        }),

    ],
})