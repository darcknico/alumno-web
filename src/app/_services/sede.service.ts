import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Sede } from '../_models/sede';
import { UsuarioSede } from '../_models/usuario';
import { SedeProvider } from '../_providers/sede.provider';
 
@Injectable()
export class SedeService {

    api:string = environment.apiUrl;

    constructor(
        private http: HttpClient,
        private sede: SedeProvider,
        ) {;
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
            this.sede.setSede(response);
        });
    }

    actualizar(){
        return this.http.get<UsuarioSede>(this.api + 'sedes/seleccionar').toPromise().then(response=>{
            this.sede.setSede(response);
        });
    }

}