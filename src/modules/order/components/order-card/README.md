# OrderCard Component

A reusable React component for displaying order information in a card format with navigation to order details.

## Features

- **Order Information Display**: Shows order ID, date, total, and item count
- **Status Badges**: Visual indicators for order status and payment status
- **Item Preview**: Displays first 2 items with thumbnails and quantities
- **Shipping Address**: Shows shipping address information when available
- **Navigation**: Links to detailed order page
- **Responsive Design**: Adapts to different screen sizes
- **TypeScript Support**: Fully typed with TypeScript interfaces

## Usage

```tsx
import OrderCard from '@modules/order/components/order-card'

const MyComponent = () => {
  const order = {
    id: "order_123",
    display_id: 7,
    status: "pending",
    total: 1500,
    currency_code: "eur",
    created_at: "2025-08-16T10:03:00.681Z",
    payment_status: "PAID",
    items: [
      {
        id: "item_1",
        title: "Product Name",
        quantity: 1,
        thumbnail: "https://example.com/image.jpg"
      }
    ],
    shipping_address: {
      first_name: "John",
      last_name: "Doe",
      city: "City Name",
      country_code: "us"
    }
  }

  return (
    <OrderCard
      order={order}
      locale="en"
      countryCode="us"
    />
  )
}
```

## Props

### OrderCardProps

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `order` | `OrderData` | Yes | Order information object |
| `locale` | `string` | Yes | Current locale (e.g., "en", "ar") |
| `countryCode` | `string` | Yes | Current country code (e.g., "us", "uk") |

### OrderData Interface

```typescript
interface OrderData {
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
```

## Order Status Colors

The component automatically applies appropriate colors based on order status:

- **Pending**: Yellow
- **Confirmed**: Blue
- **Fulfilled**: Green
- **Shipped**: Purple
- **Delivered**: Green
- **Cancelled**: Red

## Payment Status Colors

Payment status badges use these colors:

- **Paid**: Green
- **Pending**: Yellow
- **Failed**: Red
- **Refunded**: Blue

## Navigation

The "View Details" button navigates to:
```
/{locale}/{countryCode}/orders/{orderId}
```

## Styling

The component uses Tailwind CSS classes and includes:
- Hover effects with shadow transitions
- Responsive grid layout
- Consistent spacing and typography
- Status-based color coding
- Icon integration with Lucide React

## Dependencies

- `react`
- `next/link`
- `date-fns`
- `lucide-react`
- `tailwindcss`

## Example Pages

- **Demo Page**: `/demo/order-card` - Shows the component with sample data
- **Orders List**: `/orders` - Displays multiple OrderCard components
- **Order Details**: `/orders/[orderId]` - Detailed order information page

## Customization

To customize the component:

1. Modify the `getStatusColor` and `getPaymentStatusColor` functions for different color schemes
2. Update the `formatCurrency` function for different currency formatting
3. Adjust the Tailwind classes for different visual styles
4. Modify the item preview limit (currently shows first 2 items)

## Accessibility

- Proper heading hierarchy
- Alt text for images
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly 