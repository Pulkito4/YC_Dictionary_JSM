import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import {
	PLAYLIST_BY_SLUG_QUERY,
	STARTUP_BY_ID_QUERY,
} from "@/sanity/lib/queries";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import markdownit from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import StartupCard, { StartupCardType } from "@/components/StartupCard";

const md = markdownit();

export const experimental_ppr = true;

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const id = (await params).id;

	// Followiing is the case of SEQUENTIAL FETCHING of data
	// first we fetch the post details and then only after it is complete, we fetch the editor selected startups
	// this increases the time of loading the page as the time taken to fetch the editor selected startups is added to the time taken to fetch the post details
	// this is a great way to fetch data WHEN THE DATA IS RELATED TO EACH OTHER / DEPENDENT ON EACH OTHER

	/* const post = await client.fetch(STARTUP_BY_ID_QUERY, { id });
	const parsedContent = md.render(post?.pitch || "");
	const { select: editorPosts } = await client.fetch(PLAYLIST_BY_SLUG_QUERY, {
		slug: "editor-picks-new",
	}); */

	// PARALLEL FETCHING OF DATA
	// now we are fetching the post details and the editor selected startups parallely/concurrently making the two independent requests
	// now the total time is roughly equal to the duration of the longest request NOT the sum of the durations of the two requests => Faster load times
	const [post, { select: editorPosts }] = await Promise.all([
		client.fetch(STARTUP_BY_ID_QUERY, { id }),
		client.fetch(PLAYLIST_BY_SLUG_QUERY, {
			slug: "editor-picks-new",
		}),
	]);
	
	const parsedContent = md.render(post?.pitch || "");

	if (!post) {
		return notFound();
	}

	return (
		<>
			<section className="pink_container !min-h-[230px]">
				<p className="tag">{formatDate(post?._createdAt)}</p>

				<h1 className="heading">{post.title}</h1>
				<p className="sub-heading !max-w-5xl">{post.description}</p>
			</section>

			<section className="section_container">
				<img
					src={post.image}
					alt="thumbnail"
					className="w-full h-auto rounded-xl"
				/>

				<div className=" space-y-5 mt-10 max-w-4xl mx-auto">
					<div className="flex-between gap-5">
						<Link
							href={`/users/${post.author?._id}`}
							className="flex gap-2 items-center mb-3">
							<Image
								src={post.author.image}
								alt="avatar"
								width={64}
								height={64}
								className="rounded-full drop-shadow-lg aspect-square object-cover"
								priority
							/>

							<div>
								<p className="text-20-medium">
									{post.author.name}
								</p>
								<p className="text-16-medium  !text-black-300">
									@{post.author.username}
								</p>
							</div>
						</Link>

						<p className="category-tag">{post.category}</p>
					</div>

					<h3 className="text-30-bold">Pitch Details</h3>

					{parsedContent ? (
						<article
							className="prose max-w-4xl font-work-sans break-all"
							dangerouslySetInnerHTML={{ __html: parsedContent }}
						/>
					) : (
						<p className="no-result">No Details Provided</p>
					)}
				</div>

				<hr className="divider" />

				{/* EDITOR SELECTED STARTUPS */}
				{editorPosts?.length > 0 && (
					<div className="max-w-4xl mx-auto">
						<p className="text-30-semibold">Editor Picks</p>
						<ul className="mt-7 card_grid-sm">
							{editorPosts.map(
								(post: StartupCardType, index: number) => (
									<StartupCard key={index} post={post} />
								)
							)}
						</ul>
					</div>
				)}

				{/* Using PPR in the following part */}
				<Suspense fallback={<Skeleton className="view_skeleton" />}>
					{/* here we can add code here which will be rendered dynamically */}
					<View id={id} />
					{/*Passing the id of the post that we currently are on */}
					{/* This view element is to show the number of views that post has */}
					{/* other content is static but this views part is to be updated dynamically so we use ppr here */}
				</Suspense>
			</section>
		</>
	);
};

export default page;
