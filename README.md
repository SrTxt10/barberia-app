# BarberiaApp

App local para una barberia hecha con Python Flask y Excel como base de datos.

## Funciones

- Registro de clientes con nombre y cedula.
- Numero de socio automatico.
- Inicio de sesion con numero de socio.
- Panel con datos del cliente, historial de cortes y reservas.
- Creacion de reservas.
- Carga de cortes realizados.
- Base de datos en `data/barberia.xlsx`.

## Ejecutar

1. Instalar Python 3.
2. Abrir PowerShell en esta carpeta.
3. Si `py` no funciona, instalar Python desde `https://www.python.org/downloads/` y marcar la opcion `Add python.exe to PATH`.
4. Crear un entorno virtual:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
```

5. Instalar dependencias:

```powershell
pip install -r requirements.txt
```

6. Iniciar la app:

```powershell
flask --app app run --debug
```

Tambien se puede iniciar con:

```powershell
.\.venv\Scripts\python.exe app.py
```

7. Abrir en el navegador:

```text
http://127.0.0.1:5000
```

El archivo Excel se crea automaticamente la primera vez que se inicia la app.

## Datos de muestra

La app incluye una base demo en `data/barberia.xlsx`.

Socios para probar:

- `1001` - Carlos Silva
- `1002` - Mateo Rodriguez
- `1003` - Nicolas Pereira

## Mostrar desde la web

Para crear una URL publica temporal:

```powershell
.\iniciar_web.bat
```

El script inicia Flask y abre un tunel de Cloudflare. Copiar la URL `https://...trycloudflare.com` que aparece en la consola.

Una direccion personalizada como `ZonaBarbers.com` requiere comprar el dominio y configurarlo en un hosting o en Cloudflare.

## Hosting gratis recomendado

Para una demo gratis con Flask y Excel, la opcion mas simple es PythonAnywhere.

Pasos resumidos:

1. Crear una cuenta gratis en `https://www.pythonanywhere.com/`.
2. Abrir una consola Bash en PythonAnywhere.
3. Clonar el repo:

```bash
git clone https://github.com/SrTxt10/barberia-app.git
cd barberia-app
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

4. En la pestaña Web, crear una app Flask manual.
5. En el archivo WSGI de PythonAnywhere, apuntar al proyecto y usar `wsgi.py`.
6. Recargar la app desde la pestaña Web.

La URL gratuita sera parecida a:

```text
https://tuusuario.pythonanywhere.com
```

## Alternativa GitHub Pages + Supabase

GitHub Pages solo aloja sitios estaticos, asi que no puede ejecutar Flask ni escribir en Excel. Para usar GitHub como hosting 24/7, se agrego una version estatica en `docs/` que usa Supabase como base de datos.

Archivos principales:

- `docs/index.html`
- `docs/app.js`
- `docs/config.js`
- `docs/supabase-schema.sql`

URL esperada al activar GitHub Pages:

```text
https://SrTxt10.github.io/barberia-app/
```
