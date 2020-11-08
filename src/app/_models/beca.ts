import { Usuario } from "./usuario";

export interface Beca{
    id:number;
    nombre:string;
    descripcion:string;
    porcentaje:number;
    porcentaje_matricula:number;
    id_usuario:number;
    estado:boolean;
    created_at:string;
    updated_at:string;

    usuario:Usuario;
}