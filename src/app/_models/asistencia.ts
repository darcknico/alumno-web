import { Comision } from "./comision";
import { Usuario } from "./usuario";
import { Alumno } from "./alumno";

export interface Asistencia{
    id:number;
    fecha:string;
    id_comision:number;
    check_in:string;
    check_out:string;
    alumnos_cantidad:number;
    alumnos_cantidad_presente:number;
    responsable_nombre:string;
    responsable_apellido:string;
    id_usuario:number;
    estado:boolean;
    created_at:Date;
    updated_at:Date;

    comision:Comision;
    usuario:Usuario;
    usuario_baja:Usuario;
    usuario_check_in:Usuario;
    usuario_check_out:Usuario;
    alumnos:AsistenciaAlumno[];
}

export interface AsistenciaAlumno{
    id:number;
    id_asistencia:number;
    id_alumno:number;
    id_tipo_asistencia_alumno:number;
    observaciones:string;
    estado:boolean;
    created_at:Date;
    updated_at:Date;

    tipo:TipoAsistenciaAlumno;
    alumno:Alumno;
    asistencia:Asistencia;
}

export interface TipoAsistenciaAlumno{
    id:number;
    nombre:string;
}