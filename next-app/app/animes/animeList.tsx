'use client'

import { AnimePreviewParams, FilterParams } from "./utils";
import { useEffect, useState } from "react";
import AnimePreview from "./animePreview";
import { BarLoader } from "react-spinners";
import Search from "./search";
import { useSearchParams } from "next/navigation";
import useInfiniteScroll from "react-infinite-scroll-hook";
import useLoadItems from "./hooks";

type AnimeListProps = {
    initAnimes: AnimePreviewParams[];
    initFilterParams: Partial<FilterParams>;
};


export default function AnimeList({ initAnimes, initFilterParams }: AnimeListProps) {
    const [filterParams, setFilterParams] = useState(initFilterParams);

    const searchParams = useSearchParams();

    const { loading, items, hasNextPage, error, loadMore, setParams } = useLoadItems(filterParams);
    const [sentryRef] = useInfiniteScroll({
        loading,
        hasNextPage,
        onLoadMore: loadMore,
        disabled: !!error,
        rootMargin: '0px 0px 400px 0px',
    });

    useEffect(() => {
        setParams(initFilterParams);
    }, [initAnimes]);

    return (
        <div className="flex flex-col">
            <Search placeholder="Введите название аниме..."/>
            <div className="grid grid-cols-5 gap-4 justify-items-center">
                {initAnimes.map((anime, index) => (
                    <AnimePreview
                        key={index}
                        id={anime.id}
                        title={anime.title}
                        shikimori_rating={anime.shikimori_rating}
                        poster_url={anime.poster_url}
                        anime_kind={anime.anime_kind}
                    />
                ))}
                {items.map((anime, index) => (
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
            {/* ADD LOADING PLACEHOLDER AND MAKE IT OBSERVED BY INFINITE SCROLL */}
            <div className="flex items-center justify-center my-10">
                {(loading || hasNextPage) && (
                    <BarLoader 
                        ref={sentryRef}
                        color='white'
                        loading={true}    
                        height={10}
                        width={500}
                    />
                )}
            </div>
        </div>
    );
};