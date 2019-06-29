import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Comision, ComisionAlumno } from '../_models/comision';
import { Alumno } from '../_models/alumno';
import { Asistencia } from '../_models/asistencia';
import { Examen } from '../_models/examen';
 
export interface FiltroComision {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
    id_departamento:number;
    id_carrera:number;
    id_materia:number;
}
export interface ComisionAjax{
    items: Comision[];
    total_count: number;
}
@Injectable()
export class ComisionService {
    api:string = environment.apiUrl+'sedes/';
    id_sede:number;
    constructor(
        private http: HttpClient,
        ) {
    }

    sede(id_sede:number){
        this.id_sede = id_sede;
    }

    getAll(){
        return this.http.get<Comision[]>(this.api + this.id_sede + '/comisiones' );
    }

    ajax(filtro:FiltroComision):  Observable<ComisionAjax>{
        return this.http.get<ComisionAjax>(this.api + this.id_sede + '/comisiones', {
            params: {
                search: filtro.search,
                sort: filtro.sort,
                order: filtro.order,
                start: String(filtro.start),
                length: String(filtro.length),
                id_departamento: String(filtro.id_departamento),
                id_carrera: String(filtro.id_carrera),
                id_materia: String(filtro.id_materia),
            }
        });
    }

    getById(id:number) {
        return this.http.get<Comision>(this.api + this.id_sede + '/comisiones/' +id);
    }

    register(item: Comision) {
        return this.http.post<Comision>(
            this.api + this.id_sede + '/comisiones', item);
    }

    update(item: Comision) {
        return this.http.put<Comision>(
            this.api + this.id_sede + '/comisiones/' + 
            item.id, item);
    }

    delete(id: number) {
        return this.http.delete(
            this.api + this.id_sede + '/comisiones/' + 
            id);
    }

    alumno_asociar(item: ComisionAlumno) {
        return this.http.post<ComisionAlumno>(
            this.api + this.id_sede + '/comisiones/' +
            item.id_comision + '/alumnos/' +
            item.id_alumno , item);
    }

    alumno_desasociar(item: ComisionAlumno) {
        return this.http.delete(
            this.api + this.id_sede + '/comisiones/' +
            item.id_comision + '/alumnos/' +
            item.id_alumno);
    }

    alumnos(id_comision:number){
        return this.http.get<ComisionAlumno[]>(this.api + this.id_sede + '/comisiones/' +id_comision+'/alumnos');
    }

    alumnos_disponibles(id_comision:number){
        return this.http.get<Alumno[]>(this.api + this.id_sede + '/comisiones/' +id_comision+'/alumnos/disponibles');
    }

    asistencias(id_comision:number){
        return this.http.get<Asistencia[]>(this.api + this.id_sede + '/comisiones/' +id_comision+'/asistencias');
    }

    examenes(id_comision:number){
        return this.http.get<Examen[]>(this.api + this.id_sede + '/comisiones/' +id_comision+'/examenes');
    }

    carreras(id:number) {
        return this.http.get<Comision[]>(this.api + this.id_sede + '/comisiones/carreras/' +id);
    }

    materias(id:number) {
        return this.http.get<Comision[]>(this.api + this.id_sede + '/comisiones/materias/' +id);
    }

    reporte(id:number){
        return this.http.get(this.api + this.id_sede + '/comisiones/'+id+'/reporte',{responseType: 'blob'});
    }
}