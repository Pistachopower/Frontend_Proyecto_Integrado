export function listarProductos() {
    return fetch('http://127.0.0.1:8000/api/v1/login/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Problemas de conexion ' + response.statusText);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Hay un problema. Este es el error:', error);
            throw error;
        });
}