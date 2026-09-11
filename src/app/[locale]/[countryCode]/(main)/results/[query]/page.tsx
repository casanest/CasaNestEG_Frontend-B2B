import { Metadata } from 'next'

import { getRegion } from '@lib/data/regions'
import { safeDecodeURIComponent } from '@lib/util/safe-decode-uri'
import SearchResultsTemplate from '@modules/search/templates/search-results-template'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Explore all of our products.',
}

type Params = {
  params: Promise<{ query: string; countryCode: string }>
  searchParams: Promise<{
    sortBy?: string
    page?: string
    [key: string]: string | string[] | undefined
  }>
}

export default async function SearchResults(props: Params) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page, ...filterParams } = searchParams
  const { query, countryCode } = params
  const decodedQuery = safeDecodeURIComponent(query)

  const region = await getRegion(countryCode)

  return (
    <SearchResultsTemplate
      query={decodedQuery}
      sortBy={sortBy}
      page={page}
      currency_code={region?.currency_code || 'USD'}
      countryCode={params.countryCode}
      searchParams={filterParams}
    />
  )
}
