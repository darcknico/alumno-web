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