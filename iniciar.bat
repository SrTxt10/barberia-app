@echo off
cd /d "%~dp0"
if not exist ".venv\Scripts\python.exe" (
  echo No existe .venv. Crea el entorno virtual e instala requirements.txt primero.
  pause
  exit /b 1
)
".venv\Scripts\python.exe" app.py
