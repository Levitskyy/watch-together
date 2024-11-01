'use client'

import { AnimePreviewParams, FilterParams } from "./utils";
import { useState } from "react";
import AnimePreview from "./animePreview";

type AnimeListProps = {
    initAnimes: AnimePreviewParams[];
    filterParams: FilterParams;
};

// REMOVE PARTIAL ANIMEPROPS !!!!!!!!!!!!!!!!!!!!!

export default function AnimeList({ initAnimes, filterParams }: Partial<AnimeListProps>) {
    const [animes, setAnimes] = useState(initAnimes);

    return (
        <div className="grid grid-cols-5 gap-4">
            {animes?.map((anime, index) => (
                <AnimePreview
                    key={index}
                    id={anime.id}
                    title={anime.title}
                    shikimori_rating={anime.shikimori_rating}
                    poster_url={anime.poster_url}
                    anime_kind={anime.anime_kind}
                />
            ))}
        </div>
    );
};