@echo off
cd /d "%~dp0"

if not exist ".venv\Scripts\python.exe" (
  echo No existe .venv. Ejecuta primero:
  echo py -m venv .venv
  echo .\.venv\Scripts\python.exe -m pip install -r requirements.txt
  pause
  exit /b 1
)

where cloudflared >nul 2>nul
if errorlevel 1 (
  if exist "C:\Program Files (x86)\cloudflared\cloudflared.exe" (
    set "CLOUDFLARED=C:\Program Files (x86)\cloudflared\cloudflared.exe"
  ) else if exist "C:\Program Files\cloudflared\cloudflared.exe" (
    set "CLOUDFLARED=C:\Program Files\cloudflared\cloudflared.exe"
  ) else (
    echo No se encontro cloudflared. Instalalo con:
    echo winget install --id Cloudflare.cloudflared -e
    pause
    exit /b 1
  )
) else (
  set "CLOUDFLARED=cloudflared"
)

echo Iniciando Zona Barbers en http://127.0.0.1:5000
start "Zona Barbers Flask" /min ".venv\Scripts\python.exe" -m flask --app app run --host 127.0.0.1 --port 5000

echo.
echo Generando URL publica. Copia la direccion https://...trycloudflare.com que aparezca abajo.
echo.
"%CLOUDFLARED%" tunnel --url http://127.0.0.1:5000 --no-autoupdate
