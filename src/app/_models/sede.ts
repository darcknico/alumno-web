import { Usuario } from "./usuario";
import { Departamento } from "./departamento";

export interface Sede{
    id:number;
    nombre:string;
    ubicacion:string;
    localidad:string;
    latitud:number;
    longitud:number;
    codigo_postal:number;
    direccion:string;
    telefono:string;
    celular:string;
    email:string;
    punto_venta:number;
    pago_numero:number;
    id_localidad:number;
    id_usuario:number;
    
    estado:boolean;
    created_at:string;
    updated_at:string;
    
    usuario:Usuario;
    departamentos:Departamento[];
}