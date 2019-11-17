import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Examen, ExamenAlumno, TipoExamen } from '../_models/examen';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
import { SedeService } from './sede.service';
 
export interface FiltroExamen {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
    id_departamento:number;
    id_carrera:number;
    id_materia:number;
    id_comision:number;
    fecha_inicial:string;
    fecha_final:string;
}
export interface ExamenAjax{
    items: Examen[];
    total_count: number;
}
@Injectable()
export class ExamenService {
    api:string = environment.apiUrl+'sedes/';
    id_sede:number;
    constructor(
        private http: HttpClient,
        private sedeService:SedeService,
        ) { 
        this.id_sede = this.sedeService.getIdSede();
        this.sedeService.id_sede$.subscribe(id=>{
            this.id_sede = id;
        });
    }

    sede(id_sede:number){
        this.id_sede = id_sede;
    }

    getAll(filtro?:FiltroExamen){
        return this.http.get<Examen[]>(this.api + this.id_sede + '/examenes',{
            params: AuxiliarFunction.toParams(filtro),
        } );
    }

    ajax(filtro:FiltroExamen):  Observable<ExamenAjax>{
        return this.http.get<ExamenAjax>(this.api + this.id_sede + '/examenes', {
            params: AuxiliarFunction.toParams(filtro),
        });
    }

    getById(id:number) {
        return this.http.get<Examen>(this.api + this.id_sede + '/examenes/' +id);
    }

    register(item: Examen) {
        return this.http.post<Examen>(
            this.api + this.id_sede + '/comisiones/'+item.id_comision+'/examenes', item);
    }

    update(item: Examen) {
        return this.http.put(
            this.api + this.id_sede + '/examenes/' + 
            item.id,item);
    }

    delete(id: number) {
        return this.http.delete(
            this.api + this.id_sede + '/examenes/' + 
            id);
    }

    alumno(item: ExamenAlumno) {
        return this.http.post<ExamenAlumno>(
            this.api + this.id_sede + '/examenes/' +
            item.id_comision_examen + '/alumnos/' +
            item.id_alumno , item);
    }

    alumnos(id){
        return this.http.get<ExamenAlumno[]>(
            this.api + this.id_sede + '/examenes/' + 
            id + '/alumnos');
    }

    tipos() {
        return this.http.get<TipoExamen[]>(environment.apiUrl+'examenes/tipos');
    }
}