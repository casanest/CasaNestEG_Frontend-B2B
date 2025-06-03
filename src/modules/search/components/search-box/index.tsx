'use client'

import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { XMarkMini } from '@medusajs/icons'
import { Box } from '@modules/common/components/box'
import Input from '@modules/common/components/input'
import { useLocale } from 'next-intl'
const milisearchUrl = process.env.NEXT_PUBLIC_MILISEARCH_URL || 'http://localhost:7700'
const milisearchApiKey = process.env.MILISEARCH_API_KEY ||'f91cf0081492ffa10b6919b9314357d194641f94331b41e4540d0efe499a6ddb'
export const ControlledSearchBox = ({
  countryCode,
  open,
  setProducts,
  closeSearch,
}: {
  countryCode: string
  open: boolean,
  setProducts: (products: any[]) => void
  closeSearch: () => void
}) => {
  const locale = useLocale()
  const isRtl = locale === 'ar'
  const [query, setQuery] = useState<string | undefined>('')
  const router = useRouter()
  const inputRef = useRef(null)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (query) {
      const localSearches =
        JSON.parse(localStorage.getItem('recentSearches')) || []

      const updatedSearches = new Set([query, ...localSearches])

      localStorage.setItem(
        'recentSearches',
        JSON.stringify(Array.from(updatedSearches).slice(0, 5))
      )
      router.push(`/results/${query}`)
    }
    inputRef.current.blur()
    setQuery('')
    closeSearch()
  }

  const handleReset = (event: FormEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setQuery('')
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  useEffect(() => {
    if (inputRef.current && open) {
      inputRef.current.focus()
    }
  }, [open])

  const handleChange = (e) => {
    setQuery(e.target.value)
    setShowDropdown(true)
    // Optionally, you can trigger fetch here if using API
  }

  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query && query.length > 1) {
      setLoading(true)
      // Replace this with your actual API call
      fetch(`${milisearchUrl}/indexes/products/search?q=${encodeURIComponent(query)}`,{
        headers: {
          'authorization': `Bearer ${milisearchApiKey}`,
      }})
        .then((res) => res.json())
        .then((data) => {
          setProducts(data.hits || [])
          setLoading(false)
        })
        .catch(() => setProducts([]))
    } else {
      setProducts([])
    }
  }, [query])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        inputRef.current &&
        !(inputRef.current as any).contains(e.target)
      ) {
        setShowDropdown(false)
      }
    }
    if (showDropdown) {
      document.addEventListener('mousedown', handleClick)
    }
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [showDropdown])


  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="relative w-full bg-[#f5f8fc] md:mx-auto large:w-max md:align-center md:justify-center md:items-center md:rounded">
      <form action="" noValidate onSubmit={handleSubmit} onReset={handleReset}>
        <Box className="flex w-full items-center justify-between border border-action-primary md:rounded-md large:relative large:w-[400px] xl:w-[600px] ">
          <Input
            ref={inputRef}
            data-testid="search-input"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            placeholder={isRtl ? 'ابحث عن منتج...' : 'Search products...'}
            spellCheck={false}
            type="search"
            value={query}
            onChange={handleChange}
            className="w-full !border-none bg-transparent pr-5 text-lg placeholder:text-basic-primary focus:outline-none py-2 px-5 md:rounded"
          />
          {query && (
            <button
              onClick={handleReset}
              type="button"
              className={`absolute ${isRtl ? 'left-0' : 'right-0'} flex items-center justify-center gap-x-2 px-4 text-lg text-basic-primary focus:outline-none`}
            >
              <XMarkMini />
            </button>
          )}
        </Box>
      </form>
      
      
    </div>
  )
}
