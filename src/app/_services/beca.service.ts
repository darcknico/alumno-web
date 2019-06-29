import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Beca } from '../_models/beca';
 
@Injectable()
export class BecaService {
    api:string = environment.apiUrl+'becas/';
    constructor(
        private http: HttpClient,
        ) { }
 
    get() {
        return this.http.get<Beca>(this.api);
    }

    //ADMINISTRADOR

    getAll(){
        return this.http.get<Beca[]>(this.api);
    }

    register(item:Beca){
        return this.http.post<Beca>(this.api,item);
    }

    getById(id:number) {
        return this.http.get<Beca>(this.api+id);
    }
    
    update(item:Beca){
        return this.http.put<Beca>(this.api+item.id,item);
    }

    delete(id:number) {
        return this.http.delete(this.api+id);
    }

}