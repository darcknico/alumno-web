import { Plantilla } from "./plantilla";
import { Usuario } from "./usuario";
import { AlumnoNotificacion, Alumno } from "./alumno";

export interface Notificacion {
    id:number;
    nombre:string;
    descripcion:string;
    fecha:string;
    enviado:boolean;
    asunto:string;
    responder_email:string;
    responder_nombre:string;
    id_plantilla:number;
    id_empresa:number;
    id_usuario:number;

    plantilla:Plantilla;
    usuario:Usuario;
    alumnos:AlumnoNotificacion[];

    correos_enviado:number;
    correos_abierto:number;
    total:number;

    alumnos_asociados:Alumno[];
}
