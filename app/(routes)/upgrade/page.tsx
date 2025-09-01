import { PricingTable } from '@clerk/nextjs'
import React from 'react'

function UpgradePage() {
    return (
        <div className='flex flex-col items-center justify-between' style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
            <h1 className='font-bold mt-24 mb-10 text-4xl'>Upgrade To Pro Plan</h1>
            <PricingTable />
        </div>
    )
}

export default UpgradePage