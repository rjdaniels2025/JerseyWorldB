export const allProducts = [
  { id: '1', title: 'AC Milan Home Jersey',     price: '$45.00', category: 'soccer',     team: 'AC Milan' },
  { id: '2', title: 'Barcelona FC Jersey',       price: '$40.00', category: 'soccer',     team: 'Barcelona' },
  { id: '3', title: 'Barcelona FC Away Jersey',  price: '$40.00', category: 'soccer',     team: 'Barcelona' },
  { id: '4', title: 'Bayern Munich Jersey',      price: '$45.00', category: 'soccer',     team: 'Bayern Munich' },
  { id: '5', title: 'Chelsea FC Jersey',         price: '$40.00', category: 'soccer',     team: 'Chelsea' },
  { id: '6', title: 'England National Jersey',   price: '$40.00', category: 'soccer',     team: 'England' },
  { id: '7', title: 'Juventus Jersey',           price: '$40.00', category: 'soccer',     team: 'Juventus' },
  { id: '8', title: 'Chicago Bulls Jersey',      price: '$60.00', category: 'basketball', team: 'Chicago Bulls' },
]

export const featuredProducts = allProducts.slice(0, 4)
