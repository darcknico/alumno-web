import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { SedeService } from './sede.service';
import { Ajax } from '../_models/tipo';
import { Auditoria } from '../_models/extra';
import { Alumno } from '../_models/alumno';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
import { SedeProvider } from '../_providers/sede.provider';
 
export interface FiltroAuditoria {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
}
@Injectable()
export class AuditoriaService {
    api:string = environment.apiUrl+'sedes';
    resource:string = 'auditorias';
    id_sede:number;
    constructor(
        private http: HttpClient,
        private sede: SedeProvider,
        ) { 
        this.id_sede = this.sede.getIdSede();
        this.sede.id_sede$.subscribe(id=>{
            this.id_sede = id;
        });
    }

    get ruta(){
        return [this.api,this.id_sede,this.resource].join('/');
    }

    alumnos(filtro:FiltroAuditoria):  Observable<Ajax<Auditoria<Alumno>>>{
        return this.http.get<Ajax<Auditoria<Alumno>>>([this.ruta,'alumnos'].join('/'), {
            params: AuxiliarFunction.toParams(filtro)
        });
    }
}