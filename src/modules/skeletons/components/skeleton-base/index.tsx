import { cn } from "@lib/util/cn"

type SkeletonProps = {
  className?: string
}

const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      className={cn(
        "skeleton-shimmer rounded",
        className
      )}
    />
  )
}

export default Skeleton
