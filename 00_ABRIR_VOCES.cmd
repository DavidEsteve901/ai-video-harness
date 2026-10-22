@echo off
chcp 65001 >nul
title Biblioteca de voces - cierra esta ventana para parar
echo Abriendo la biblioteca de voces en el navegador...
echo Tus favoritas se guardan en Biblioteca_Voces\FAVORITAS.md para que el agente las vea.
echo.
"C:\Herramientas\local-voice-studio\.venv\Scripts\python.exe" -X utf8 "%~dp0Biblioteca_Voces\herramientas\servidor_voces.py"
if errorlevel 1 (
  echo.
  echo No se pudo iniciar. Comprueba que existe C:\Herramientas\local-voice-studio\.venv
  pause
)
