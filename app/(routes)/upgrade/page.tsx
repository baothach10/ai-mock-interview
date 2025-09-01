'use client'
import { PricingTable } from '@clerk/nextjs'
import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react";

function UpgradePage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (containerRef.current) {
            // Animate all direct children of the container
            gsap.from(containerRef.current.children, {
                opacity: 0,
                y: 100, // move from bottom
                duration: 0.8,
                stagger: 0.2, // each child comes after 0.2s
                ease: 'power3.out',
            });
        }
    }, [containerRef]);
    return (
        <div ref={containerRef} className='flex flex-col items-center justify-between' style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
            <h1 className='font-bold mt-24 mb-10 text-4xl'>Upgrade To Pro Plan</h1>
            <PricingTable />
        </div>
    )
}

export default UpgradePage