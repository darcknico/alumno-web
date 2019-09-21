import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TipoMovimiento } from '../_models/movimiento';
import { SedeService } from './sede.service';
 
@Injectable()
export class TipoMovimientoService {
    api:string = environment.apiUrl+'sedes/';
    id_sede:number;
    constructor(
        private http: HttpClient,
        private sedeService:SedeService,
        ) { 
        this.id_sede = this.sedeService.getIdSede();
        this.sedeService.id_sede$.subscribe(id=>{
            this.id_sede = id;
        });
    }

    sede(id_sede:number){
        this.id_sede = id_sede;
    }
 
    get() {
        return this.http.get<TipoMovimiento>(this.api + this.id_sede + '/tipos_movimiento');
    }

    //ADMINISTRADOR

    getAll(){
        return this.http.get<TipoMovimiento[]>(this.api + this.id_sede + '/tipos_movimiento');
    }

    register(item:TipoMovimiento){
        return this.http.post<TipoMovimiento>(this.api + this.id_sede + '/tipos_movimiento',item);
    }

    getById(id:number) {
        return this.http.get<TipoMovimiento>(this.api + this.id_sede + '/tipos_movimiento/'+id);
    }
    
    update(item:TipoMovimiento){
        return this.http.put<TipoMovimiento>(this.api + this.id_sede + '/tipos_movimiento/'+item.id,item);
    }

    delete(id:number) {
        return this.http.delete(this.api + this.id_sede + '/tipos_movimiento/'+id);
    }

    ingresos(){
        return this.http.get<TipoMovimiento[]>(this.api + this.id_sede + '/tipos_movimiento/ingresos');
    }

    egresos(){
        return this.http.get<TipoMovimiento[]>(this.api + this.id_sede + '/tipos_movimiento/egresos');
    }
}