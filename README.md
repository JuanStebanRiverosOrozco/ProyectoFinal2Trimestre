# 🎬 Sistema de Gestión de Cine (CLI)

> Aplicación en Node.js + TypeScript — Interfaz por consola usando `@inquirer/prompts` y tablas con `cli-table3`.

---

## 📖 Descripción

Aplicación de consola que simula la gestión de un cine completo:

* Registro / login de usuarios (roles: `admin`, `vendedor`, `cliente`).
* Gestión de **Películas**, **Salas** y **Funciones**.
* Venta de **Entradas** con selección de asientos por función.
* Venta de **Comida** (productos y **combos** con descuento).
* Reportes y facturas en consola (formatters con `cli-table3`).


---

## ⚙️ Requisitos

* Node.js >= 16
* npm
* (Dependencias): `@inquirer/prompts`, `cli-table3`, `date-fns`
* (Dev) `typescript`, `ts-node` si usas ejecución directa sin compilar.

Instala las dependencias:

```bash
npm install @inquirer/prompts cli-table3 date-fns
```

Sugerencia `package.json` (scripts):

```json
{
  "scripts": {
    "start": "ts-node src/app/main.ts",
  }
}
```

---

## ▶️ Ejecutar la app

Modo desarrollo (sin compilar):

```bash
npx ts-node src/app/main.ts
---

## 🔐 Flujo completo (registro → login → menú por rol) — Capturas de consola

### Inicio: Login / Registro (`mostrarMenuLogin`)

```
👤 Bienvenido
  ◉ 📝 Registrarse
    🔘 🔑 Iniciar sesión
    ◯ ❌ Salir
```

#### Ejemplo — Registrarse

```
Nombre: Juan Pérez
Correo: juan@example.com
Contraseña: ******

Rol:
  ◉ Administrador
    Cliente
    Vendedor

✅ Usuario Juan Pérez registrado (admin)
```

#### Ejemplo — Iniciar sesión

```
Nombre:Juan Pérez
Correo: juan@example.com
Contraseña: ******

