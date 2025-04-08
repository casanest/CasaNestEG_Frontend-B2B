import { Heading, Text } from "@medusajs/ui"
import InteractiveLink from "@modules/common/components/interactive-link"
import { ShoppingCart } from "lucide-react" // or any icon library you're using

const EmptyCartMessage = () => {
  return (
    <div
      className="py-32 px-4 md:px-10 rounded-lg text-center flex flex-col justify-center items-center"
      data-testid="empty-cart-message"
    >
      <ShoppingCart className="w-14 h-14 text-[#043364] mb-4" />

      <Heading level="h1" className="text-3xl font-semibold text-[#043364]">
        Your Cart is Empty
      </Heading>

      <Text className="text-base text-[#043364] my-4 max-w-lg">
        You don&apos;t have anything in your cart yet. Let&apos;s change that!
        Use the link below to start browsing our latest products.
      </Text>

      <InteractiveLink
        href="/store"
      >
        Explore Products
      </InteractiveLink>
    </div>
  )
}

export default EmptyCartMessage
