import { Sede } from "./sede";
import { Alumno, TipoAlumnoEstado } from "./alumno";
import { Carrera } from "./carrera";
import { PlanEstudio } from "./plan_estudio";
import { Usuario } from "./usuario";
import { PlanPago } from "./plan_pago";
import { Beca } from "./beca";
import { Modalidad } from "./modalidad";
import { TipoInscripcionAbandono } from './tipo';

export interface Inscripcion{
    id:number;
    id_sede:number;
    id_alumno:number;
    id_carrera:number;
    id_plan_estudio:number;
    id_tipo_inscripcion_estado:number;
    id_modalidad:number;
    id_usuario:number;
    anio:number;
    id_beca:number;
    beca_nombre:string;
    beca_porcentaje:number;
    beca_porcentaje_matricula:number;
    estado:boolean;
    created_at:Date;
    updated_at:Date;
    observaciones:string;
    fecha_egreso:string;

    sede:Sede;
    alumno:Alumno;
    carrera:Carrera;
    plan_estudio:PlanEstudio;
    tipo_estado:TipoInscripcionEstado;
    tipo_abandonos:InscripcionAbandono[];
    modalidad:Modalidad;
    usuario:Usuario;
    planes_pago:PlanPago[];
    beca:Beca;
}

export interface TipoInscripcionEstado{
    id:number;
    nombre:string;
}


export interface InscripcionAbandono{
    id:number;
    id_inscripcion:number;
    id_tipo_inscripcion_abandono:number;
    id_usuario:number;
    estado:boolean;
    created_at:Date;
    updated_at:Date;

    inscripcion:Inscripcion;
    tipo:TipoInscripcionAbandono;
}

export interface InscripcionEstado{
    id:number;
    id_inscripcion:number;
    id_tipo_inscripcion_estado:number;
    anterior_id_tipo_inscripcion_estado:number;
    fecha:string;
    observaciones:string;
    id_usuario:number;
    created_at:Date;
    updated_at:Date;

    inscripcion:Inscripcion;
    anterior:TipoInscripcionEstado;
    actual:TipoInscripcionEstado;

    fecha_egreso:string;
    tipo_abandonos:any;
}