# LibreMercado - E-commerce React

Un proyecto de e-commerce desarrollado con React y JavaScript como parte de un curso de React. Esta aplicación implementa las funcionalidades básicas de una tienda online moderna con carrito de compras, autenticación y gestión de productos.

## 🚀 Características

- **Catálogo de productos** con búsqueda y filtrado por categorías
- **Carrito de compras** con persistencia en localStorage
- **Autenticación de usuarios** con Context API
- **Detalles de producto** con imágenes y descripción completa
- **Proceso de checkout** completo
- **Diseño responsive** con Tailwind CSS
- **Componentes reutilizables** con shadcn/ui
- **Navegación con React Router**
- **Gestión de estado** con Context API y Zustand

## 🛠️ Tecnologías Utilizadas

- **React 19** - Biblioteca principal de JavaScript
- **React Router DOM** - Navegación entre páginas
- **Tailwind CSS** - Framework de CSS para estilos
- **shadcn/ui** - Componentes de UI pre-construidos
- **Radix UI** - Componentes primitivos accesibles
- **Lucide React** - Iconos
- **Framer Motion** - Animaciones
- **Vite** - Herramienta de build y desarrollo
- **Zustand** - Gestión de estado adicional

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── Layout/
│   │   ├── Footer.jsx          # Pie de página
│   │   ├── Layout.jsx          # Layout principal
│   │   ├── Navbar.jsx          # Barra de navegación
│   │   └── Sidebar.jsx         # Barra lateral
│   └── Product/
│       ├── ProductCard.jsx     # Tarjeta de producto
│       └── ProductList.jsx     # Lista de productos
├── context/
│   ├── AuthContext.jsx         # Contexto de autenticación
│   └── CartContext.jsx         # Contexto del carrito
├── hooks/
│   └── useApi.js              # Hook personalizado para API
├── pages/
│   ├── Cart.jsx               # Página del carrito
│   ├── Checkout.jsx           # Página de checkout
│   ├── Home.jsx               # Página principal
│   ├── Login.jsx              # Página de login
│   ├── NotFound.jsx           # Página 404
│   └── ProductDetail.jsx      # Detalle del producto
├── utils/
│   ├── constants.js           # Constantes de la aplicación
│   ├── helpers.js             # Funciones auxiliares
│   └── mockdata.js            # Datos de prueba
├── App.jsx                    # Componente principal
├── main.jsx                   # Punto de entrada
└── index.css                  # Estilos globales
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o pnpm

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone [url-del-repositorio]
   cd mi-app
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   # o
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   pnpm dev
   # o
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

## 📋 Scripts Disponibles

- `pnpm dev` - Inicia el servidor de desarrollo
- `pnpm build` - Construye la aplicación para producción
- `pnpm preview` - Previsualiza la build de producción
- `pnpm lint` - Ejecuta el linter para revisar el código

## 🎯 Funcionalidades Principales

### 🏠 Página Principal
- Visualización de todos los productos
- Búsqueda por nombre o categoría
- Filtrado por categorías
- Navegación intuitiva

### 🛒 Carrito de Compras
- Agregar/remover productos
- Actualizar cantidades
- Cálculo automático de totales
- Persistencia en localStorage
- Descuento del 10% aplicado automáticamente

### 🔐 Autenticación
- Sistema de login básico
- Gestión de estado de usuario
- Protección de rutas (si aplica)

### 📱 Diseño Responsive
- Adaptable a dispositivos móviles
- Interfaz moderna y limpia
- Componentes accesibles

## 🎨 Componentes Principales

### Layout Components
- **Navbar**: Navegación principal con búsqueda y carrito
- **Sidebar**: Navegación lateral con categorías
- **Footer**: Información de la tienda
- **Layout**: Wrapper principal de la aplicación

### Product Components
- **ProductCard**: Tarjeta individual de producto
- **ProductList**: Grid de productos con loading states

### Context Providers
- **AuthContext**: Manejo de autenticación
- **CartContext**: Gestión completa del carrito

## 🔧 Configuración Adicional

### Tailwind CSS
El proyecto utiliza Tailwind CSS con configuración personalizada para:
- Colores del tema
- Tipografía
- Espaciado
- Componentes personalizados

### shadcn/ui
Componentes pre-construidos incluidos:
- Botones y formularios
- Diálogos y modales
- Navegación y menús
- Cards y layouts

## 📚 Conceptos de React Aplicados

Este proyecto demuestra el uso de:
- **Componentes funcionales** con hooks
- **useState y useEffect** para gestión de estado
- **useContext** para estado global
- **Custom hooks** para lógica reutilizable
- **React Router** para navegación SPA
- **Conditional rendering** y listas
- **Event handling** y formularios
- **Props y prop drilling** vs Context API

## 🚀 Próximas Mejoras

- [ ] Integración con API real
- [ ] Autenticación con JWT
- [ ] Pasarela de pagos
- [ ] Gestión de inventario
- [ ] Wishlist de productos
- [ ] Reseñas y calificaciones
- [ ] Panel de administración


## 📄 Licencia

Este proyecto es parte de un curso educativo de React y está disponible para fines de aprendizaje.

## 👨‍💻 Autor

Desarrollado como parte del curso de React con JavaScript.

---

**¡Gracias por revisar este proyecto de e-commerce con React!** 🛍️

