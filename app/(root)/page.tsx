import StartupCard from "@/components/StartupCard";
import SearchForm from "../../components/SearchForm";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { Author, Startup } from "@/sanity/types";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";

export type StartupCardType = Omit<Startup, "author"> & { author?: Author };

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<{ query?: string }>;
}) {
	const query = (await searchParams).query;

	// const posts = await client.fetch(STARTUPS_QUERY);

	// getting posts in real time without even refreshing the page
	const {data:posts} = await sanityFetch({query : STARTUPS_QUERY});

	return (
		<>
			<section className="pink_container">
				<h1 className="heading">
					Pitch Your Startup, <br />
					Connect With Entrepreneurs
				</h1>
				<p className="sub-heading !max-w-3xl">
					Submti Ideas, Vote on Pitches, and Get Notices in Virtual
					Competitions
				</p>
				<SearchForm query={query} />
			</section>

			<section className="section_container">
				<p className="text-30-semibold">
					{query ? `Search results for "${query}"` : "All Startups"}
				</p>

				<ul className="mt-7 card_grid">
					{posts?.length > 0 ? (
						posts.map((post: StartupCardType, index: number) => (
							<StartupCard key={post?._id} post={post} />
						))
					) : (
						<p className="no-results">No Startups Found</p>
					)}
				</ul>
			</section>

			<SanityLive/>
		</>
	);
}
