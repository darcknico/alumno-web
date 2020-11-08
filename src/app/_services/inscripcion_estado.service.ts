import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Inscripcion, InscripcionEstado } from '../_models/inscripcion';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
import { SedeService } from './sede.service';
import { Ajax } from '../_models/tipo';
import { SedeProvider } from '../_providers/sede.provider';
 
export interface FiltroInscripcionEstado {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
    id_sede:number;
    id_inscripcion:number;
    id_tipo_inscripcion_estado:number;
}

@Injectable()
export class InscripcionEstadoService {
    api:string = environment.apiUrl;
    resource:string='inscripciones/estados';
    id_sede:number;
    constructor(
        private http: HttpClient,
        private sede:SedeProvider,
        ) {
        this.id_sede = sede.getIdSede();
        this.sede.id_sede$.subscribe(id=>{
            this.id_sede = id;
        })
    }
 
    get ruta(){
        return this.api  + this.resource;
    }

    getAll(filtro:FiltroInscripcionEstado=null){
        return this.http.get<InscripcionEstado[]>([this.ruta].join('/'),{
            params:AuxiliarFunction.toParams(filtro),
        });
    }
    ajax(filtro:FiltroInscripcionEstado){
        return this.http.get<Ajax<InscripcionEstado>>([this.ruta].join('/'),{
            params:AuxiliarFunction.toParams(filtro),
        } );
    }


}