✅ Bienvenido Juan Pérez (admin)
```

---

## 👑 Menú Principal por rol

### Menú Admin (`usuario.getRol() === "admin"`)

```
👤 Juan Pérez (admin) - Menú
```

Opciones:

```
🎬 Gestionar Películas
🏟️ Gestionar Salas
📅 Gestionar Funciones
🎟️ Gestionar Ventas
🍿 Gestionar Comida
🚪 Cerrar sesión
❌ Salir del sistema
```

### Menú Vendedor (`usuario.getRol() === "vendedor"`)

```
👤 Ana (vendedor) - Menú
```

Opciones:

```
🎟️ Vender Boletos
🍿 Vender Comida
🚪 Cerrar sesión
❌ Salir del sistema
```

### Menú Cliente (`usuario.getRol() === "cliente"`)

```
👤 Carlos (cliente) - Menú
```

Opciones:

```
🎟️ Comprar Entradas
🍿 Comprar Comida
🚪 Cerrar sesión
❌ Salir del sistema
```

---

## Submenús y ejemplos

### 🎞️ Gestión de Películas (admin)

```
📄 Listar películas
➕ Crear película
🗑️ Eliminar película
🔙 Volver al menú principal
```

**Lista de ejemplo (PeliculaFormatter):**

```
┌───────────────┬─────────────────────────┬────────────────┬────────────────┬────────────────┐
│ ID            │ Título                  │ Duración (min) │ Clasificación  │ Género         │
├───────────────┼─────────────────────────┼────────────────┼────────────────┼────────────────┤
│ 1             │ Avengers: Endgame       │ 180            │ PG-13          │ Acción         │
│ 2             │ Toy Story 4             │ 100            │ G              │ Animación      │
└───────────────┴─────────────────────────┴────────────────┴────────────────┴────────────────┘
```

### 🏟️ Gestión de Salas (admin)

```
📄 Listar salas
➕ Crear sala
🗑️ Eliminar sala
🔙 Volver al menú principal
```

**Lista de ejemplo (SalaFormatter):**

```
┌───────────────┬──────────────┬───────┬──────────┐
│ ID            │ Nombre       │ Tipo  │ Capacidad│
├───────────────┼──────────────┼───────┼──────────┤
│ 1             │ Sala 1       │ 2D    │ 20       │
│ 2             │ Sala VIP     │ VIP   │ 12       │
└───────────────┴──────────────┴───────┴──────────┘
```

### 📅 Gestión de Funciones (admin)

```
📄 Listar funciones
➕ Crear función
🗑️ Eliminar función
🔙 Volver al menú principal
```

**Lista de ejemplo (FuncionFormatter):**

```
┌───────────────┬─────────────────────────┬─────────┬──────────────────────────────┬──────────────┬────────────┐
│ ID            │ Película                │ Sala    │ Fecha                        │ Precio       │ Disponibles│
├───────────────┼─────────────────────────┼─────────┼──────────────────────────────┼──────────────┼────────────┤
│ 1             │ Avengers: Endgame       │ Sala 1  │ 2025-10-10 20:00:00          │ $12,000      │ 60         │
│ 2             │ Toy Story 4             │ Sala VIP│ 2025-10-11 18:00:00          │ $10,000      │ 12         │
└───────────────┴─────────────────────────┴─────────┴──────────────────────────────┴──────────────┴────────────┘
```

### 🎟️ Gestión de Ventas (admin)

```
📄 Listar TODAS las ventas
🔙 Volver
```

**Listado de ejemplo (VentaFormatter):**

```
┌───────────────┬──────────────┬────────────────────┬───────────────┬───────────┬────────────────┬────────────────┐
│ ID            │ Cliente      │ Correo             │ Película      │ Entradas  │ Asientos       │ Total          │
├───────────────┼──────────────┼────────────────────┼───────────────┼───────────┼────────────────┼────────────────┤
│ Venta-1       │ Juan Pérez   │ juan@example.com   │ Avengers      │ 2         │ A1, A2         │ $28,560         │
│ Venta-2       │ Pedro Gómez  │ pedro@gmail.com    │ Toy Story 4   │ 3         │ B1, B2, B3     │ $35,700         │
└───────────────┴──────────────┴────────────────────┴───────────────┴───────────┴────────────────┴────────────────┘
```

### 🍿 Gestión de Comida (admin)

```
➕ Registrar producto
➕ Registrar combo
📄 Listar productos y combos
📄 Listar TODAS las ventas de comida
🔙 Volver
```

**Listado de productos/combos (ComidaFormatter):**

```
┌───────────────┬──────────────────────┬────────┬──────────────┬────────────┬───────────────┐
│ ID            │ Nombre               │ Tipo   │ TipoCombo    │ Precio     │ Items         │
├───────────────┼──────────────────────┼────────┼──────────────┼────────────┼───────────────┤
│ Comida-1      │ Crispetas Grandes    │ producto│ -           │ $10,000    │ -             │
│ Comida-2      │ 2 Gaseosas           │ producto│ -           │ $8,000     │ -             │
│ Comida-3      │ Combo Familiar       │ combo  │ familiar     │ $25,000    │ Crispetas...,2 Gaseosas... │
└───────────────┴──────────────────────┴────────┴──────────────┴────────────┴───────────────┘
```

---

## 🧾 Ejemplos de facturas

### Factura de venta de entradas (VentaFormatter)

```
🧾 FACTURA DE VENTA
----------------------------------------
ID Venta: Venta-1
Cliente: Juan Pérez
Correo: juan@example.com
Función: Avengers: Endgame
Entradas: 2
Asientos: A1, A2
----------------------------------------
Precio Unitario: $12,000
Subtotal: $24,000
IVA (19%): $4,560
TOTAL: $28,560
```

### Factura de comida (ComidaFormatter)

```
🧾 FACTURA COMIDA
----------------------------------------
ID Venta: ComidaVenta-3
Cliente: Juan Pérez
Correo: juan@example.com
----------------------------------------
• Combo Familiar — $25,000 (base $30,000 - 20%)
   - Crispetas Grandes ($10,000)
   - 2 Gaseosas ($8,000)
   - Nachos ($12,000)
----------------------------------------
Subtotal (sin descuento): $30,000
Descuento total: -$5,000
Subtotal (con descuento): $25,000
IVA (19%): $4,750
TOTAL: $29,750
```

---

## 🔁 Ejemplo de flujo completo

1. Ejecutas `npx ts-node src/app/main.ts`.
2. Registras un usuario (admin, vendedor o cliente).
3. Inicias sesión.
4. Dependiendo del rol:

   * **Admin**: crea películas, salas, funciones, gestiona ventas y comida.
   * **Vendedor**: vende boletos y combos a clientes.
   * **Cliente**: compra boletos y combos, y consulta sus compras.

**Ejemplo:**

* Admin crea película `Avengers`, sala `Sala 1`, función para 2025-10-10 a $12,000 revisar la gestión de ventas de boletas y la creación de comida y su gestión.
* Vendedor vende 2 boletos (A1, A2) y combos a un cliente externo → factura.
* Cliente compra boleta,combo familiar → factura.

---

## Notas / Recomendaciones

* **Crear Usuarios**:Crear como minimo 3 roles de diferente usuario cada uno, si se crea en el sistema el cliente al tiempo con el vendedor, cuando el vendedor registre el nombre y correo excatamente igual como se registro el cliente este recibirá la información y se verá en las compras del cliente
* **Dependencias**: instalar `@inquirer/prompts`,`cli-table3` y `date-fns`.
* **Date parsing**: creación de funciones usa `date-fns` con formato `yyyy-MM-dd HH:mm` ej. 2025-10-10 18:30.
* **JSON**: Para crear los archivos JSON se tiene que llenar todos los registro de administrador, vendedor y cliente
---

