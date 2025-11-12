'use client'

import Image from 'next/image'

export default function ReloadLogo({ href, w, h }: { href: string, w?: number, h?: number }) {
    return (
        <button
            onClick={() => (window.location.href = href)}
            className="text-3xl font-extrabold tracking-widest uppercase text-transparent bg-clip-text hover:from-blue-600 hover:to-blue-800 transition-all duration-300 ease-in-out leading-none"
        >
            <Image
                src="/lacasaLogo.png"
                alt="Logo"
                width={w || 200}
                height={h || 200}
            />
        </button>
    )
}
