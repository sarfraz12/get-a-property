// components/ui/time.js
//
// <time> con fecha formateada ("MMMM dd, yyyy") a partir de un string
// ISO. Sólo lo usa components/navigation/sidebar.js, que a su vez ya
// no está en uso (ver el comentario en ese archivo) -- así que hoy
// este componente tampoco forma parte del flujo activo del sitio. Se
// deja disponible por si se necesita mostrar fechas formateadas en
// algún lugar nuevo.

import { parseISO, format } from "date-fns";
import { cx } from "@/utils/all";

export default function DateTime({ date, className }) {
  return (
    <time className={cx(className && className)} dateTime={date}>
      {format(parseISO(date), "MMMM dd, yyyy")}
    </time>
  );
}
