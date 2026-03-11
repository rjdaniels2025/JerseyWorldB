export type Category = {
  id: string
  name: string
  slug: string
  created_at: string
}

export type Product = {
  id: string
  title: string
  description: string | null
  price: number
  category_id: string | null
  featured: boolean
  sizes: string[]
  created_at: string
  categories?: Category
  product_images?: ProductImage[]
}

export type ProductImage = {
  id: string
  product_id: string
  image_url: string
  sort_order: number
}

export type Banner = {
  id: string
  title: string
  subtitle: string | null
  image_url: string | null
  button_text: string | null
  button_link: string | null
  active: boolean
  created_at: string
}

export type Promotion = {
  id: string
  title: string
  description: string | null
  discount_percentage: number | null
  image_url: string | null
  active: boolean
  created_at: string
}

export type Lead = {
  id: string
  customer_name: string
  email: string
  phone: string | null
  city: string | null
  product_id: string | null
  size: string | null
  custom_name: string | null
  custom_number: string | null
  message: string | null
  status: 'New' | 'Contacted' | 'Closed'
  created_at: string
  products?: Product
}
