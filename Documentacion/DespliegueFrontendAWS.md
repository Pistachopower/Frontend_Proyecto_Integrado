En el código Vue, cambia las URLs de las peticiones para que apunten a la IP pública o dominio del backend (por ejemplo, http://IP_BACKEND:8000/api/...).

Generamos los archivos listos para producción en local con el comando: pnpm build

Crear una instancia EC2 en AWS
    Actualiza los paquetes 

Usa SCP para copiar la carpeta dist a la instancia EC2

Importante: borra la carpeta dist si tienes uno nuevo de la instancia

Entra en la terminal, y escribe el siguiente comando:
scp -i /home/nelson/Descargas/Frontend_ProyectoIntegrado.pem -r dist/ ec2-user@3.225.154.212:/home/ec2-user

Reemplaza ruta/a/mi/clave.pem por la ruta real del archivo .pem.
IP_DE_INSTANCIA por la IP pública de tu instancia.

Conéctate por SSH a la instancia y verifica que los archivos estén en la instancia EC2:
ssh -i ruta/a/mi/clave.pem ubuntu@IP_DE_INSTANCIA

Importante: ejecuta el comando donde está el archivo .pen 

Instala Nginx en tu instancia EC2
sudo apt update
sudo apt install nginx

Copia la carpeta dist al directorio de Nginx 
sudo mv /home/ubuntu/dist/* /var/www/html/
sudo cp -r /home/ec2-user/dist/* /usr/share/nginx/html/ (AWS Linux)

Importante: si tienes un nuevo dist elimina lo que hay en html con:sudo rm -rf /var/www/html/* | sudo rm -rf /usr/share/nginx/html/*

Asegúrate de que los archivos sean accesibles por Nginx:
sudo chown -R www-data:www-data /var/www/html/
sudo chown -R nginx:nginx /usr/share/nginx/html/ (AWS Linux)

Reinicia Nginx
sudo systemctl restart nginx

Entra a la instancia de backend (por SSH) y edita el archivo settings.py de tu proyecto Django para que acepte las ip del frontend y de la instancia backend.

En el código Vue, cambia las URLs de las peticiones para que apunten a la IP pública o dominio del backend (por ejemplo, http://IP_BACKEND:8000/api/...).

Importante: recueda que cada vez que hagas cambios en el frontend debes hacer el pnpm build 
sudo cp -r /home/ec2-user/dist/* /usr/share/nginx/html/
sudo chown -R nginx:nginx /usr/share/nginx/html/
sudo chmod -R 755 /usr/share/nginx/html/
sudo systemctl restart nginx    


Solución al error 404 en rutas internas de Vue (Nginx + SPA)
Problema
Al acceder directamente a rutas internas del frontend Vue (por ejemplo, /categoria/1), el navegador mostraba un error 404 Not Found de Nginx. Sin embargo, rutas como /login o /registro funcionaban correctamente al navegar desde la aplicación.

Causa:
Nginx no estaba configurado para redirigir todas las rutas de la Single Page Application (SPA) al archivo index.html. Por eso, al acceder directamente a una ruta dinámica, Nginx intentaba buscar un archivo o carpeta física y, al no encontrarlo, devolvía 404.

Pasos para la solución
Identificar el archivo de configuración de Nginx en la instancia AWS Linux (por ejemplo, /etc/nginx/nginx.conf).

Abrir el archivo con nano:sudo nano /etc/nginx/nginx.conf

Ubicar el bloque activo del servidor (server { ... }) correspondiente al frontend.

Agregar el siguiente bloque justo después de la línea root:
location / {
    try_files $uri $uri/ /index.html;
}

Esto le indica a Nginx que, si no encuentra un archivo o carpeta, debe servir index.html para que Vue Router maneje la navegación.

Guardar los cambios en nano (Ctrl+O, Enter, Ctrl+X).

Recargar la configuración de Nginx para aplicar los cambios:
sudo systemctl reload nginx

Verificar que ahora todas las rutas del frontend funcionan correctamente, incluyendo rutas dinámicas como /categoria/1.



