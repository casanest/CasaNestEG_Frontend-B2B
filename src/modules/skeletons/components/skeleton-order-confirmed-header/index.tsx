const SkeletonOrderConfirmedHeader = () => {
  return (
    <div className="flex flex-col gap-y-2 pb-10">
      <div className="w-2/5 h-4 skeleton-shimmer rounded"></div>
      <div className="w-3/6 h-6 skeleton-shimmer rounded"></div>
      <div className="flex gap-x-4">
        <div className="w-16 h-4 skeleton-shimmer rounded"></div>
        <div className="w-12 h-4 skeleton-shimmer rounded"></div>
      </div>
    </div>
  )
}

export default SkeletonOrderConfirmedHeader
