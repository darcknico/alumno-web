import { Usuario } from "./usuario";
import { Departamento } from "./departamento";
import { Carrera } from "./carrera";
import { Materia } from "./materia";

export interface PlanEstudio{
    id:number;
    nombre:string;
    codigo:string;
    anio:string;
    horas:number;
    resolucion:string;
    id_carrera:number;
    id_usuario:number;

    estado:boolean;
    created_at:string;
    updated_at:string;
    
    usuario:Usuario;
    carrera:Carrera;
    departamentos:Departamento[];
    materias:Materia[];

    cantidad_horas:number;
}