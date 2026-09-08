const SkeletonCardDetails = () => {
  return (
    <div className="flex flex-col gap-1 my-4 transition-all duration-150 ease-in-out">
      <div className="h-4 skeleton-shimmer rounded-md w-1/4 mb-1"></div>
      <div className="pt-3 pb-1 block w-full h-11 px-4 mt-0 skeleton-shimmer border rounded-md appearance-none border-ui-border-base" />
    </div>
  )
}

export default SkeletonCardDetails
