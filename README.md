# Pizza Vicente — estructura V1

Primera versión estructural de la web gastronómica de Pizza Vicente.

## Alcance actual

- HTML, CSS y JavaScript sin framework.
- Sin Shopify.
- Sin Protocol Data.
- Sin checkout real.
- Datos mockeados y contratos simples para que la estructura pueda conectarse más adelante.

## Páginas

- `index.html`: inicio estilo perfil, selector Delivery/Retiro, ubicación, banner, tabs y catálogo.
- `producto.html`: detalle de producto/oferta, programación, upsells, aclaraciones y sticky de compra.

## Estructura

```text
/
├── index.html
├── producto.html
└── assets/
    ├── css/
    │   └── styles.css
    └── js/
        ├── catalog.js
        ├── home.js
        └── product.js
```

## Ejecutar localmente

No requiere build. Abrir con cualquier servidor estático para evitar restricciones del navegador al cargar módulos/recursos.

Ejemplo:

```bash
python -m http.server 8080
```

Luego abrir `http://localhost:8080`.

## Preparación para futuras integraciones

Los productos, ofertas, badges, tabs, banner y secciones comerciales están representados como datos en `assets/js/catalog.js`. La UI consume esos datos sin acoplarse a un proveedor específico. La migración futura podrá reemplazar esa capa por Shopify y, cuando corresponda, por Protocol Data sin reconstruir la interfaz.
