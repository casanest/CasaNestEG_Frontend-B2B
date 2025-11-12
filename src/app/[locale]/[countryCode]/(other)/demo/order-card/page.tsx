import React from 'react'
import OrderCard from '@modules/order/components/order-card'

interface DemoOrderCardPageProps {
  params: {
    locale: string
    countryCode: string
  }
}

const DemoOrderCardPage: React.FC<DemoOrderCardPageProps> = ({ params }) => {
  const { locale, countryCode } = params

  // Sample order data for demonstration
  const sampleOrders = [
    {
      id: "order_01K2S5A8P7A8FKQGP65C8A28XS",
      display_id: 7,
      status: "pending",
      total: 1500,
      currency_code: "eur",
      created_at: "2025-08-16T10:03:00.681Z",
      payment_status: "PAID",
      items: [
        {
          id: "item_1",
          title: "Astrid Curve Sofa",
          quantity: 1,
          thumbnail: "http://localhost:9090/medusa/astrid-curve-01JTEGZHGPQSVQ1YJ38S9HG1RB.png"
        },
        {
          id: "item_2",
          title: "Modern Coffee Table",
          quantity: 2,
          thumbnail: "http://localhost:9090/medusa/astrid-curve-01JTEGZHGPQSVQ1YJ38S9HG1RB.png"
        }
      ],
      shipping_address: {
        first_name: "John",
        last_name: "Doe",
        city: "Test City",
        country_code: "ar"
      }
    },
    {
      id: "order_01K2S5A8P7A8FKQGP65C8A28XY",
      display_id: 8,
      status: "confirmed",
      total: 2500,
      currency_code: "eur",
      created_at: "2025-08-15T14:30:00.000Z",
      payment_status: "PAID",
      items: [
        {
          id: "item_3",
          title: "Elegant Dining Chair",
          quantity: 4,
          thumbnail: "http://localhost:9090/medusa/astrid-curve-01JTEGZHGPQSVQ1YJ38S9HG1RB.png"
        }
      ],
      shipping_address: {
        first_name: "Jane",
        last_name: "Smith",
        city: "Another City",
        country_code: "fr"
      }
    },
    {
      id: "order_01K2S5A8P7A8FKQGP65C8A28XZ",
      display_id: 9,
      status: "shipped",
      total: 800,
      currency_code: "eur",
      created_at: "2025-08-14T09:15:00.000Z",
      payment_status: "PAID",
      items: [
        {
          id: "item_4",
          title: "Wall Art Print",
          quantity: 1,
          thumbnail: "http://localhost:9090/medusa/astrid-curve-01JTEGZHGPQSVQ1YJ38S9HG1RB.png"
        }
      ],
      shipping_address: {
        first_name: "Mike",
        last_name: "Johnson",
        city: "Third City",
        country_code: "de"
      }
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Card Demo</h1>
          <p className="text-gray-600 mt-2">
            This page demonstrates the OrderCard component with sample data
          </p>
        </div>

        {/* Demo Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Demo Information</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>This page shows how the OrderCard component looks with different order statuses and data.</p>
                <p className="mt-1">Click on "View Details" to see the order details page navigation.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              locale={locale}
              countryCode={countryCode}
            />
          ))}
        </div>

        {/* Component Features */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">OrderCard Component Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Display Elements</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Order ID and creation date</li>
                <li>• Total amount and item count</li>
                <li>• Order status and payment status badges</li>
                <li>• Order items preview with thumbnails</li>
                <li>• Shipping address information</li>
                <li>• View Details button</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Interactive Features</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Hover effects and transitions</li>
                <li>• Responsive grid layout</li>
                <li>• Status-based color coding</li>
                <li>• Navigation to order details</li>
                <li>• Locale and country code support</li>
                <li>• TypeScript type safety</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-8 text-center">
          <div className="inline-flex space-x-4">
            <a
              href={`/${locale}/${countryCode}/orders`}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              View Orders List
            </a>
            <a
              href={`/${locale}/${countryCode}`}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DemoOrderCardPage 