import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Modalidad } from '../_models/modalidad';
 
@Injectable()
export class ModalidadService {
    api:string = environment.apiUrl+'modalidades/';
    constructor(
        private http: HttpClient,
        ) { }
 
    get() {
        return this.http.get<Modalidad>(this.api);
    }

    //ADMINISTRADOR

    getAll(){
        return this.http.get<Modalidad[]>(this.api);
    }

    register(item:Modalidad){
        return this.http.post<Modalidad>(this.api,item);
    }

    getById(id:number) {
        return this.http.get<Modalidad>(this.api+id);
    }
    
    update(item:Modalidad){
        return this.http.put<Modalidad>(this.api+item.id,item);
    }

    delete(id:number) {
        return this.http.delete(this.api+id);
    }

}