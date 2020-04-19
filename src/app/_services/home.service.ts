import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { SedeService } from './sede.service';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
import { SedeProvider } from '../_providers/sede.provider';

@Injectable()
export class HomeService {
    api:string = environment.apiUrl+'sedes';
    id_sede:number;
    constructor(
        private http: HttpClient,
        private sede:SedeProvider,
        ) { 
        this.id_sede = this.sede.getIdSede();
        this.sede.id_sede$.subscribe(id_sede => {
            this.id_sede = id_sede;
        });
    }

    estadisticas_pagos(params?:{}){
        return this.http.get([this.api,this.id_sede,'estadisticas','pagos'].join('/'),{
            params:AuxiliarFunction.toParams(params),
        });
    }
    estadisticas_carreras(params?:{}){
        return this.http.get([this.api,this.id_sede,'estadisticas','carreras'].join('/'),{
            params:AuxiliarFunction.toParams(params),
        });
    }
    estadisticas_obligaciones(params?:{}){
        return this.http.get([this.api,this.id_sede,'estadisticas','obligaciones'].join('/'),{
            params:AuxiliarFunction.toParams(params),
        });
    }
}