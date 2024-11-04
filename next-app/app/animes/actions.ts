'use server'

import { revalidatePath } from "next/cache";
import { addFiltersToQuery, AnimePreviewParams, FilterParams } from "./utils"

export async function getFilteredAnimes(params: Partial<FilterParams> = {}): Promise<AnimePreviewParams[]> {
    // преобразую страницу в параметры для апи вызова

    const filterEndpoint = `${process.env.NEXT_PUBLIC_HTTP_BACK}/animes/filter`;
    const urlHref = addFiltersToQuery(params, filterEndpoint);
   
    const response = await fetch(urlHref, {
        method: 'GET'
    });

    const data = await response.json();

    // преобразую данные в массив объектов типа AnimePreviewParams
    const animes: AnimePreviewParams[] = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        anime_kind: item.anime_kind || null,
        poster_url: item.poster_url || null,
        shikimori_rating: item.shikimori_rating || null,
    }));

    return animes;
}

export async function getFullPageFilteredAnimes(params: Partial<FilterParams> = {}): Promise<AnimePreviewParams[]> {
    const page = params.page ?? 0;
    let animes: AnimePreviewParams[] = [];

    for (let i = 0; i <= page; i++) {
        const new_params = { ...params, page: i }
        const new_page = await getFilteredAnimes(new_params);
        if (new_page.length === 0) {
            break;
        }
        animes = [...animes, ...new_page];
    }

    return animes;
}