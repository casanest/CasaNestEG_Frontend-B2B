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
  is_in_homepage?: boolean
}

export type TestimonialResponse = {
  testimonials: Testimonial[]
}

export async function listTestimonials(homepage?: boolean): Promise<Testimonial[]> {
  try {
    const query: Record<string, string> = {}
    if (homepage) {
      query.homepage = "true"
    }

    const response = await sdk.client.fetch<TestimonialResponse>(
      "/store/testimonials",
      {
        method: "GET",
        query,
        next: { revalidate: 300, tags: ["testimonials"] },
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
