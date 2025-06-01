import { useEffect, useState } from 'react'

import { Button } from '@modules/common/components/button'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { Text } from '@modules/common/components/text'
import { SearchIcon } from '@modules/common/icons/search'

import { useLocale } from 'next-intl'

export const RecentSearches = ({
  handleOpenDialogChange,
}: {
  handleOpenDialogChange: (value: boolean) => void
}) => {
  const locale = useLocale()
  const isRtl = locale === 'ar'
  const [searches, setSearches] = useState([])
  useEffect(() => {
    const fetchRecentSearches = () => {
      const storedSearches = localStorage.getItem('recentSearches')
      if (storedSearches) {
        setSearches(JSON.parse(storedSearches))
      }
    }

    fetchRecentSearches()
  }, [])

  return (
    <>
      {searches.length ? (
        searches.map((search, id) => {
          return (
            <Button key={id} variant="text" asChild className="w-min">
              <div className="flex gap-4">
                <SearchIcon />
                <LocalizedClientLink
                  href={`/results/${search}`}
                  onClick={() => {
                    handleOpenDialogChange(false)
                  }}
                >
                  {search}
                </LocalizedClientLink>
              </div>
            </Button>
          )
        })
      ) : (
        <Text className="text-secondary">{locale === 'ar' ? 'لم يتم العثور على نتائج' : 'No results found'}</Text>
      )}
    </>
  )
}
