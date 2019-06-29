import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PlanEstudio } from '../_models/plan_estudio';

@Injectable()
export class PlanService {

    api:string = environment.apiUrl.slice(0, -1);
    resource:string = 'planes_estudio';
    id_carrera:number;
    
    constructor(
        private http: HttpClient,
        ) {
    }

    get ruta(){
        return [this.api,'carreras',this.id_carrera,this.resource].join('/');
    }

    carrera(id_carrera:number){
        this.id_carrera = id_carrera;
    }

    getAll() {
        return this.http.get<PlanEstudio[]>(this.ruta);
    }
 
    getById(id: number) {
        return this.http.get<PlanEstudio>( [this.api,this.resource,id].join('/') );
    }
 
    register(item: PlanEstudio) {
        return this.http.post<PlanEstudio>(this.ruta, item);
    }
 
    update(item: PlanEstudio) {
        return this.http.put<PlanEstudio>( [this.api,this.resource,item.id].join('/') , item);
    }
 
    delete(id: number) {
        return this.http.delete( [this.api,this.resource,id].join('/') );
    }

    reporte(id: number){
        return this.http.get( [this.api,this.resource,id,'reportes'].join('/') ,{responseType: 'blob'});
    }

}