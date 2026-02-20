```mermaid
sequenceDiagram
    autonumber
    
    actor User as Usuario
    participant Vue as C_Header
    participant Store as Pinia Store
    participant Browser as Navegador
    participant API as Django API

    Note over User, Vue: 1. DECISION DE SALIR
    User->>Vue: Click en Cerrar Sesion
    
    activate Vue
    Vue->>Vue: handleLogout()
    Vue->>Browser: fetch logout con credentials include
    Note right of Vue: Envia la cookie para saber<br/>QUE sesion destruir
    
    activate Browser
    Browser->>API: POST logout con Cookie sessionid
    deactivate Vue
    
    activate API
    Note over API: 2. EL SERVIDOR OLVIDA
    API->>API: Busca sesion en BD
    API->>API: Borra la sesion de la BD
    
    API-->>Browser: HTTP 200 OK
    Note left of API: Header Set-Cookie sessionid VACIO
    deactivate API
    
    Note over Browser: 3. LIMPIEZA DEL NAVEGADOR
    Browser->>Browser: Navegador recibe fecha caducada<br/>Elimina la cookie sessionid
    
    Browser-->>Vue: Respuesta OK
    deactivate Browser
    
    activate Vue
    Note over Vue: 4. LIMPIEZA VISUAL
    Vue->>Store: Limpiar datos del perfil
    Vue->>Vue: Redirigir a Login
    deactivate Vue

