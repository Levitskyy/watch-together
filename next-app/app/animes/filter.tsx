'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterParams } from "./utils";

type FilterProps = {
    initFilterParams: Partial<FilterParams>;
};

export default function Filter({ initFilterParams }: FilterProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    
    const handleAsc = () => {
        const params = new URLSearchParams(searchParams);
            params.set('asc', 'true');
        replace(`${pathname}?${params.toString()}`);
    };

    const handleDesc = () => {
        const params = new URLSearchParams(searchParams);
            params.delete('asc');
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="bg-neutral-800 h-max">
            <h1>Filter</h1>
            <button onClick={handleAsc}>
                ASC
            </button>
            <button onClick={handleDesc}>
                DESC
            </button>
        </div>
    );
}