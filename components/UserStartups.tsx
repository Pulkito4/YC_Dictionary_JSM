import { client } from "@/sanity/lib/client";
import { STARTUP_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";
import StartupCard, { StartupCardType } from "./StartupCard";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

const UserStartups = async ({ id }: { id: string }) => {
	const startups = await client.fetch(STARTUP_BY_AUTHOR_QUERY, { id });
	return (
		<>
			{startups.length > 0 ? (
				startups.map((startup: StartupCardType) => (
					<StartupCard key={startup._id} post={startup} />
				))
			) : (
				<p className="no-result">No startups found</p>
			)}
		</>
	);
};

export const StartupCardSkeleton = () => (
	<>
		{[0, 1, 2, 3, 4, 5].map((index) => (
			<li key={cn("skeleton", index)}>
				<Skeleton className="startup-card_skeleton" />
			</li>
		))}
	</>
);

export default UserStartups;
