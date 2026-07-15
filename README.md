# PruebaTekProvider
Prueba Técnica — Ingeniero de Software (Full-Stack .NET + React) 
Puesto: Ingeniero de Software Stack: React · .NET 8 (FastEndpoints) · EF Core · SQL Server / 
PostgreSQL Modalidad: Take-home + entrevista de defensa técnica Tiempo sugerido: 4 a 6 

---

## Tabla

|Entidad Cliente  |  Campo        |
|     ---         |    ---        |
|Id               |   GUID / int  |
|Nombre           |   string      |
|RFC (o TaxId)    |   string      |
|Email            |   string      |
|Telefono         |   string      |
|Estado           |   enum        |
|FechaAlta        |   datetime    |

 --> FechaModificacion datetime
 --> UsuarioModificacion string

- Añadiria campos para auditoria como Usuario que Modifica, fecha de modificacion

- Tambien no hice la validacion del RFC, talvez con un regex, o una funcion seria lo ideal, tambien se puede considerar si la persona es Fisica o Moral, para afinar esa validacion.

Requisitos técnicos 
- Backend (.NET 8)          OK
- FastEndpoints para los endpoints (REPR pattern).   OK
- Separación de capas clara.                         OK
- EF Core con SQL Server o PostgreSQL + migraciones. OK
- Validadores separados de la lógica de endpoint.    OK, Pero no hay un validador como FluentValidation, solo en el dominio
- Middlewares: al menos manejo global de errores (respuestas de error consistentes).    OK
- Seguridad: autenticación (JWT o API Key) y autorización en los endpoints;             OK, Se hizo un usuario generico, prueba

## Stack

| Componente | Tecnología |
|---|---|
| Framework | .NET 8 (ASP.NET Core Web API) Asi se solicitó |
| Estilo de API | **FastEndpoints 8.2** (patrón REPR: Request → Endpoint → Response) |
| ORM | Entity Framework Core 8 |
| Base de datos | PostgreSQL (proveedor `Npgsql.EntityFrameworkCore.PostgreSQL` 8.0.11) |
| Autenticación | JWT Bearer (`Microsoft.AspNetCore.Authentication.JwtBearer`) |
| Autorización | Políticas dinámicas por permiso (`Policies(...)` + `IAuthorizationPolicyProvider`) |
| Documentación | Swagger vía `FastEndpoints.Swagger`  |
| Errores | `IExceptionHandler` + `ProblemDetails`  |
| Contenedores | Dockerfile incluido (en Visual) Lo use para solo para la base |

## Estructura del proyecto

```
PruebaTekProvider/
├── Program.cs                  # Composición: DI, JWT, CORS, Swagger, exception handlers
├── Api/                        # Capa de presentación
│   ├── Endpoints/              #   FastEndpoints (REPR): Auth/LoginEndpoint, Clientes/{Crear,Obtener,Listar,Editar,CambiarEstado}
│   ├── Authorization/          #   PolicyProvider, PermissionHandler, DTOs de auth
│   └── Middleware/             #   GlobalExceptionHandler, ConcurrencyExceptionHandler, IdempotencyMiddleware
├── Core/                       # Capa de dominio y aplicación (sin dependencias de infraestructura)
│   ├── Tek/Domain/             #   Entidad Cliente (factory + invariantes), enum Estado
│   ├── Tek/Application/        #   ClienteService, DTOs, mappings, interfaces (IClienteRepository, IClienteService)
│   ├── Common/                 #   Result<T>, PagedResult<T>, ParametrosPaginacion, extensiones de paginación
│   └── Shared/                 #   Value objects (Telefono), DomainException, Permissions, RolePermissions
└── Infrastructure/             # Capa de acceso a datos
    ├── Data/                   #   AppDbContext
    ├── Tek/                    #   ClienteRepository, ClienteConfiguration (Fluent API)
    └── Migrations/             #   Migraciones EF Core (InitialCreate)
```

El flujo de dependencias es: `Api → Core ← Infrastructure`. 

## Endpoints

| Método | Ruta | Permiso requerido |
|---|---|---|
| POST | `/api/auth/login` | Anónimo |
| POST | `/api/v1/cliente` | `cliente.crear` |
| GET | `/api/v1/cliente/{id}` | `cliente.ver` |
| GET | `/api/v1/cliente?page=&pageSize=&buscar=` | `cliente.ver` |
| PUT | `/api/v1/cliente/{id}` | `cliente.editar` |
| PUT | `/api/v1/cliente/{id}/cambio` | `cliente.editar` |

## Cómo ejecutar


### Base de Datos

```bash
# Requiere PostgreSQL local (puerto 5432) — cadena en appsettings.json ("BASE")
dotnet ef migrations add InitialCreate
Update-Database
```

### API
```bash
dotnet run
```

## Front
```bash
npm run dev  
```

Para probar los endpoints protegidos: `POST /api/auth/login` → usar el token como `Authorization: Bearer <token>`.
---

### Detalle
- LoginEndpoint -> falta integrar Identity/`SignInManager`.
- Program ->  clave JWT con fallback hardcodeado;

## Frontend (React) 
• Pantalla de listado con búsqueda y paginación.  OK
• Formulario de alta/edición con manejo de estado (hooks) y validación en cliente. OK
• Consumo del API con manejo de estados de carga, éxito y error
• Acción de cambio de estado.