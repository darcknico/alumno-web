import { Sede } from "./sede";
import { Alumno, TipoAlumnoEstado } from "./alumno";
import { Carrera } from "./carrera";
import { PlanEstudio } from "./plan_estudio";
import { Usuario } from "./usuario";
import { PlanPago } from "./plan_pago";
import { Beca } from "./beca";
import { Modalidad } from "./modalidad";

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
    modalidad:Modalidad;
    usuario:Usuario;
    planes_pago:PlanPago[];
    beca:Beca;
}

export interface TipoInscripcionEstado{
    id:number;
    nombre:string;
}