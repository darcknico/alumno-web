import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PlantillaImagen } from '../_models/plantilla';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
import { SedeService } from './sede.service';
import { Ajax } from '../_models/tipo';
import { SedeProvider } from '../_providers/sede.provider';

export interface FiltroPlantillaImagen{
    search:string;
    sort:string;
    order:string;
    page:number;
    length:number;
}


@Injectable()
export class PlantillaImagenService {

    api:string = environment.apiUrl+'sedes';
    resource:string='imagenes';
    id_sede:number;

    constructor(
        private sede:SedeProvider,
        private http: HttpClient,
        ) {
        this.id_sede = this.sede.getIdSede();
        this.sede.id_sede$.subscribe(id=>{
            this.id_sede = id;
        });
    }

    get url(){
        return [this.api,this.id_sede,this.resource].join('/');
    }

    getAll() {
        return this.http.get<PlantillaImagen[]>( [this.url].join('/') );
    }

    ajax(filtro:FiltroPlantillaImagen) {
        return this.http.get<Ajax<PlantillaImagen>>( [this.url].join('/'),{
            params: AuxiliarFunction.toParams(filtro),
        });
    }
 
    getById(id: number) {
        return this.http.get<PlantillaImagen>([this.url,id].join('/'));
    }
 
    register(archivo) {
        let input = new FormData();
        input.append('archivo', archivo);
        return this.http.post<PlantillaImagen>([this.url].join('/'), input);
    }
 
    update(item: PlantillaImagen) {
        return this.http.put<PlantillaImagen>([this.url,item.id].join('/'), item);
    }
 
    delete(id: number) {
        return this.http.delete([this.url,id].join('/'));
    }

}