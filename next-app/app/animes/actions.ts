'use server'

import { AnimePreviewParams, FilterParams } from "./utils"

export async function getFilteredAnimes(params: Partial<FilterParams> = {}): Promise<AnimePreviewParams[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HTTP_BACK}/animes/filter?limit=20`, {
        method: 'GET'
    });

    const data = await response.json();

    // Преобразуем данные в массив объектов типа AnimePreviewParams
    const animes: AnimePreviewParams[] = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        anime_kind: item.anime_kind || null,
        poster_url: item.poster_url || null,
        shikimori_rating: item.shikimori_rating || null,
    }));

    return animes;
}