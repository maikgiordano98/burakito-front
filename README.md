# Burakito Frontend

Frontend para contador de partidas de Burako. Permite crear partidas, cargar rondas con canastas, muerto y cortes, y ver historial con totales.

## Tecnologías

- **React** 19 – interfaz de usuario
- **Vite** 7 – bundler y dev server
- **React Router** 7 – rutas (HashRouter para GitHub Pages)
- **Tailwind CSS** 4 – estilos
- **Supabase (JavaScript client)** – persistencia en base de datos (PostgreSQL en la nube)

## Base de datos

La app se conecta a **[Supabase](https://supabase.com)** para guardar partidas y rondas en PostgreSQL. Si no se configuran las variables de entorno de Supabase, usa **localStorage** del navegador como respaldo (datos solo en ese dispositivo).


## Comandos

| Acción | Comando |
|--------|--------|
| **Levantar en local** | `npm run dev` |
| **Build para producción** | `npm run build` |
| **Desplegar a producción** | `npm run deploy` |

`npm run deploy` ejecuta el build y publica la carpeta `dist` en GitHub Pages (según `package.json`).
