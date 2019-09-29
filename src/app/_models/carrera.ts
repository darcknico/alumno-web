import { Usuario } from "./usuario";
import { Departamento } from "./departamento";
import { Modalidad } from "./modalidad";
import { PlanEstudio } from "./plan_estudio";

export interface Carrera{
    id:number;
    nombre:string;
    nombre_corto:string;
    descripcion:string;
    titulo:string;
    id_departamento:number;
    id_usuario:number;
    id_plan_estudio:number;

    estado:boolean;
    created_at:string;
    updated_at:string;
    
    usuario:Usuario;
    departamento:Departamento;
    modalidades:CarreraModalidad[];
    planes_estudio:PlanEstudio[];
    plan_estudio:PlanEstudio;

    disabled:boolean; //NG-SELECT
}

export interface CarreraModalidad{
    id:number;
    id_modalidad:number;
    id_carrera:number;
    id_usuario:number;

    estado:boolean;
    created_at:string;
    updated_at:string;
    
    usuario:Usuario;
    modalidad:Modalidad;

}