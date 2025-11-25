// Usuarios del sistema
export const USERS = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin'
  },
  {
    id: 2,
    username: 'usuario1',
    password: 'user123',
    name: 'Juan Pérez',
    role: 'user'
  },
  {
    id: 3,
    username: 'usuario2',
    password: 'user123',
    name: 'María García',
    role: 'user'
  },
  {
    id: 4,
    username: 'usuario3',
    password: 'user123',
    name: 'Carlos López',
    role: 'user'
  }
];

export const API_URL = import.meta.env.VITE_API_URL || 'https://fakestoreapi.com/products';

export const CATEGORIES = [
  'electronics',
  'jewelery',
  'men\'s clothing',
  'women\'s clothing'
];