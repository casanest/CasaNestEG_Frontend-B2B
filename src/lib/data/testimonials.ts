import { sdk } from "@lib/config"

export type Testimonial = {
  id: string
  name_en: string
  name_ar: string
  image_url: string
  quote_en: string
  quote_ar: string
  position_en: string
  position_ar: string
  display_order: number
}

export type TestimonialResponse = {
  testimonials: Testimonial[]
}

export async function listTestimonials(): Promise<Testimonial[]> {
  try {
    const response = await sdk.client.fetch<TestimonialResponse>(
      "/store/testimonials",
      {
        method: "GET",
        cache: "no-store",
      }
    )

    if (!response || !response.testimonials) {
      return []
    }

    return response.testimonials
  } catch {
    return []
  }
}
