// "use server"

// import { sdk } from "@lib/config"
// import medusaError from "@lib/util/medusa-error"
// import { HttpTypes } from "@medusajs/types"
// import { getCacheOptions } from "./cookies"

// export const listRegions = async () => {
//   const next = {
//     ...(await getCacheOptions("regions")),
//   }

//   return sdk.client
//     .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
//       method: "GET",
//       next,
//       cache: "no-store",
//     })
//     .then(({ regions }) => regions)
//     .catch(medusaError)
// }

// export const retrieveRegion = async (id: string) => {
//   const next = {
//     ...(await getCacheOptions(["regions", id].join("-"))),
//   }

//   return sdk.client
//     .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
//       method: "GET",
//       next,
//       cache: "no-store",
//     })
//     .then(({ region }) => region)
//     .catch(medusaError)
// }

// const regionMap = new Map<string, HttpTypes.StoreRegion>()

// export const getRegion = async (countryCode: string) => {
//   try {
//     if (regionMap.has(countryCode)) {
//       return regionMap.get(countryCode)
//     }

//     const regions = await listRegions()

//     if (!regions) {
//       return null
//     } 

//     regions.forEach((region) => {
//       region.countries?.forEach((c) => {
//         regionMap.set(c?.iso_2 ?? "", region)
//       })
//     })

//     const region = countryCode
//       ? regionMap.get(countryCode)
//       : regionMap.get("us")

//     return region
//   } catch (e: any) {
//     return null
//   }
// }

"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"
import { cache } from "react"

export const listRegions = async () => {
  const next = {
    ...(await getCacheOptions("regions")),
  }

  return sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(
      "/store/regions",
      {
        method: "GET",
        next: { revalidate: 3600, ...next },
      }
    )
    .then(({ regions }) => regions)
    .catch((error) => {
      console.error("LIST REGIONS ERROR:", error)
      return []
    })
}

export const retrieveRegion = async (id: string) => {
  const next = {
    ...(await getCacheOptions(`regions-${id}`)),
  }

  return sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(
      `/store/regions/${id}`,
      {
        method: "GET",
        next: { revalidate: 3600, ...next },
      }
    )
    .then(({ region }) => region)
    .catch((error) => {
      console.error("RETRIEVE REGION ERROR:", error)
      return null
    })
}

const regionMap = new Map<string, HttpTypes.StoreRegion>()

export const getRegion = cache(async (
  countryCode: string
): Promise<HttpTypes.StoreRegion | null> => {
  try {
    const normalizedCountryCode = (
      countryCode || "eg"
    )
      .toLowerCase()
      .trim()

    if (regionMap.has(normalizedCountryCode)) {
      return regionMap.get(normalizedCountryCode) || null
    }

    const regions = await listRegions()

    if (!regions?.length) {
      return null
    }

    regionMap.clear()

    regions.forEach((region) => {
      region.countries?.forEach((country) => {
        const isoCode = country?.iso_2
          ?.toLowerCase()
          ?.trim()

        if (isoCode) {
          regionMap.set(isoCode, region)
        }
      })
    })

    const region =
      regionMap.get(normalizedCountryCode) ||
      regionMap.get("eg") ||
      null

    return region
  } catch (error) {
    console.error("GET REGION ERROR:", error)
    return null
  }
})
