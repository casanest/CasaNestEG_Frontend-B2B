import Spinner from "@modules/common/icons/spinner"

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center bg-white text-ui-fg-base">
      <Spinner  size={40} />
      {/* video representation */}
      {/* <video autoPlay loop muted className="w-200 h-200">
        <source src="/spinner.mp4" type="video/mp4" />
      </video> */}
    </div>
  )
}
