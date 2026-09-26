// src/hooks/use-debounce.ts
import { useEffect, useState } from "react";

export function useDebounce<T>(nilai: T, delay: number = 500): T {
    const [nilaiTertunda, setNilaiTertunda] = useState(nilai);

useEffect(() => {
    const timer = setTimeout(() => {
        setNilaiTertunda(nilai);
    }, delay);

    return () => clearTimeout(timer);
    }, [nilai, delay]);

    return nilaiTertunda;
}