# Zona Barbers en GitHub Pages

Esta carpeta contiene una version estatica de la app para publicar con GitHub Pages.

## Publicar en GitHub Pages

1. Entrar al repo en GitHub.
2. Ir a `Settings` > `Pages`.
3. En `Build and deployment`, elegir:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/docs`
4. Guardar.

La URL sera parecida a:

```text
https://SrTxt10.github.io/barberia-app/
```

## Configurar Supabase

1. Crear un proyecto en `https://supabase.com`.
2. Ir a `SQL Editor`.
3. Copiar y ejecutar el contenido de `supabase-schema.sql`.
4. Ir a `Project Settings` > `API`.
5. Copiar `Project URL` y la `anon public key`.
6. Editar `config.js`:

```js
window.ZONA_BARBERS_CONFIG = {
  supabaseUrl: "https://TU-PROYECTO.supabase.co",
  supabaseAnonKey: "TU-ANON-KEY"
};
```

## Importante

Esta version no usa Flask ni Excel. GitHub Pages solo publica archivos estaticos, por eso la base de datos queda en Supabase.

Las politicas SQL incluidas son abiertas para demo. Para uso real conviene agregar autenticacion y politicas mas estrictas.
