"use client"
import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { Eye, Package, Calendar, CreditCard, MapPin } from 'lucide-react'

interface OrderCardProps {
  order: {
    id: string
    display_id: number
    status: string
    total: number
    currency_code: string
    created_at: string
    payment_status: string
    items: Array<{
      id: string
      title: string
      quantity: number
      thumbnail?: string
    }>
    shipping_address?: {
      first_name: string
      last_name: string
      city: string
      country_code: string
    }
  }
  locale: string
  countryCode: string
}

const OrderCard: React.FC<OrderCardProps> = ({ order, locale, countryCode }) => {
  const [failedThumbnails, setFailedThumbnails] = useState<Record<string, boolean>>({})
  const handleThumbnailError = useCallback((itemId: string) => {
    setFailedThumbnails((prev) => ({ ...prev, [itemId]: true }))
  }, [])

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100) // Assuming amount is in cents
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'fulfilled':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'refunded':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      {/* Order Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Package className="w-5 h-5 text-gray-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Order #{order.display_id}
              </h3>
              <p className="text-sm text-gray-500">
                {format(new Date(order.created_at), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(order.total, order.currency_code)}
            </p>
            <p className="text-sm text-gray-500">
              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Order Status */}
      <div className="px-6 py-3 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
              {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}</span>
          </div>
        </div>
      </div>

      {/* Order Items Preview */}
      <div className="px-6 py-4">
        <div className="space-y-3">
          {order.items.slice(0, 2).map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              {item.thumbnail && (
                failedThumbnails[item.id] ? (
                  <div className="w-12 h-12 rounded-md bg-gray-200 flex-shrink-0" aria-hidden />
                ) : (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-12 h-12 rounded-md object-cover"
                    onError={() => handleThumbnailError(item.id)}
                  />
                )
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.title}
                </p>
                <p className="text-sm text-gray-500">
                  Qty: {item.quantity}
                </p>
              </div>
            </div>
          ))}
          {order.items.length > 2 && (
            <p className="text-sm text-gray-500 text-center py-2">
              +{order.items.length - 2} more item{order.items.length - 2 !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* Shipping Address */}
      {order.shipping_address && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>
              {order.shipping_address.first_name} {order.shipping_address.last_name} - {order.shipping_address.city}, {order.shipping_address.country_code.toUpperCase()}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <Link
            href={`/${locale}/${countryCode}/orders/${order.id}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Link>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <CreditCard className="w-4 h-4" />
            <span>Payment: {order.payment_status}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderCard 