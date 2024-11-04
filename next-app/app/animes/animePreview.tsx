import { AnimePreviewParams, replaceAnimeType } from "./utils";
import Link from "next/link";
import logo from "@/public/logo.svg"

export default function AnimePreview({id, title, shikimori_rating, anime_kind, poster_url}: AnimePreviewParams) {
    if (!shikimori_rating) {
        shikimori_rating = 0;
    }

    const ratingBackgroundColor = shikimori_rating >= 8 ? 'bg-green-500' : 'bg-neutral-600';
    const ratingTextColor = shikimori_rating >= 8 ? 'text-white' : 'text-white';
    const formattedAnimeKind = replaceAnimeType(anime_kind || '');
    const roundedRating = shikimori_rating?.toFixed(1);

    return (
        <div className="flex flex-col rounded overflow-hidden m-1 relative text-white w-40 p-2">
            <Link href={`/anime/${id}`}>
                <div className="relative">
                    <img className="w-full h-52 rounded-lg" src={poster_url || logo} alt={title} />
                    <div className={`absolute top-1 left-1 ${ratingBackgroundColor} ${ratingTextColor} px-1 py-0.5 rounded text-xs font-bold`}>
                        {roundedRating} ⭐
                    </div>
                </div>
                <div className="px-2 py-1 flex-grow text-left">
                    <div className="text-sm text-gray-400 mb-1">{title}</div>
                    <div className="text-xs text-gray-400">{formattedAnimeKind}</div>
                </div>
            </Link>
        </div>
    );
};



  