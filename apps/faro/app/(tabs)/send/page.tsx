import { redirect } from "next/navigation";

// El envío ahora vive inline en Home; esta ruta se conserva para no romper deep-links.
export default function SendPage() {
  redirect("/home");
}
