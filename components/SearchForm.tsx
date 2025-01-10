import { Search } from "lucide-react";
import SearchFormReset from "./SearchFormReset";
import Form from "next/form";

const SearchForm = ({query}:{query?:string}) => {

	return (
		<Form action="/" scroll={false} className="search-form">
			{/* On submission, the input value will be appended to 
          the URL, e.g. /search?query=abc */}
			<input
				name="query"
				defaultValue={query}
				className="search-input"
				placeholder="Search Startups"
			/>
			<div className=" flex gap-2">
				{query && <SearchFormReset />}

				<button type="submit" className="search-btn text-white">
					<Search className="size-5"/>
				</button>
			</div>
		</Form>
	);
};

export default SearchForm;