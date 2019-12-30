import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Ajax } from '../_models/tipo';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
import { SedeService } from './sede.service';
import { ComisionAlumno } from '../_models/comision';
 
export interface FiltroComisionAlumno {
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
    id_inscripcion:number;
    anio:number;
}

@Injectable()
export class ComisionAlumnoService {
    api:string = environment.apiUrl+'sedes';
    id_sede:number;
    resource:string = 'comisiones/alumnos';

    get ruta(){
        return [this.api,this.id_sede,this.resource].join('/');
    }

    constructor(
        private http: HttpClient,
        private sede:SedeService,
        ) {
        this.id_sede = this.sede.getIdSede();
        this.sede.id_sede$.subscribe(id_sede => {
            this.id_sede = id_sede;
        });
    }

    getAll(filtro:FiltroComisionAlumno=null){
        return this.http.get<ComisionAlumno[]>(this.ruta,{
            params:AuxiliarFunction.toParams(filtro),
        } );
    }

    ajax(filtro:FiltroComisionAlumno):  Observable<Ajax<ComisionAlumno>>{
        return this.http.get<Ajax<ComisionAlumno>>(this.ruta, {
            params: AuxiliarFunction.toParams(filtro),
        });
    }

    register(item:ComisionAlumno){
        return this.http.post<ComisionAlumno>(this.ruta,item);
    }

    getById(id:number) {
        return this.http.get<ComisionAlumno>([this.ruta,id].join('/'));
    }
    
    update(item:ComisionAlumno){
        return this.http.put<ComisionAlumno>([this.ruta,item.id].join('/'),item);
    }

    delete(id:number) {
        return this.http.delete<ComisionAlumno>([this.ruta,id].join('/'));
    }

}