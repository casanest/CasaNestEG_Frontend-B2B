import { Container } from "@medusajs/ui"

const SkeletonProductPreview = () => {
  return (
    <div>
      <Container className="aspect-[9/16] w-full skeleton-shimmer" />
      <div className="flex justify-between text-base-regular mt-2">
        <div className="w-2/5 h-6 skeleton-shimmer rounded"></div>
        <div className="w-1/5 h-6 skeleton-shimmer rounded"></div>
      </div>
    </div>
  )
}

export default SkeletonProductPreview
