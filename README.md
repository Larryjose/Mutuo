# Mutuo

## Pasos para Ejecutar la Aplicación

Siga estos pasos para instalar las dependencias y ejecutar la aplicación en tu entorno local.

### 1. Instalar Dependencias

Antes de ejecutar la aplicación, asegúrese de tener Node.js y npm instalados en su sistema. Luego, segui estos pasos:

```bash
# Clonar el repositorio
git clone https://github.com/Larryjose/Mutuo.git

# Cambiarse al directorio del proyecto
cd Mutuo

# Instalar dependencias
npm install
```
### 2. Agregar variables de entorno
Crear el archivo .env dentro de la carpeta /Mutuo y agregar las siguientes variables

```bash
URL_MONGO_MUTUO = 'string url para conectar tu base de datos MongoDB'
SENDER_EMAIL = 'gmail el cual enviará mails'
TOKEN_MAIL = 'token gmail'
TEST_DESTINATION_MAIL = 'mail para realizar pruebas'
```

### 3. Ejecutar la Aplicación
Después tener las variables de entorno, podemos ejecutar la aplicación utilizando el siguiente comando:

```bash
npm start
```

### 4. Verificar en el Navegador
Abre tu navegador web y visita http://localhost:3000. Deberías ver la aplicación en funcionamiento.


