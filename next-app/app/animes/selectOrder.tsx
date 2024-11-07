'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SingleOption from "../components/singleOption";

const splitOrdering = (string: string) => {
    const values = string.split(':::');

    return {order: values[0], asc: values[1] === 'true'};
};

export default function SelectOrder() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    
    const values = {
        'По рейтингу (убывание)': 'rating:::false',
        'По рейтингу (возрастание)': 'rating:::true',
        'По названию (убывание)': 'title:::false',
        'По названию (возрастание)': 'title:::true',
        'По году выхода (убывание)': 'year:::false',
        'По году выхода (возрастание)': 'year:::true',
    };

    const valueChangeHandler = (value: string) => {
        const params = new URLSearchParams(searchParams);

        if (value in values) {
            const {order, asc} = splitOrdering(values[value as keyof typeof values]);
            if (order) {
                params.set('order_by', order);
            } else {
                params.delete('order_by');
                params.delete('asc');
            }
    
            if (asc) {
                params.set('asc', 'true');
            } else {
                params.delete('asc');
            }
            replace(`${pathname}?${params.toString()}`);
            return true;
        }
        return false;
    };

    return (
        <SingleOption placeholder={Object.keys(values)[0]} values={Object.keys(values)} onValueChange={valueChangeHandler}/>
    );
}