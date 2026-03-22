Generamos los archivos listos para producción en local con el comando: pnpm build

Crear una instancia EC2 en AWS
    Actualiza los paquetes 

Usa SCP para copiar la carpeta dist a la instancia EC2

Importante: borra la carpeta dist si tienes uno nuevo de la instancia

Entra en mi proyecto en la terminal, y escribe el siguiente comando:
scp -i ruta/a/mi/clave.pem -r dist/ ubuntu@IP_DE_INSTANCIA:/home/ubuntu/

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

Importante: si tienes un nuevo dist elimina lo que hay en html con:sudo rm -rf /var/www/html/*

Asegúrate de que los archivos sean accesibles por Nginx:
sudo chown -R www-data:www-data /var/www/html/

Reinicia Nginx
sudo systemctl restart nginx

Entra a la instancia de backend (por SSH) y edita el archivo settings.py de tu proyecto Django para que acepte las ip del frontend y de la instancia backend.

En el código Vue, cambia las URLs de las peticiones para que apunten a la IP pública o dominio del backend (por ejemplo, http://IP_BACKEND:8000/api/...).

Importante: recueda que cada vez que hagas cambios en el frontend debes hacer el pnpm build.


