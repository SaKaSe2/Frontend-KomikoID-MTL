"use client";

import { useEffect } from "react";
import ErrorDisplay from "@/components/ui/ErrorDisplay";

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-4 text-center">
            <ErrorDisplay 
                message="Gagal memuat chapter ini. Silakan coba lagi." 
                onRetry={reset} 
            />
        </div>
    );
}
