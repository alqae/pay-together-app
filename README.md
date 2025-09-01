# Pay Together App

This repository contains both the **frontend** and **backend** of Pay Together App.

## 📂 Structure

- `web/` → Frontend application (Angular 20)
- `server/` → Backend application (NestJS 11)

## ⚙️ Node.js version

Both projects run with the same Node.js version defined in [`.nvmrc`](.nvmrc).
We recommend using [NVM](https://github.com/nvm-sh/nvm) to ensure the correct version.

### Using NVM

Run the following command at the root of the project:

```bash
nvm use
````

If you don’t have the required Node.js version installed, run:

```bash
nvm install
```

This will automatically set the correct version based on `.nvmrc`.

## 📦 Docker

### Using Docker

Run the following command at the root of the project:

```bash
docker-compose up -d
```

This will start all the services defined in [docker-compose.yml](docker-compose.yml).

### Stopping Docker

Run the following command at the root of the project:

```bash
docker-compose down
```

## 📚 Preguntas técnicas

### 1. Microservicios

**Pregunta:** Si el sistema creciera y necesitara pasar de monolito a microservicios, ¿cómo dividirías los servicios y qué consideraciones de comunicación implementarías?

**Respuesta:**
En la transicion de monolito a microservicios, lo primero seria dividir las areas funcionales, un area seria usuarios/autenticacion, una de servicios, otra de reservas/transacciones, pagos, notificaciones, y implementar un servicio de reporting (para analisis y estadisticas). cada microservicio tendria una responsabilidad clara y datos propios asi se evita crear dependencias fuertes. La comunicacion entre ellos por gRPC para operaciones que requieren respuesta inmediata y eventos con Kafka o RabbitMQ para procesos desacoplados como notificaciones o actualizaciones de estados. adicionalmente meter un API Gateway para unificar el acceso externo y tema de autenticacion, versionado, rate limiting y logging.

### 2. Optimización en la nube

**Pregunta:** Supongamos que tu aplicación corre en AWS. ¿Qué servicios usarías y por qué?

**Respuesta:**

* **Autenticación segura:** [AWS Cognito](https://aws.amazon.com/cognito/) → Permite integrarse con OAuth2/OpenID y facilita el SSO si se necesita en el futuro.
* **Base de datos:** [AWS RDS](https://aws.amazon.com/rds/) → por catalogo de opciones y es muy completo para escalar una base de datos grande tiene backup y autoescalado.
* **Cache y escalabilidad:** [AWS ElastiCache](https://aws.amazon.com/elasticache/) → Buena opcion para pasar de redis y si se quiere escalar basta con agregar mas nodos.
* **Balanceo de carga:** [AWS ELB](https://aws.amazon.com/elasticloadbalancing/) → distribuye tráfico entre instancias EC2, contenedores ECS o pods de Kubernetes la hace ideal para desplegar microservicios tipo serverless y apps en contenedores.

### 3. Buenas prácticas de seguridad

**Pregunta:** Menciona al menos 3 prácticas clave que aplicarías para garantizar seguridad en backend, frontend y despliegue en la nube.

**Respuesta:**

* **Backend:**
  1. Rate limiting -> limitar la cantidad de solicitudes por IP para evitar ataques de fuerza bruta o DDoS.
  2. CORS estricta -> permitir solo los orígenes confiables y métodos necesarios.
  3. Validación y sanitización de inputs -> evitar inyecciones SQL/NoSQL, XSS y otros ataques de inyección.

* **Frontend:**
  1. Escape de datos y protección XSS -> nunca insertar directamente datos del backend en el DOM sin sanitizar.
  2. Uso seguro de cookies / almacenamiento local -> HttpOnly, Secure y SameSite para tokens de sesión.
  3. Protección de rutas sensibles -> asegurar que solo usuarios autenticados puedan acceder a ciertas vistas y datos.

* **Despliegue/Nube:**
  1. Seguridad de la infraestructura y secretos → usar IAM roles, gestionar secretos con AWS Secrets Manager, GitHub Secrets o parecidos.
  2. HTTPS/TLS -> para tráfico y cifrado de datos sensibles en la base de datos.
  3. Monitoreo y alertas -> logs centralizados, alertas de actividad sospechosa y políticas de backup.

### 4. PostgreSQL vs NoSQL

**Pregunta:** ¿En qué escenarios usarías PostgreSQL y en cuáles una base NoSQL? Explica con ejemplos concretos.

**Respuesta:**
Si requiere consistencia fuerte, integridad de datos y relaciones complejas. por ejemplo: un sistema de reservas o de facturación, donde necesito integridad para garantizar que un pago y una reserva se registren juntos o no se registren. ahora cuando necesito escalar masivamente, almacenar datos muy flexibles o sin esquema fijo y donde la consistencia puede ser eventual. por ejemplo: un módulo de notificaciones que guarda mensajes con estructuras variables.

### 5. Despliegue

**Pregunta:** Si tuvieras que desplegar esta app en producción, ¿qué pipeline CI/CD diseñarías para asegurar calidad, testeo y despliegue continuo?

**Respuesta:**
1. Preparar workflows (CI) para pruebas unitarias, linting, e2e y de integracion
2. Branch protection rules para asegurar que solo se puedan hacer merge de pull requests que pasen las pruebas
3. Configurar los workflows (CI) para ejecutarse en cada commit (husky pre-commit) y en el pull request
4. Ahora si el despliegue apartar dominio y subdominio para desarrollo, staging y producción, vps para desarrollo y staging y un cluster de kubernetes para producción (si se requiere)
5. Configurar ambientes en la nube (por ejemplo AWS) para despliegue continuo
6. Configurar workflow para ejecutarse al merge de pull request desplegar en el ambiente correspondiente (a la rama como tal)
7. Configurar status page para monitoreo de los ambientes
