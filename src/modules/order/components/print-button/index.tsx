"use client"

type PrintButtonProps = {
    label: string
}

export default function PrintButton({ label }: PrintButtonProps) {
    const handlePrint = () => {
        if (typeof window !== "undefined") {
            window.print()
        }
    }

    return (
        <button
            onClick={handlePrint}
            className="px-6 py-2 bg-transparent border border-gray-300 text-[#03294f] rounded-lg hover:bg-[#03294f] hover:text-white transition"
            data-testid="print-receipt-button"
        >
            {label}
        </button>
    )
}
