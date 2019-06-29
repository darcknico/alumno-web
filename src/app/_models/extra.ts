export interface Provincia{
    id:number;
    nombre:string;
}

export interface Localidad{
    id:number;
    nombre:string;
    codigo_postal:number;

    id_provincia:number;
}