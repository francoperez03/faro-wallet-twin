// Working name del producto (D-02). Se reemplaza por Faro/Vera/Doble solo acá
// cuando el usuario elija (Plan 03, Task 1); nunca renombrar el slug de Vercel.
export const PRODUCT_NAME = "Faro";

// Feature flag de contingencia (D-12): ids de tabs a ocultar del nav si una
// sección queda rota el día de la demo. Prioridad de sacrificio, de último a
// primero: 'bolt' (bonus), 'bridge', 'cuenta', 'vault'. 'm1' (login+balances)
// nunca entra acá.
export const HIDDEN_SECTIONS: string[] = [];
