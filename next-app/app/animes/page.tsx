import { getFilteredAnimes, getFullPageFilteredAnimes } from "./actions";
import AnimeList from "./animeList";
import { Suspense } from "react";
import { FilterParams, queryToFilterParams } from "./utils";
import Search from "./search";

export default async function Page({
    searchParams,
  }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }) {
    const filterParamsQuery = await searchParams;
    const filterParams = queryToFilterParams(filterParamsQuery);

    let initAnimes = await getFullPageFilteredAnimes(filterParams);
    return (
        <div className="bg-neutral-900 w-full h-max flex justify-center pt-16">
            <div className="bg-neutral-800 rounded w-5/12 h-max flex flex-col justify-center p-5">
                <h1 className="text-neutral-300 text-2xl pb-3">Каталог</h1>
                <AnimeList initAnimes={initAnimes} initFilterParams={filterParams} />
            </div>
        </div>
    );
};