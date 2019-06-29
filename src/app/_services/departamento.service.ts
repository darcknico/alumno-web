import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Departamento } from '../_models/departamento';
 
@Injectable()
export class DepartamentoService {

    api:string = environment.apiUrl;

    constructor(
        private http: HttpClient,
    ) {;
    }
 
    getAll() {
        return this.http.get<Departamento[]>( this.api + 'departamentos');
    }
 
    getById(id: number) {
        return this.http.get<Departamento>(this.api + 'departamentos/' + id);
    }
 
    register(item: Departamento) {
        return this.http.post<Departamento>(this.api + 'departamentos', item);
    }
 
    update(item: Departamento) {
        return this.http.put<Departamento>(this.api + 'departamentos/' + item.id, item);
    }
 
    delete(id: number) {
        return this.http.delete(this.api + 'departamentos/' + id);
    }

}