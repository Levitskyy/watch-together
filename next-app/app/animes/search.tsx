'use client';
 
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { revalidatePath } from 'next/cache';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebounce, useDebouncedCallback } from 'use-debounce';
import { useState } from 'react';
 
export default function Search({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    
    const handleSearch = useDebouncedCallback((term) => {
        console.log(term);
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('title', term);
        } else {
            params.delete('title');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);
 
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border bg-neutral-800 border-neutral-400 py-[9px] pl-10 text-sm outline-2 placeholder:text-neutral-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('title')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-400 peer-focus:text-neutral-400" />
    </div>
  );
}