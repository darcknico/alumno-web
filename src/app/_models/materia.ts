import { Usuario } from "./usuario";
import { Departamento } from "./departamento";
import { Carrera } from "./carrera";
import { PlanEstudio } from "./plan_estudio";

export interface Materia{
    id:number;
    nombre:string;
    codigo:string;
    horas:number;
    id_tipo_materia_regimen:number;
    id_tipo_materia_lectivo:number;
    id_plan_estudio:number;
    id_usuario:number;
    id_aula_virtual:string;
    id_examen_virtual:string;

    estado:boolean;
    created_at:string;
    updated_at:string;

    usuario:Usuario;
    plan_estudio:PlanEstudio;
    tipo_regimen:TipoMateriaRegimen;
    tipo_lectivo:TipoMateriaLectivo;
    correlatividades:MateriaCorrelativa[];
}

export interface TipoMateriaRegimen{
    id:number;
    nombre:string;
}

export interface TipoMateriaLectivo{
    id:number;
    nombre:string;
}

export interface MateriaCorrelativa{
    id:number;
    id_materia:number;
    correlatividad_id_materia:number;
    id_tipo_correlatividad:number;
    id_usuario:number;

    estado:boolean;
    created_at:string;
    updated_at:string;

    usuario:Usuario;
    materia:Materia;
    correlatividad:Materia;
}
