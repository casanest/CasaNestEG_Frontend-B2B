import React from 'react'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { 
  Package, 
  Calendar, 
  CreditCard, 
  MapPin, 
  Truck, 
  CheckCircle, 
  Clock,
  AlertCircle
} from 'lucide-react'
import { sdk } from '@lib/config'
import OrderItemThumbnail from '@modules/order/components/order-item-thumbnail'

interface OrderDetailsPageProps {
  params: {
    locale: string
    countryCode: string
    orderId: string
  }
}

const OrderDetailsPage: React.FC<OrderDetailsPageProps> = async ({ params }) => {
  const { locale, countryCode, orderId } = params

  try {
    // Fetch order details
    const orderResponse = await sdk.store.order.retrieve(orderId)
    
    if (!orderResponse || !orderResponse.order) {
      notFound()
    }

    const order = orderResponse.order

    const formatCurrency = (amount: number, currency: string) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.toUpperCase(),
      }).format(amount)
    }

    const getStatusIcon = (status: string) => {
      switch (status.toLowerCase()) {
        case 'pending':
          return <Clock className="w-5 h-5 text-yellow-500" />
        case 'confirmed':
          return <CheckCircle className="w-5 h-5 text-blue-500" />
        case 'fulfilled':
          return <Package className="w-5 h-5 text-green-500" />
        case 'shipped':
          return <Truck className="w-5 h-5 text-purple-500" />
        case 'delivered':
          return <CheckCircle className="w-5 h-5 text-green-500" />
        case 'cancelled':
          return <AlertCircle className="w-5 h-5 text-red-500" />
        default:
          return <Clock className="w-5 h-5 text-gray-500" />
      }
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600 mt-2">
              Order #{order.display_id} • {format(new Date(order.created_at), 'MMMM dd, yyyy')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Order Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Order Status</h2>
                  {getStatusIcon(order.status)}
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                    {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                  </span>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Order placed on {format(new Date(order.created_at), 'MMMM dd, yyyy at HH:mm')}</p>
                  {order.updated_at && (
                    <p>Last updated on {format(new Date(order.updated_at), 'MMMM dd, yyyy at HH:mm')}</p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
                <div className="space-y-4">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      {item.thumbnail && (
                        <OrderItemThumbnail
                          thumbnail={item.thumbnail}
                          title={item.title}
                          className="w-16 h-16 rounded-md object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        {item.variant?.title && (
                          <p className="text-sm text-gray-500">{item.variant.title}</p>
                        )}
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatCurrency(item.unit_price, order.currency_code)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Total: {formatCurrency(item.total, order.currency_code)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(order.subtotal, order.currency_code)}</span>
                  </div>
                  {order.shipping_total > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">{formatCurrency(order.shipping_total, order.currency_code)}</span>
                    </div>
                  )}
                  {order.tax_total > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">{formatCurrency(order.tax_total, order.currency_code)}</span>
                    </div>
                  )}
                  {order.discount_total > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium">-{formatCurrency(order.discount_total, order.currency_code)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-gray-900">{formatCurrency(order.total, order.currency_code)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Shipping Information */}
              {order.shipping_address && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
                    {order.shipping_address.company && <p>{order.shipping_address.company}</p>}
                    <p>{order.shipping_address.address_1}</p>
                    {order.shipping_address.address_2 && <p>{order.shipping_address.address_2}</p>}
                    <p>{order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.postal_code}</p>
                    <p>{order.shipping_address.country_code.toUpperCase()}</p>
                    {order.shipping_address.phone && <p>Phone: {order.shipping_address.phone}</p>}
                  </div>
                </div>
              )}

              {/* Billing Information */}
              {order.billing_address && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Billing Address</h3>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{order.billing_address.first_name} {order.billing_address.last_name}</p>
                    {order.billing_address.company && <p>{order.billing_address.company}</p>}
                    <p>{order.billing_address.address_1}</p>
                    {order.billing_address.address_2 && <p>{order.billing_address.address_2}</p>}
                    <p>{order.billing_address.city}, {order.billing_address.province} {order.billing_address.postal_code}</p>
                    <p>{order.billing_address.country_code.toUpperCase()}</p>
                    {order.billing_address.phone && <p>Phone: {order.billing_address.phone}</p>}
                  </div>
                </div>
              )}

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
                </div>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>Payment Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                      {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Currency:</span>
                    <span className="font-medium">{order.currency_code.toUpperCase()}</span>
                  </div>
                  {order.payment_collections && order.payment_collections.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-500">Payment Collection ID:</p>
                      <p className="text-xs font-mono">{order.payment_collections[0].id}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Actions</h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                    Download Invoice
                  </button>
                  {/* <button className="w-full px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200">
                    Contact Support
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching order:', error)
    notFound()
  }
}

export default OrderDetailsPage 