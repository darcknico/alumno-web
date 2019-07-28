import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MesaExamenMateriaAlumno } from '../_models/mesa.examen';
import { SedeService } from './sede.service';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
import { Ajax } from '../_models/tipo';
import { Observable } from 'rxjs/internal/Observable';

export interface FiltroMesaExamenMateriaAlumno {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
    id_departamento:number;
    id_carrera:number;
    id_materia:number;
    id_mesa_examen:number;
    id_alumno:number;
}

@Injectable()
export class MesaExamenMateriaAlumnoService {

    api:string = environment.apiUrl+'sedes';
    id_sede:number;
    resource:string = 'mesas/materias/alumnos';
    constructor(
        private http: HttpClient,
        private sede:SedeService,
        ) {
            this.id_sede = this.sede.getIdSede();
            this.sede.id_sede$.subscribe(id=>{
                this.id_sede = id;
            });
    }

    get ruta(){
        return [this.api,this.id_sede,this.resource].join('/')
    }

    getAll(filtro:FiltroMesaExamenMateriaAlumno=<FiltroMesaExamenMateriaAlumno>{}){
        return this.http.get<FiltroMesaExamenMateriaAlumno[]>(this.ruta,{
            params:AuxiliarFunction.toParams(filtro),
        });
    }

    ajax(filtro:FiltroMesaExamenMateriaAlumno){
        return this.http.get<Ajax<FiltroMesaExamenMateriaAlumno>>(this.ruta,{
            params:AuxiliarFunction.toParams(filtro),
        });
    }

    getById(id:number) {
        return this.http.get<MesaExamenMateriaAlumno>([this.ruta,id].join('/'));
    }

    register(item:MesaExamenMateriaAlumno){
        return this.http.post<MesaExamenMateriaAlumno>(this.ruta,item);
    }

    update(item: MesaExamenMateriaAlumno) {
        return this.http.put<MesaExamenMateriaAlumno>([this.ruta,item.id].join('/'),item);
    }

    delete(id:number){
        return this.http.delete<MesaExamenMateriaAlumno>([this.ruta,id].join('/'));
    }

    reporte_constancia(id:number):Observable<HttpResponse<Blob>>{
        return this.http.get<Blob>([this.ruta,id,'reportes/constancia'].join('/'),{
            observe:'response',
            responseType:'blob' as 'json',
        });
    }
}