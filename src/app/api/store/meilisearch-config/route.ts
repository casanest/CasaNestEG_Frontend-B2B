import { NextResponse } from 'next/server'

import { getMeilisearchClientConfig } from '@lib/meilisearch-config'

/**
 * Browser-safe proxy: returns Meilisearch client config loaded server-side from Medusa.
 */
export async function GET() {
  const config = await getMeilisearchClientConfig()

  if (!config) {
    return NextResponse.json(
      { message: 'Meilisearch client configuration unavailable' },
      { status: 503 }
    )
  }

  return NextResponse.json(config)
}
