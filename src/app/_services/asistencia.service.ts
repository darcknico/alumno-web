import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Asistencia, AsistenciaAlumno, TipoAsistenciaAlumno } from '../_models/asistencia';
 
export interface FiltroAsistencia {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
    id_departamento:number;
    id_carrera:number;
    id_materia:number;
    id_comision:number;
}
export interface AsistenciaAjax{
    items: Asistencia[];
    total_count: number;
}
@Injectable()
export class AsistenciaService {
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
        return this.http.get<Asistencia[]>(this.api + this.id_sede + '/asistencias' );
    }

    ajax(filtro:FiltroAsistencia):  Observable<AsistenciaAjax>{
        return this.http.get<AsistenciaAjax>(this.api + this.id_sede + '/asistencias', {
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
        return this.http.get<Asistencia>(this.api + this.id_sede + '/asistencias/' +id);
    }

    register(item: Asistencia) {
        return this.http.post<Asistencia>(
            this.api + this.id_sede + '/comisiones/'+item.id_comision+'/asistencias', item);
    }

    delete(id: number) {
        return this.http.delete(
            this.api + this.id_sede + '/asistencias/' + 
            id);
    }

    alumno(item: AsistenciaAlumno) {
        return this.http.post<AsistenciaAlumno>(
            this.api + this.id_sede + '/asistencias/' +
            item.id_asistencia + '/alumnos/' +
            item.id_alumno , item);
    }
    alumnos(id) {
        return this.http.get<AsistenciaAlumno[]>(
            this.api + this.id_sede + '/asistencias/' +
            id + '/alumnos');
    }

    check_in(id:number){
        return this.http.get(this.api + this.id_sede + '/asistencias/' + id +'/check_in',{responseType: 'blob'});
    }

    check_out_previa(id_asistencia:number,archivo){
        let input = new FormData();
        input.append('archivo', archivo);
        return this.http.post(this.api + this.id_sede + '/asistencias/' +id_asistencia+'/check_out/previa', input);
    }

    check_out(id_asistencia:number,archivo){
        let input = new FormData();
        input.append('archivo', archivo);
        return this.http.post(this.api + this.id_sede + '/asistencias/' +id_asistencia+'/check_out', input);
    }

    tipos() {
        return this.http.get<TipoAsistenciaAlumno[]>(environment.apiUrl+'asistencias/alumnos/tipos');
    }
}