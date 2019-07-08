import { Usuario } from "./usuario";
import { Sede } from "./sede";

export interface Plantilla {
    id:number;
    titulo:string;
    descripcion:string;
    cuerpo:string;
    id_sede:number;
    id_usuario:number;
    estado:boolean;
    created_at:string;
    updated_at:string;

    usuario:Usuario;
    sede:Sede;
    archivos:PlantillaArchivo[];

    destino:string;
}

export interface PlantillaArchivo{
    id:number;
    nombre:string;
    id_usuario:number;
    id_plantilla:number;
    estado:boolean;
    created_at:string;
    updated_at:string;

    usuario:Usuario;
    plantilla:Plantilla;

    archivo:any;
    url:any;
    subido:boolean;
}
export interface PlantillaImagen{
    id:number;
    id_empresa:number;
    id_usuario:number;
    nombre:string;
    url:string;
    created_at:string;
    updated_at:string;

    archivo:any;
}