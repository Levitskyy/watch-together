import { getFilteredAnimes } from "./actions";
import AnimeList from "./animeList";
import { Suspense } from "react";
import { FilterParams, queryToFilterParams } from "./utils";
import { SearchParams } from "next/dist/server/request/search-params";

export default async function Page({
    searchParams,
  }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }) {
    const filterParamsQuery = await searchParams;
    const filterParams: Partial<FilterParams> = queryToFilterParams(filterParamsQuery);

    let initAnimes = await getFilteredAnimes(filterParams);
    return (
        <div className="bg-neutral-900 w-full h-max flex justify-center pt-16">
            <div className="bg-neutral-800 rounded w-11/12 h-max flex justify-center">
                <AnimeList initAnimes={initAnimes} filterParams={filterParams} />
            </div>
        </div>
    );
};