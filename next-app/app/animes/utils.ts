export type AnimePreviewParams = {
    id: number;
    title: string;
    anime_kind: string | null;
    poster_url: string | null;
    shikimori_rating: number | null;
};

export type FilterParams = {
    page: number | null;
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

export const addFiltersToQuery = (params: Partial<FilterParams>, url: string): string => {
    const filteredUrl = new URL(url);
    const limit = 20;

    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            if (key !== 'page') {
                const value = params[key as keyof FilterParams];
                if (value !== null && value !== undefined) {
                    if (Array.isArray(value)) {
                        value.forEach(item => {
                            filteredUrl.searchParams.append(key, item.toString());
                        });
                    } else {
                        filteredUrl.searchParams.set(key, value.toString());
                    }
                }
            } else {
                const value = params[key as keyof FilterParams];
                if (value !== null && value !== undefined) {
                    const skip = parseInt(value as string, 10) * limit;
                    filteredUrl.searchParams.set('limit', limit.toString());
                    filteredUrl.searchParams.set('skip', skip.toString());
                }
            }
        }
    }


    return filteredUrl.href;
};

export const queryToFilterParams = (queryParams: {
    [key: string]: string | string[] | undefined
}): Partial<FilterParams> => {
    const filterParams: Partial<FilterParams> = {};

    for (const key in queryParams) {
        if (queryParams.hasOwnProperty(key)) {
            const value = queryParams[key];
            if (value !== undefined) {
                switch (key) {
                    case 'page':
                    case 'min_year':
                    case 'max_year':
                    case 'min_rating':
                    case 'minimal_age':
                        filterParams[key] = parseInt(value as string, 10);
                        break;
                    case 'genres':
                    case 'anime_kind':
                        filterParams[key] = Array.isArray(value) ? value : [value];
                        break;
                    case 'genres_and':
                    case 'asc':
                        filterParams[key] = value === 'true';
                        break;
                    case 'title':
                    case 'order_by':
                        filterParams[key] = value as string;
                        break;
                    default:
                        break;
                }
            }
        }
    }

    return filterParams;
};
