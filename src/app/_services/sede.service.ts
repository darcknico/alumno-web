import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Sede } from '../_models/sede';
import { Subject } from 'rxjs';
import { UsuarioSede } from '../_models/usuario';
 
@Injectable()
export class SedeService {

    sede$ = new Subject<Sede>();
    id_sede$ = new Subject<number>();
    api:string = environment.apiUrl;

    constructor(private http: HttpClient) {;
    }
 

    getAll() {
        return this.http.get<Sede[]>( this.api + 'sedes');
    }
 
    getById(id: number) {
        return this.http.get<Sede>(this.api + 'sedes/' + id);
    }
 
    register(item: Sede) {
        return this.http.post<Sede>(this.api + 'sedes', item);
    }
 
    update(item: Sede) {
        return this.http.put<Sede>(this.api + 'sedes/' + item.id, item);
    }
 
    delete(id: number) {
        return this.http.delete(this.api + 'sedes/' + id);
    }

    seleccionar(id:number){
        return this.http.post<UsuarioSede>(this.api + 'sedes/'+ id +'/seleccionar',{}).subscribe(response=>{
            this.setSede(response);
        });
    }

    actualizar(){
        return this.http.get<UsuarioSede>(this.api + 'sedes/seleccionar').subscribe(response=>{
            this.setSede(response);
        });;
    }

    getIdSede():number{
        return Number(localStorage.getItem('id_sede'));
    }

    private setSede(sede:UsuarioSede){
        localStorage.setItem('sede',JSON.stringify(sede));
        localStorage.setItem('id_sede',String(sede.id_sede));
        this.sede$.next(sede.sede);
        this.id_sede$.next(sede.id_sede);
    }
}