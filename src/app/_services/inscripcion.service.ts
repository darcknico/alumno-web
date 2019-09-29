import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { Inscripcion, TipoInscripcionEstado } from '../_models/inscripcion';
import { ComisionAlumno } from '../_models/comision';
import { MesaExamen, MesaExamenMateriaAlumno, MesaExamenMateria, AlumnoMateriaNota } from '../_models/mesa.examen';
import { PlanPago } from '../_models/plan_pago';
import { ExamenAlumno } from '../_models/examen';
import { AsistenciaAlumno } from '../_models/asistencia';
import { Pago } from '../_models/pago';
 
export interface FiltroInscripcion {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
    id_departamento:number;
    id_carrera:number;
    id_tipo_inscripcion_estado:number;
    id_beca:number;
    anio_inicial:number;
    anio_final:number;
}
export interface InscripcionAjax{
    items: Inscripcion[];
    total_count: number;
}
@Injectable()
export class InscripcionService {
    api:string = environment.apiUrl+'sedes/';
    resource:string='inscripciones';
    id_sede:number;
    constructor(
        private http: HttpClient,
        ) {
    }
 

    sede(id_sede:number){
        this.id_sede = id_sede;
    }

    getAll(){
        return this.http.get<Inscripcion[]>(this.api + this.id_sede + '/inscripciones' );
    }

    ajax(filtro:FiltroInscripcion):  Observable<InscripcionAjax>{
        return this.http.get<InscripcionAjax>(this.api + this.id_sede + '/inscripciones', {
            params: {
                search: filtro.search,
                sort: filtro.sort,
                order: filtro.order,
                start: String(filtro.start),
                length: String(filtro.length),
                id_departamento: String(filtro.id_departamento),
                id_carrera: String(filtro.id_carrera),
                id_tipo_inscripcion_estado: String(filtro.id_tipo_inscripcion_estado),
                id_beca: String(filtro.id_beca),
                anio_inicial: String(filtro.anio_inicial),
                anio_final: String(filtro.anio_final),
            }
        });
    }

    getById(id:number) {
        return this.http.get<Inscripcion>(this.api + this.id_sede + '/inscripciones/' +id);
    }

    update(item:Inscripcion) {
        return this.http.put<Inscripcion>(this.api + this.id_sede + '/inscripciones/' +item.id,item);
    }

    delete(id:number) {
        return this.http.delete(this.api + this.id_sede + '/inscripciones/' +id);
    }

    estado(item:Inscripcion){
        return this.http.put<Inscripcion>(this.api + this.id_sede + '/inscripciones/' +item.id+'/estado',item);
    }

    tipos_estado() {
        return this.http.get<TipoInscripcionEstado[]>(environment.apiUrl+ 'inscripciones/estado/tipos');
    }

    asistencias(id:number) {
        return this.http.get<AsistenciaAlumno[]>(this.api + this.id_sede + '/inscripciones/' +id +'/asistencias');
    }

    examenes(id:number) {
        return this.http.get<ExamenAlumno[]>(this.api + this.id_sede + '/inscripciones/' +id +'/examenes');
    }

    pagos(id:number) {
        return this.http.get<Pago[]>([this.api.substring(0,this.api.length-1),this.id_sede,this.resource,id,'pagos'].join('/'));
    }

    rendimientos(id:number,anio) {
        return this.http.get([this.api.substring(0,this.api.length-1),this.id_sede,this.resource,id,'rendimientos'].join('/'),{
            params:{
                anio:anio,
            }
        });
    }

    estadisticas() {
        return this.http.get(this.api + this.id_sede + '/inscripciones/estadisticas');
    }

    planes_pago(id:number) {
        return this.http.get<PlanPago[]>(this.api + this.id_sede + '/inscripciones/'+id+'/planes_pago');
    }

    comisiones(id:number) {
        return this.http.get<ComisionAlumno[]>(this.api + this.id_sede + '/inscripciones/' +id+'/comisiones');
    }

    mesas_examenes_disponibles(id:number) {
        return this.http.get<MesaExamen[]>(this.api + this.id_sede + '/inscripciones/' +id+'/mesas/disponibles');
    }

    mesas_examenes(id:number) {
        return this.http.get<MesaExamenMateriaAlumno[]>(this.api + this.id_sede + '/inscripciones/' +id+'/mesas/materias');
    }

    mesas_examenes_materias_disponibles(id_inscripcion:number,id_mesa_examen:number) {
        return this.http.get<MesaExamenMateria[]>(this.api + this.id_sede + '/inscripciones/' +id_inscripcion+'/mesas/'+id_mesa_examen+'/materias/disponibles');
    }

    reporte_ficha(id:number){
        return this.http.get(this.api + this.id_sede + '/inscripciones/' + id +'/reportes/ficha',{responseType: 'blob'});
    }

    reporte_constancia_regular(id:number){
        return this.http.get(this.api + this.id_sede + '/inscripciones/' + id +'/reportes/constancia',{responseType: 'blob'});
    }

    reporte_analitico(id:number){
        return this.http.get(this.api + this.id_sede + '/inscripciones/' + id +'/reportes/analitico',{responseType: 'blob'});
    }

    exportar(filtro:FiltroInscripcion){
        return this.http.get(this.api + this.id_sede + '/inscripciones/exportar',{
            responseType:'blob',
            params:{
                search: filtro.search,
                id_departamento: String(filtro.id_departamento),
                id_carrera: String(filtro.id_carrera),
                id_beca: String(filtro.id_beca),
                id_tipo_inscripcion_estado: String(filtro.id_tipo_inscripcion_estado),
                anio_inicial: String(filtro.anio_inicial),
                anio_final: String(filtro.anio_final),
            }
        });
    }

    notas(id:number){
        return this.http.get<AlumnoMateriaNota[]>(this.api + this.id_sede + '/inscripciones/' +id + '/notas');
    }

    notas_register(item:AlumnoMateriaNota){
        return this.http.post<AlumnoMateriaNota>(this.api + this.id_sede + '/inscripciones/' +item.id_inscripcion + '/notas',item);
    }

    notas_update(item:AlumnoMateriaNota){
        return this.http.put<AlumnoMateriaNota>(this.api + this.id_sede + '/inscripciones/' +item.id_inscripcion + '/notas/'+item.id,item);
    }

    notas_delete(item:AlumnoMateriaNota){
        return this.http.delete<AlumnoMateriaNota>(this.api + this.id_sede + '/inscripciones/' +item.id_inscripcion + '/notas/'+item.id);
    }

    notas_importar_ejemplo(){
        return this.http.get(this.api + this.id_sede + '/inscripciones/notas/importar/ejemplo',{responseType: 'blob'});
    }

    notas_importar_previa(id:number,archivo){
        let input = new FormData();
        input.append('archivo', archivo);
        return this.http.post(this.api + this.id_sede + '/inscripciones/' +id + '/notas/importar/previa',input);
    }

    notas_importar(id:number,archivo){
        let input = new FormData();
        input.append('archivo', archivo);
        return this.http.post(this.api + this.id_sede + '/inscripciones/' +id + '/notas/importar',input);
    }

    //ESTADOS
    estado_deuda(id:number) {
        return this.http.get(this.api + this.id_sede + '/inscripciones/' +id +'/estados/deuda');
    }
}