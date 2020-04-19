import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Ajax } from '../_models/tipo';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
import { SedeService } from './sede.service';
import { AsistenciaAlumno } from '../_models/asistencia';
import { SedeProvider } from '../_providers/sede.provider';

export interface FiltroAsistenciaAlumno {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;

    id_departamento:number;
    id_carrera:number;
    id_materia:number;
    id_comision:number;
    id_alumno:number;
    anio:number;
}

@Injectable()
export class AsistenciaAlumnoService {
    api:string = environment.apiUrl+'sedes';
    id_sede:number;
    resource:string = 'comisiones/asistencias/alumnos';

    get ruta(){
        return [this.api,this.id_sede,this.resource].join('/');
    }

    constructor(
        private http: HttpClient,
        private sede:SedeProvider,
        ) {
        this.id_sede = this.sede.getIdSede();
        this.sede.id_sede$.subscribe(id_sede => {
            this.id_sede = id_sede;
        });
    }

    getAll(){
        return this.http.get<AsistenciaAlumno[]>(this.ruta );
    }

    ajax(filtro:FiltroAsistenciaAlumno):  Observable<Ajax<AsistenciaAlumno>>{
        return this.http.get<Ajax<AsistenciaAlumno>>(this.ruta, {
            params: AuxiliarFunction.toParams(filtro),
        });
    }

    getById(id:number) {
        return this.http.get<AsistenciaAlumno>([this.ruta,id].join('/'));
    }
    
    update(item:AsistenciaAlumno){
        return this.http.put<AsistenciaAlumno>([this.ruta,item.id].join('/'),item);
    }
    
    reporte_constancia(id:number):Observable<HttpResponse<Blob>>{
        return this.http.get<Blob>([this.ruta,id,'reportes/constancia'].join('/'),{
            observe:'response',
            responseType:'blob' as 'json',
        });
    }

}