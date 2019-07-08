import { Comision } from './comision';
import { Usuario } from './usuario';
import { Alumno, TipoCondicionAlumno } from './alumno';
import { TipoAsistenciaAlumno } from './asistencia';

export interface Examen{
    id:number;
    id_comision:number;
    id_tipo_examen:number;
    nombre:string;
    observaciones:string;
    fecha:string;
    estado:boolean;
    id_usuario:number;
    id_usuario_baja:number;
    created_at:Date;
    updated_at:Date;

    comision:Comision;
    usuario:Usuario;
    usuario_baja:Usuario;
    tipo:TipoExamen;
}

export interface TipoExamen{
    id:number;
    nombre:string;
}

export interface ExamenAlumno{
    id:number;
    id_comision_examen:number;
    id_alumno:number;
    id_tipo_asistencia_alumno:number;
    nota:number;
    observaciones:string;

    created_at:Date;
    updated_at:Date;
    alumno:Alumno;

    tipo:TipoAsistenciaAlumno;
}