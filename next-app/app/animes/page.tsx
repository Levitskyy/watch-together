import { getFilteredAnimes } from "./actions";
import AnimeList from "./animeList";

export default async function Page() {
    let initAnimes = await getFilteredAnimes();
    return (
        <div className="bg-neutral-900 w-full h-screen flex justify-center pt-16">
            <div className="bg-neutral-800 rounded w-11/12 h-max flex justify-center">
                <AnimeList initAnimes={initAnimes} />
            </div>
        </div>
    );
};