import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { MesaExamenMateria, MesaExamenMateriaAlumno } from '../_models/mesa.examen';
 
export interface FiltroMesaExamenMateria {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
    id_departamento:number;
    id_carrera:number;
    id_materia:number;
}
export interface MesaExamenMateriaAjax{
    items: MesaExamenMateria[];
    total_count: number;
}
@Injectable()
export class MesaExamenMateriaService {

    api:string = environment.apiUrl+'sedes/';
    private endpoint:string = '/mesas/materias/';
    private _endpoint:string = '/mesas/materias';
    id_sede:number;
    constructor(
        private http: HttpClient,
        ) {
    }

    sede(id_sede:number){
        this.id_sede = id_sede;
    }

    getAll(){
        return this.http.get<MesaExamenMateria[]>(this.api + this.id_sede + this._endpoint );
    }

    ajax(filtro:FiltroMesaExamenMateria):  Observable<MesaExamenMateriaAjax>{
        return this.http.get<MesaExamenMateriaAjax>(this.api + this.id_sede + this._endpoint, {
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
        return this.http.get<MesaExamenMateria>(this.api + this.id_sede + this.endpoint +id);
    }

    register(item: MesaExamenMateria) {
        return this.http.post<MesaExamenMateria>(
            this.api + this.id_sede + this._endpoint, item);
    }

    update(item: MesaExamenMateria) {
        return this.http.put<MesaExamenMateria>(
            this.api + this.id_sede + this.endpoint + 
            item.id, item);
    }

    cerrar(item: MesaExamenMateria) {
        return this.http.put<MesaExamenMateria>(
            this.api + this.id_sede + this.endpoint + 
            item.id + '/cerrar', item);
    }

    delete(id: number) {
        return this.http.delete(
            this.api + this.id_sede + this.endpoint + 
            id);
    }

    alumno_asociar(item: MesaExamenMateriaAlumno) {
        return this.http.post<MesaExamenMateriaAlumno>(
            this.api + this.id_sede + this.endpoint +
            item.id_mesa_examen_materia + '/alumnos/' +
            item.id_alumno , item);
    }

    alumno_desasociar(item: MesaExamenMateriaAlumno) {
        return this.http.delete(
            this.api + this.id_sede + this.endpoint +
            item.id_mesa_examen_materia + '/alumnos/' +
            item.id_alumno);
    }

    alumnos(id_mesa_examen_materia:number){
        return this.http.get<MesaExamenMateriaAlumno[]>(this.api + this.id_sede + this.endpoint +id_mesa_examen_materia+'/alumnos');
    }

    check_in(id:number){
        return this.http.get(this.api + this.id_sede + this.endpoint + id +'/check_in',{responseType: 'blob'});
    }

    check_out_previa(id:number,archivo){
        let input = new FormData();
        input.append('archivo', archivo);
        return this.http.post(this.api + this.id_sede + this.endpoint +id+'/check_out/previa', input);
    }

    check_out(id:number,archivo){
        let input = new FormData();
        input.append('archivo', archivo);
        return this.http.post(this.api + this.id_sede + this.endpoint +id+'/check_out', input);
    }

    reporte_acta(id_mesa_examen_materia:number) {
        return this.http.get(
            this.api + this.id_sede + this.endpoint + 
            id_mesa_examen_materia + '/reportes/acta',{responseType: 'blob'});
    }

}