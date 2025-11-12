import React from 'react'
import { sdk } from '@lib/config'
import OrderCard from '@modules/order/components/order-card'

interface OrdersPageProps {
  params: {
    locale: string
    countryCode: string
  }
}

const OrdersPage: React.FC<OrdersPageProps> = async ({ params }) => {
  const { locale, countryCode } = params

  try {
    // Fetch orders for the current user
    const ordersResponse = await sdk.store.order.list()
    const orders = ordersResponse.orders || []

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-2">
              Track your orders and view order details
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-6">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <a
                href={`/${locale}/${countryCode}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Start Shopping
              </a>
            </div>
          ) : (
            <>
              {/* Orders Count */}
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Orders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={{
                      id: order.id,
                      display_id: order.display_id || 0,
                      status: order.status,
                      total: order.total,
                      currency_code: order.currency_code,
                      created_at: order.created_at ? new Date(order.created_at).toISOString() : new Date().toISOString(),
                      payment_status: order.payment_status || 'pending',
                      items: order.items?.map(item => ({
                        id: item.id,
                        title: item.title,
                        quantity: item.quantity,
                        thumbnail: item.thumbnail || undefined
                      })) || [],
                      shipping_address: order.shipping_address && 
                        order.shipping_address.first_name && 
                        order.shipping_address.last_name && 
                        order.shipping_address.city && 
                        order.shipping_address.country_code ? {
                          first_name: order.shipping_address.first_name,
                          last_name: order.shipping_address.last_name,
                          city: order.shipping_address.city,
                          country_code: order.shipping_address.country_code
                        } : undefined
                    }}
                    locale={locale}
                    countryCode={countryCode}
                  />
                ))}
              </div>

              {/* Pagination Info */}
              {orders.length > 0 && (
                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-500">
                    Showing all orders. More orders will appear here as you place them.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching orders:', error)
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading orders</h3>
            <p className="text-gray-500 mb-6">
              There was an error loading your orders. Please try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default OrdersPage 