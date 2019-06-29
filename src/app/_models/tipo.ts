export interface TipoContrato{
    id:number;
    nombre:string;
}

export interface Ajax<T>{
    items:T[];
    total_count:number;
}