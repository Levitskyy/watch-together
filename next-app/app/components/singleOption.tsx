'use client'

import { useState } from "react";
import { capitalize } from "../utils/utils";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

type SingleOptionProps = {
    placeholder: string;
    values: string[];
    onValueChange(value: string): boolean; 
};

export default function SingleOption({ placeholder, values, onValueChange }: SingleOptionProps) {
    const [value, setValue] = useState(placeholder);
    const [active, setActive] = useState(false);

    const valueChange = (value: string) => {
        if (onValueChange(value)) {
            setValue(value);
        }
        setActive(false);
    };


    return (
        <>
            <div className='relative flex gap-2 justify-left w-full bg-neutral-700 py-1 pl-3 rounded transition duration-300'>
                <span className='w-11/12'>{value ? capitalize(value) : 'Выбрать категорию'}</span>
                <button onClick={() => setActive((prev) => !prev)} className="border-l px-2 hover:bg-neutral-500 transition duration-100">
                    <ChevronDownIcon className="w-[18px] h-[18px]"/>
                </button>
            
                {active && (
                    <div className='z-10 absolute top-10 left-0 flex flex-col max-h-32 justify-left w-full bg-neutral-700 rounded overflow-y-scroll'>
                    {values.map((value, index) => (
                        <button 
                            onClick={() => valueChange(value)} 
                            className='bg-neutral-700 hover:bg-neutral-600 py-1 px-2 text-left'
                            key={index}
                        >
                        {capitalize(value)}
                        </button>
                    ))}
                </div>
                )}
            </div>
        </>
    );
}