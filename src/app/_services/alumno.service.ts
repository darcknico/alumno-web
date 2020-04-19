import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Alumno, TipoAlumnoCivil, TipoAlumnoEstado, TipoAlumnoDocumentacion, AlumnoArchivo, TipoCondicionAlumno, AlumnoSede } from '../_models/alumno';
import { Inscripcion } from '../_models/inscripcion';
import { PlanPago } from '../_models/plan_pago';
import { Obligacion } from '../_models/obligacion';
import { SedeService } from './sede.service';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
import * as moment from 'moment';
import { SedeProvider } from '../_providers/sede.provider';
 
export interface FiltroAlumno {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
    id_departamento:number;
    id_carrera:number;
    id_tipo_alumno_estado:number;
    estado:number;
}
export interface AlumnoAjax{
    items: Alumno[];
    total_count: number;
}
@Injectable()
export class AlumnoService {
    api:string = environment.apiUrl.slice(0, -1);
    id_sede:number;
    resource:string = 'alumnos';

    get ruta(){
        return [this.api,'sedes',this.id_sede,this.resource].join('/');
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
        return this.http.get<Alumno[]>(this.ruta );
    }

    ajax(filtro:FiltroAlumno):  Observable<AlumnoAjax>{
        return this.http.get<AlumnoAjax>(this.ruta, {
            params: AuxiliarFunction.toParams(filtro),
        });
    }

    register(item:Alumno){
        return this.http.post<Alumno>(this.ruta,item);
    }

    getById(id:number) {
        return this.http.get<Alumno>([this.ruta,id].join('/'));
    }
    
    update(item:Alumno){
        return this.http.put<Alumno>([this.ruta,item.id].join('/'),item);
    }

    delete(id:number) {
        return this.http.delete([this.ruta,id].join('/'));
    }

    archivoAlta(archivo:AlumnoArchivo){
        let input = new FormData();
        input.append('archivo', archivo.archivo);
        input.append('id_tipo_alumno_documentacion', String(archivo.id_tipo_alumno_documentacion));
        input.append('observaciones', String(archivo.observaciones));
        return this.http.post<AlumnoArchivo>( [this.api,this.resource,archivo.id_alumno,'archivos'].join('/'), input);
    }

    archivo(archivo:AlumnoArchivo){
        return this.http.get( [this.api,this.resource,archivo.id_alumno,'archivos',archivo.id].join('/'),{responseType: 'blob'});
    }

    archivoEdita(archivo:AlumnoArchivo){
        return this.http.put( [this.api,this.resource,archivo.id_alumno,'archivos',archivo.id].join('/'),archivo);
    }

    archivoBaja(archivo:AlumnoArchivo){
        return this.http.delete( [this.api,this.resource,archivo.id_alumno,'archivos',archivo.id].join('/') );
    }

    tipos_civil() {
        return this.http.get<TipoAlumnoCivil[]>(environment.apiUrl+ 'alumnos/civil/tipos');
    }

    tipos_estado() {
        return this.http.get<TipoAlumnoEstado[]>(environment.apiUrl+ 'alumnos/estado/tipos');
    }

    tipos_documentacion(){
        return this.http.get<TipoAlumnoDocumentacion[]>(environment.apiUrl+ 'alumnos/documentacion/tipos');
    }

    tipos_condicion(){
        return this.http.get<TipoCondicionAlumno[]>(environment.apiUrl+ 'alumnos/condicion/tipos');
    }

    inscribir(inscripcion:Inscripcion,plan_pago:PlanPago){
        return this.http.post<Inscripcion>(this.ruta +'/'+inscripcion.id_alumno+'/inscripciones',{
            id_carrera:inscripcion.id_carrera,
            id_plan_estudio:inscripcion.id_plan_estudio,
            anio:inscripcion.anio,
            id_beca:inscripcion.id_beca,
            id_modalidad:inscripcion.id_modalidad,
            beca_nombre:inscripcion.beca_nombre,
            beca_porcentaje:inscripcion.beca_porcentaje,
            matricula_monto:plan_pago.matricula_monto,
            cuota_monto:plan_pago.cuota_monto,
            interes_monto:plan_pago.interes_monto,
            cuota_cantidad:plan_pago.cuota_cantidad,
            dias_vencimiento:plan_pago.dias_vencimiento,
            fecha:plan_pago.fecha,
        });
    }

    inscripciones(id:number){
        return this.http.get<Inscripcion[]>( [this.api,this.resource,id,'inscripciones'].join('/') );        
    }

    estadisticas(id_sede:number = this.id_sede,fecha:moment.Moment = moment()) {
        return this.http.get([this.api,this.resource,'estadisticas'].join('/'),{
            params:{
                id_sede:String(id_sede),
                fecha:fecha.format('YYYY-MM-DD'),
            }
        });
    }

    estadisticas_planes(id_sede:number = this.id_sede,fecha:moment.Moment = moment()) {
        return this.http.get([this.api,this.resource,'estadisticas/planes'].join('/'),{
            params:{
                id_sede:String(id_sede),
                fecha:fecha.format('YYYY-MM-DD'),
            }
        });
    }

    exportar(filtro:FiltroAlumno){
        return this.http.get( [this.ruta,'exportar'].join('/'),{
            responseType:'blob',
            params:AuxiliarFunction.toParams(filtro),
        });
    }

    //ESTADOS
    estado_deuda(id:number) {
        return this.http.get( [this.api,this.resource,id,'estados','deuda'].join('/') );
    }

    coincidencia(
        id_tipo_documento,
        documento
    ){
        return this.http.get<{
            coincidencia:boolean,
            alumno:Alumno,
        }>( [this.api,this.resource,'coincidencia'].join('/') ,
        {
            params:{
                id_tipo_documento:id_tipo_documento,
                documento:documento
            },
        }
        );
    }

    sedes(id:number){
        return this.http.get<AlumnoSede[]>( [this.api,this.resource,id,'sedes'].join('/') );
    }

    password(item:Alumno){
        return this.http.post<Alumno>( [this.api,this.resource,item.id,'password'].join('/'),item );
    }
}