import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Plantilla, PlantillaArchivo } from '../_models/plantilla';
import { SedeService } from './sede.service';

@Injectable({
  providedIn: 'root'
})
export class PlantillaService {

    api:string = environment.apiUrl+'sedes/';

    id_sede:number;

    constructor(
        private sedeService:SedeService,
        private http: HttpClient,
    ) {
        this.id_sede = this.sedeService.getIdSede();
        this.sedeService.id_sede$.subscribe(id=>{
            this.id_sede = id;
        });
    }

    sede(id_sede:number){
        this.id_sede = id_sede;
    }
    getAll() {
        return this.http.get<Plantilla[]>( this.api +this.id_sede+ '/plantillas');
    }

    getById(id: number) {
        return this.http.get<Plantilla>(this.api +this.id_sede+ '/plantillas/' + id);
    }

    register(item: Plantilla) {
        return this.http.post<Plantilla>(this.api +this.id_sede+ '/plantillas', item);
    }

    update(item: Plantilla) {
        return this.http.put<Plantilla>(this.api +this.id_sede+ '/plantillas/' + item.id, item);
    }

    delete(id: number) {
        return this.http.delete(this.api +this.id_sede+ '/plantillas/' + id);
    }

    enviar(item:Plantilla){
        return this.http.post(this.api + this.id_sede + '/plantillas/enviar',item);
    }

    archivoAlta(id:number,archivo){
        let input = new FormData();
        input.append('archivo', archivo);
        return this.http.post<PlantillaArchivo>(this.api + this.id_sede +'/plantillas/'+id+'/archivos', input);
    }

    archivo(archivo:PlantillaArchivo){
        return this.http.get(this.api + this.id_sede +'/plantillas/'+archivo.id_plantilla+'/archivos/'+archivo.id,{responseType: 'blob'});
    }

    archivoBaja(archivo:PlantillaArchivo){
        return this.http.delete(this.api + this.id_sede +'/plantillas/'+archivo.id_plantilla+'/archivos/'+archivo.id);
    }
}
