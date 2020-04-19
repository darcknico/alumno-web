import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Comision, ComisionAlumno, ComisionDocente } from '../_models/comision';
import { Alumno } from '../_models/alumno';
import { Asistencia } from '../_models/asistencia';
import { Examen } from '../_models/examen';
import { SedeService } from './sede.service';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
import { SedeProvider } from '../_providers/sede.provider';
 
export interface FiltroComision {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
    id_departamento:number;
    id_carrera:number;
    id_materia:number;
    anio:number;
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
        private sedeService: SedeProvider,
        ) {
        this.id_sede = this.sedeService.getIdSede();
        this.sedeService.id_sede$.subscribe(id=>{
            this.id_sede = id;
        });
    }

    sede(id_sede:number){
        this.id_sede = id_sede;
    }

    getAll(){
        return this.http.get<Comision[]>(this.api + this.id_sede + '/comisiones' );
    }

    ajax(filtro:FiltroComision):  Observable<ComisionAjax>{
        return this.http.get<ComisionAjax>(this.api + this.id_sede + '/comisiones', {
            params: AuxiliarFunction.toParams(filtro),
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

    docentes(id_comision:number){
        return this.http.get<ComisionDocente[]>(this.api + this.id_sede + '/comisiones/' +id_comision+'/docentes');
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

    carreras(id_carrera:number,params:{anio:number,id_inscripcion:number}=null) {
        let query = {};
        if(params){
            query = AuxiliarFunction.toParams(params);
        }
        return this.http.get<Comision[]>(this.api + this.id_sede + '/comisiones/carreras/' +id_carrera,{
            params:query
        });
    }

    materias(id:number) {
        return this.http.get<Comision[]>(this.api + this.id_sede + '/comisiones/materias/' +id);
    }

    reporte(id:number){
        return this.http.get(this.api + this.id_sede + '/comisiones/'+id+'/reporte',{responseType: 'blob'});
    }

    masivo_previa(filtro:FiltroComision){
        return this.http.get(this.api + this.id_sede + '/comisiones/masivo',{
            params: AuxiliarFunction.toParams(filtro),
        });
    }
    masivo_asociar(data){
        return this.http.post(this.api + this.id_sede + '/comisiones/masivo',data);
    }
}