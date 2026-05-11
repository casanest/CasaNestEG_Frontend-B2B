import { cn } from "@lib/util/cn";

export default function Container({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'w-full max-w-[1720px] mx-auto px-4 md:px-6 ',
                className
            )}
        >
            {children}
        </div>
    );
}