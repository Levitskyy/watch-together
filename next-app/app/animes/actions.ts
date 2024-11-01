'use server'

import { addFiltersToQuery, AnimePreviewParams, FilterParams } from "./utils"

export async function getFilteredAnimes(params: Partial<FilterParams> = {}): Promise<AnimePreviewParams[]> {
    // преобразую страницу в параметры для апи вызова
    const limit = 20;
    const page = params.page ? params.page : 0;
    const skip = page * limit;

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