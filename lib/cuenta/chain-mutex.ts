import type { ChainKey } from "@/lib/config/tokens";

// ponytail: mutex en memoria de una sola instancia serverless; con múltiples instancias/regiones
// esto no alcanza, ahí hace falta un lock externo (ej. advisory lock de Postgres sostenido
// durante el envío, o una cola). Para la demo (una instancia) alcanza.
const queues = new Map<ChainKey, Promise<unknown>>();

/** Encola `fn` detrás de la última operación pendiente en `chain`, serializando firma+envío por chain. */
export function withChainLock<T>(chain: ChainKey, fn: () => Promise<T>): Promise<T> {
  const prev = queues.get(chain) ?? Promise.resolve();
  const result = prev.then(fn, fn);
  queues.set(chain, result.catch(() => undefined));
  return result;
}
