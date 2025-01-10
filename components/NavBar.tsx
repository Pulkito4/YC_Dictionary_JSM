import { auth, signIn, signOut } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// we can make this async as this is a server rendered component
const NavBar = async () => {
	const session = await auth();
	return (
		<div className="px-5 bg-white shadow-sm py-3 font work-sans">
			<nav className="flex justify-between items-center">
				<Link href={"/"}>
					<Image src="/logo.png" alt="logo" width={144} height={30} />
				</Link>
				<div className=" flex items-center gap-5 text-black">
					{session && session?.user ? (
						<>
							<Link href="/startup/create">
								<span>Create</span>
							</Link>
							<form
								action={async () => {
									"use server";
									await signOut({ redirect: true, redirectTo: "/" });
								}}>
								<button type="submit">Logout</button>
							</form>

							<Link href={`/user/${session?.user?.id}`}>
								{" "}
								<span>{session?.user?.name}</span>
							</Link>
						</>
					) : (
						// creating the signIn as a server action
						// using react 19 form actions
						// using react 19 form actions we can pass a server action to a form to automatically submit the form to the server
						<form
							//async server action trying to sign us in
							action={async () => {
								"use server";
								await signIn("github");
							}}>
							<button type="submit">Login</button>
						</form>
					)}
				</div>
			</nav>
		</div>
	);
};

export default NavBar;
