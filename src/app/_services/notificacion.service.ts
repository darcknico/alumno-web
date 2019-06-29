import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Notificacion } from '../_models/notificacion';
import { Alumno } from '../_models/alumno';

export interface AlumnoNotificacionFiltro{
    minimo_edad:number;
    maximo_edad:number;
    sexo:string;
    id_departamento:number;
    id_carrera:number;
    id_tipo_alumno_estado:number;

    olgado:boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
    api:string = environment.apiUrl+'sedes/';

    id_sede:number;

    constructor(
        private http: HttpClient,
    ) {;
    }

    sede(id_sede:number){
        this.id_sede = id_sede;
    }
    getAll() {
        return this.http.get<Notificacion[]>( this.api +this.id_sede+ '/notificaciones');
    }

    enviadas() {
        return this.http.get<Notificacion[]>( this.api +this.id_sede+ '/notificaciones/enviadas');
    }

    getById(id: number) {
        return this.http.get<Notificacion>(this.api +this.id_sede+ '/notificaciones/' + id);
    }

    alumnos(id: number) {
        return this.http.get<Alumno[]>(this.api +this.id_sede+ '/notificaciones/' + id + '/alumnos');
    }

    register(item: Notificacion) {
        return this.http.post<Notificacion>(this.api +this.id_sede+ '/notificaciones', item);
    }

    update(item: Notificacion) {
        return this.http.put<Notificacion>(this.api +this.id_sede+ '/notificaciones/' + item.id, item);
    }

    delete(id: number) {
        return this.http.delete(this.api +this.id_sede+ '/notificaciones/' + id);
    }

  
    filtrar(item:AlumnoNotificacionFiltro){
        return this.http.post<Alumno[]>(this.api + this.id_sede + '/notificaciones/alumnos',item);
    }

    desplegar(item:Notificacion){
        return this.http.get(this.api + this.id_sede + '/notificaciones/'+item.id+'/desplegar');
    }

    fecha(item:Notificacion){
        return this.http.post(this.api + this.id_sede + '/notificaciones/'+item.id+'/desplegar',item);
    }
}
