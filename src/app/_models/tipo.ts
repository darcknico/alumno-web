export interface TipoContrato{
    id:number;
    nombre:string;
}

export interface Ajax<T>{
    items:T[];
    total_count:number;
}

export interface TipoMesaDocente{
    id:number;
    nombre:string;
}

export interface TipoDocenteCargo{
    id:number;
    nombre:string;
}

export interface TipoInscripcionAbandono{
    id:number;
    nombre:string;
    descripcion:string;
}

export interface TipoDocenteEstado{
    id:number;
    nombre:string;
    descripcion:string;
}