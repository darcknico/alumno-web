import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Beca } from '../_models/beca';
import { TipoInscripcionAbandono } from '../_models/tipo';
 
@Injectable()
export class TipoInscripcionAbandonoService{
    api:string = environment.apiUrl+'tipos/inscripcion/abandonos';
    constructor(
        private http: HttpClient,
        ) { }

    getAll(){
        return this.http.get<TipoInscripcionAbandono[]>(this.api);
    }

    register(item:TipoInscripcionAbandono){
        return this.http.post<TipoInscripcionAbandono>(this.api,item);
    }

    getById(id:number) {
        return this.http.get<TipoInscripcionAbandono>(this.api+'/'+id);
    }
    
    update(item:TipoInscripcionAbandono){
        return this.http.put<TipoInscripcionAbandono>(this.api+'/'+item.id,item);
    }

    delete(id:number) {
        return this.http.delete(this.api+'/'+id);
    }

}