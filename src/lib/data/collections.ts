"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export interface ApiCollection {
  id: string
  title: string
  handle: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  metadata: {
    localizations?: {
      ar?: {
        title?: string
        handle?: string
      }
    }
    available_languages?: string[]
    localization_updated_at?: string
  } | null
}

export type Collection = {
  id: string
  name_en: string
  name_ar: string
  handle_en: string
  // handle_ar: string
}

export const retrieveCollection = async (id: string) => {
  const next = {
    ...(await getCacheOptions("collections")),
  }

  return sdk.client
    .fetch<{ collection: HttpTypes.StoreCollection }>(
      `/store/collections/${id}`,
      {
        next: { revalidate: 0, ...next },
      }
    )
    .then(({ collection }) => collection)
}

export const listCollections = async (
  queryParams: Record<string, string> = {}
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> => {
  const next = {
    ...(await getCacheOptions("collections")),
  }

  queryParams.limit = queryParams.limit || "100"
  queryParams.offset = queryParams.offset || "0"

  return sdk.client
    .fetch<{ collections: HttpTypes.StoreCollection[]; count: number }>(
      "/store/collections",
      {
        query: queryParams,
        next: { revalidate: 0, ...next },
      }
    )
    .then(({ collections }) => ({ collections, count: collections.length }))
}





export const getCollectionsLocal = async (
  queryParams: Record<string, any> = {}
): Promise<{ collections: Collection[]; count: number }> => {
  const next = {
    ...(await getCacheOptions("collections")),
  };

  const limit = queryParams.limit || 100;
  let offset = queryParams.offset || 0;

  const response = await sdk.client.fetch<{
    collections: ApiCollection[];
    count: number;
  }>("/store/collections", {
    query: {
      limit,
      offset,
      ...queryParams,
      // يمكنك إضافة حقول أخرى مطلوبة هنا، مثل metadata أو products إذا لزم الأمر
    },
    next: { revalidate: 0, ...next },
  });

  const collections = response.collections.map((col) => {
    const arLocalization = col.metadata?.localizations?.ar;
    const hasArabicTitle = arLocalization && arLocalization.title && arLocalization.title.trim() !== "";
    const hasArabicHandle = arLocalization && arLocalization.handle && arLocalization.handle.trim() !== "";

    return {
      id: col.id,
      name_en: col.title || "",
      name_ar: hasArabicTitle ? (arLocalization.title || "") : (col.title || ""),
      handle_en: col.handle || "",
      handle_ar: hasArabicHandle ? (arLocalization.handle || "") : (col.handle || ""),
    };
  });


  return { collections, count: response.count };
};


export const getCollectionByHandle = async (
  handle: string
): Promise<HttpTypes.StoreCollection> => {
  const next = {
    ...(await getCacheOptions("collections")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreCollectionListResponse>(`/store/collections`, {
      query: { handle, fields: "*products" },
      next: { revalidate: 0, ...next },
    })
    .then(({ collections }) => collections[0])
}
