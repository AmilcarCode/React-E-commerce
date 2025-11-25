# LibreMercado 🛍️

E-commerce moderno desarrollado con React y JavaScript.

## 🚀 Características

- **Catálogo de productos** con búsqueda y filtros por categoría
- **Carrito de compras** con persistencia en localStorage
- **Autenticación de usuarios** con rutas protegidas
- **Panel de administración** con CRUD completo de productos
- **Paginación inteligente** con control de items por página
- **Búsqueda en tiempo real** por nombre y categoría
- **Diseño responsive** optimizado para todos los dispositivos
- **Integración con MockAPI** para gestión de datos

## 🛠️ Tecnologías

- **React 19** - Biblioteca de JavaScript
- **React Router DOM** - Navegación SPA
- **Tailwind CSS** - Framework de estilos
- **shadcn/ui** - Componentes de UI
- **Vite** - Build tool y dev server
- **MockAPI** - Backend simulado

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── Layout/           # Componentes de layout (Navbar, Footer, Sidebar)
│   ├── Product/          # Componentes de productos (Card, List)
│   ├── ui/               # Componentes UI reutilizables
│   ├── Pagination.jsx    # Sistema de paginación
│   └── ProtectedRoute.jsx # HOC para rutas protegidas
├── context/
│   ├── AuthContext.jsx   # Gestión de autenticación
│   ├── CartContext.jsx   # Gestión del carrito
│   ├── ProductSourceContext.jsx
│   └── ThemeContext.jsx  # Tema claro/oscuro
├── hooks/
│   └── useApi.js         # Custom hook para API
├── pages/
│   ├── Home.jsx          # Página principal
│   ├── ProductDetail.jsx # Detalle de producto
│   ├── Cart.jsx          # Carrito de compras
│   ├── Checkout.jsx      # Proceso de pago
│   ├── Admin.jsx         # Panel administrativo
│   ├── Login.jsx         # Autenticación
│   └── NotFound.jsx      # Página 404
├── services/
│   └── api.js            # Servicios de API
├── utils/
│   ├── constants.js      # Constantes globales
│   ├── helpers.js        # Funciones auxiliares
│   └── mockdata.js       # Datos de prueba
├── App.jsx               # Componente raíz
├── main.jsx              # Punto de entrada
└── index.css             # Estilos globales
```

## 📦 Instalación

```bash
# Clonar el repositorio
git clone git@github.com:AmilcarCode/React-E-commerce.git
cd libremercado-test

# Instalar dependencias
pnpm install

# Configurar variables de entorno
# Crear archivo .env en la raíz:
VITE_MOCKAPI_URL=https://[tu-id].mockapi.io/api/v1/products

# Ejecutar en modo desarrollo
pnpm dev

# Construir para producción
pnpm build
```


## 📝 Scripts Disponibles

```bash
pnpm dev        # Inicia el servidor de desarrollo
pnpm build      # Construye la aplicación para producción
pnpm preview    # Previsualiza la build de producción
pnpm lint       # Ejecuta el linter
```

## 🎯 Funcionalidades Principales

### Gestión de Productos
- Visualización en grid responsive
- Búsqueda y filtrado avanzado
- Paginación con control de items
- Vista detallada de cada producto

### Carrito de Compras
- Agregar/remover productos
- Actualizar cantidades
- Cálculo automático de totales
- Persistencia con localStorage

### Panel de Administración
- Crear nuevos productos
- Editar productos existentes
- Eliminar con confirmación
- Validación de formularios

### Sistema de Autenticación
- Login con Context API
- Rutas protegidas
- Persistencia de sesión
- Redirección automática

## 🌐 Configuración de MockAPI

1. Crear cuenta en [MockAPI.io](https://mockapi.io/)
2. Crear un proyecto y endpoint `products`
3. Configurar el schema:

```json
{
  "title": "string",
  "price": "number",
  "description": "string",
  "category": "string",
  "image": "string",
  "rating": {
    "rate": "number",
    "count": "number"
  }
}
```

## 🚀 Despliegue

### Vercel
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod
```

## 📱 Responsive Design

- ✅ Desktop (1920x1080+)
- ✅ Laptop (1366x768)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667+)


## 📄 Licencia

Proyecto educativo para aprendizaje de React.

---
