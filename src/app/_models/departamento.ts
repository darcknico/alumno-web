import { Usuario } from "./usuario";
import { Sede } from "./sede";
import { Carrera } from "./carrera";

export interface Departamento{
    id:number;
    nombre:string;
    id_sede:number;
    id_usuario:number;

    estado:boolean;
    created_at:string;
    updated_at:string;
    
    usuario:Usuario;
    sede:Sede;
    carreras:Carrera[];
}