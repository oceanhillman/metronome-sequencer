'use client'
import { useEffect } from 'react';
import { ring } from 'ldrs';

export default function LoaderRing() {

    useEffect(() => {
        if (!customElements.get('l-ring')) {
            ring.register();
        }
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <l-ring
            size="60"
            stroke="5"
            bg-opacity="0"
            speed="2"
            color="white"
        ></l-ring>
        </div>
    );
}