import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Inscripcion, InscripcionAbandono } from '../_models/inscripcion';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
import { SedeService } from './sede.service';
import { Ajax } from '../_models/tipo';
 
export interface FiltroInscripcionAbandono {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
    id_departamento:number;
    id_carrera:number;
    id_tipo_inscripcion_estado:number;
    id_beca:number;
    anio_inicial:number;
    anio_final:number;
    fecha_inicial:string;
    fecha_final:string;
}

@Injectable()
export class InscripcionAbandonoService {
    api:string = environment.apiUrl+'sedes/';
    resource:string='inscripciones';
    id_sede:number;
    constructor(
        private http: HttpClient,
        private sede:SedeService,
        ) {
        this.id_sede = sede.getIdSede();
        this.sede.id_sede$.subscribe(id=>{
            this.id_sede = id;
        })
    }
 
    get ruta(){
        return this.api + this.id_sede + '/inscripciones';
    }

    getAll(filtro:FiltroInscripcionAbandono=null){
        return this.http.get<InscripcionAbandono[]>([this.ruta,'abandonos'].join('/'),{
            params:AuxiliarFunction.toParams(filtro),
        });
    }
    ajax(filtro:FiltroInscripcionAbandono){
        return this.http.get<Ajax<InscripcionAbandono>>([this.ruta,'abandonos'].join('/'),{
            params:AuxiliarFunction.toParams(filtro),
        } );
    }

    register(inscripcion:Inscripcion){
        return this.http.post([this.ruta,inscripcion.id,'abandonos'].join('/'),
            inscripcion
        );
    }

}