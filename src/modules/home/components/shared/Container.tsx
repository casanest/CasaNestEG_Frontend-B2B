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
                'content-container',
                className
            )}
        >
            {children}
        </div>
    );
}