export type AnimePreviewParams = {
    id: number;
    title: string;
    anime_kind: string | null;
    poster_url: string | null;
    shikimori_rating: number | null;
};

export type FilterParams = {
    limit: number | null;
    skip: number | null;
    title: string | null;
    genres: string[] | null;
    min_year: number | null;
    max_year: number | null;
    min_rating: number | null;
    anime_kind: string[] | null;
    minimal_age: number | null;
    genres_and: boolean | null;
    order_by: string | null;
    asc: boolean | null;
};

export const replaceAnimeType = (animeType: string ): string => {
    const animeTypes: { [key: string]: string } = {
        tv: 'Телесериал',
        tv_special: 'TV-Спешл',
        movie: 'Фильм',
        ona: 'ONA',
        ova: 'OVA',
        special: 'Спешл',
    };

    return animeTypes[animeType] || animeType;
};