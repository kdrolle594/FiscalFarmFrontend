import type { Farm } from '@/types/farm'

export const mockFarms: Farm[] = [
  {
    id: 'farm-1',
    name: 'Groningen Farm',
    country: 'Suriname',
    province: 'Saramacca',
    village: 'Groningen',
    address: '123 ABC Street',
    size: 138.11,
    ownerId: '6',
  },
  {
    id: 'farm-2',
    name: 'Groningen Estate Saramacca',
    country: 'Suriname',
    province: 'Brokopondo',
    village: 'Brownsweg',
    address: '12456 Centre Way',
    size: 850,
    ownerId: '6',
  },
  {
    id: 'farm-3',
    name: 'Groningen Kromo Suriname Tabletop Farm',
    country: 'Suriname',
    province: 'Saramacca',
    village: 'Groningen',
    address: '456 Hans Bröker Street',
    size: 91,
    ownerId: '6',
  },
  {
    id: 'farm-4',
    name: 'Mariënburg Farm',
    country: 'Suriname',
    province: 'Commewijne',
    village: 'Mariënburg',
    address: '789 Plantation Road',
    size: 45.5,
    ownerId: '7',
  },
]
