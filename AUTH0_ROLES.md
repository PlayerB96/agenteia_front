# Guía: Configurar Roles en Auth0 (Método RBAC)

Ya que tienes acceso a **User Management > Roles**, usaremos el sistema nativo de Auth0, que es más fácil de gestionar visualmente.

## Paso 1: Crear Roles en Auth0

1. Ve a **User Management** > **Roles**.
2. Crea dos roles:
   - `saas_owner`
   - `company_admin`

## Paso 2: Asignar Roles a Usuarios

1. Ve a **User Management** > **Users**.
2. Haz click en tu usuario (ej: tu cuenta de Google).
3. Ve a la pestaña **Roles**.
4. Click en **Assign Roles** y selecciona el rol que quieras (ej: `saas_owner`).

## Paso 3: "Conectar" los Roles con la App (IMPORTANTE)

Aunque asignes el rol, **Auth0 no lo envía a la aplicación por defecto**. Necesitas crear una "Action" pequeña para incluirlo.

1. En el menú lateral izquierdo, busca **Actions** (suele estar abajo, debajo de "Branding" o "Security").
2. Click en **Library** > **Build Custom**.
3. Nombre: `Add Roles to Token`.
4. Trigger: **Login / Post Login**.
5. Pega este código:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = "https://agenteia.com";

  // Si el usuario tiene roles asignados en Auth0
  if (event.authorization && event.authorization.roles) {
    // Tomamos el primer rol (ej: 'saas_owner')
    const role = event.authorization.roles[0];

    // Lo guardamos en el token para que Vue lo pueda leer
    api.idToken.setCustomClaim(`${namespace}/role`, role);
    api.accessToken.setCustomClaim(`${namespace}/role`, role);
  }
};
```

### Usar la descripción del rol desde Auth0 (opcional)

La app lee la descripción del rol de Auth0. Puedes enviarla de dos formas:

**Opción A – Objeto con `name` y `description`:** en tu Action, envía el rol como objeto (por ejemplo, obteniendo los datos con la Management API):

```javascript
api.idToken.setCustomClaim(`${namespace}/role`, {
  name: roleName,
  description: roleDescription  // la descripción que configuraste en Auth0
});
```

**Opción B – Claim separado:** envía el nombre como siempre y añade un claim para la descripción:

```javascript
api.idToken.setCustomClaim(`${namespace}/role`, roleName);
api.idToken.setCustomClaim(`${namespace}/role_description`, roleDescription);
```

## Paso 3: Desplegar

1. Click en **Deploy** (arriba a la derecha en el editor de código).
2. En el menú lateral izquierdo de Auth0, haz click en **Actions**.
3. Se desplegará un submenú, selecciona **Flows**.
4. Selecciona el cuadro que dice **Login**.
5. A la derecha verás una lista de "Custom Actions". Arrastra tu acción `Add Roles to Token` y suéltala en la línea que conecta "Start" con "Complete".
6. Click en **Apply** (arriba a la derecha).

## Solución de Problemas

### "Mi librería está vacía"

Si en **Actions > Library** no hay nada, **tienes que crear la acción**:

1. Click en **Build Custom**.
2. Nombre: `Add Roles to Token`.
3. Trigger: **Login / Post Login**.
4. Pega el código de arriba.
5. **IMPORTANTE:** Dale a **Deploy**.

## Paso 4: Probar

1. Cierra sesión en tu aplicación (`localhost:5173`).
2. Vuelve a iniciar sesión.
3. ¡Listo! La aplicación leerá el rol que asignaste visualmente en Auth0.
