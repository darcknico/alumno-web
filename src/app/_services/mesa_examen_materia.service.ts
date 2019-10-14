import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { MesaExamenMateria, MesaExamenMateriaAlumno, MesaExamenMateriaDocente } from '../_models/mesa.examen';
import { SedeService } from './sede.service';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
import { ReporteJob } from '../_models/extra';
 
export interface FiltroMesaExamenMateria {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
    id_departamento:number;
    id_carrera:number;
    id_materia:number;
    id_mesa_examen:number;
    fecha_ini:string;
    fecha_fin:string;
    cierre:boolean;
    id_usuario:number;
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

    getAll(){
        return this.http.get<MesaExamenMateria[]>(this.api + this.id_sede + this._endpoint );
    }

    ajax(filtro:FiltroMesaExamenMateria):  Observable<MesaExamenMateriaAjax>{
        return this.http.get<MesaExamenMateriaAjax>(this.api + this.id_sede + this._endpoint, {
            params: AuxiliarFunction.toParams(filtro),
        });
    }

    getById(id:number,id_inscripcion:number=null) {
        let params = {};
        if(id_inscripcion!=null){
            params['id_inscripcion'] = id_inscripcion;
        }
        return this.http.get<MesaExamenMateria>(this.api + this.id_sede + this.endpoint +id,{
            params:params
        });
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

    docentes(id_mesa_examen_materia:number){
        return this.http.get<MesaExamenMateriaDocente[]>(this.api + this.id_sede + this.endpoint +id_mesa_examen_materia+'/docentes');
    }

    check_in(id:number){
        return this.http.get(this.api + this.id_sede + this.endpoint + id +'/check_in',{responseType: 'blob'});
    }

    check_out_previa(id:number,archivo){
        let input = new FormData();
        input.append('archivo', archivo);
        return this.http.post(this.api + this.id_sede + this.endpoint +id+'/check_out/previa', input);
    }

    check_out(item:MesaExamenMateria){
        return this.http.post(this.api + this.id_sede + this.endpoint +item.id+'/check_out', item);
    }

    reporte_acta(id_mesa_examen_materia:number,id_tipo_condicion_alumno:number=3) {
        return this.http.get(
            this.api + this.id_sede + this.endpoint + 
            id_mesa_examen_materia + '/reportes/acta',{
                responseType: 'blob',
                params:{
                    id_tipo_condicion_alumno:String(id_tipo_condicion_alumno)
                }
            });
    }

    reporte_acta_masivo(filtro:FiltroMesaExamenMateria,item:ReporteJob=null) {
        return this.http.post(this.api + this.id_sede + this.endpoint + 'reportes/acta',item,{
                params:AuxiliarFunction.toParams(filtro)
            });
    }

}