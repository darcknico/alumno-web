import { Usuario } from "./usuario";

export interface Modalidad{
    id:number;
    nombre:string;
    descripcion:string;
    id_usuario:number;

    estado:boolean;
    created_at:string;
    updated_at:string;
    
    usuario:Usuario;
}