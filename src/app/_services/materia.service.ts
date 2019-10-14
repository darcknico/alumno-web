import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Materia, MateriaCorrelativa, TipoMateriaRegimen, TipoMateriaLectivo } from '../_models/materia';
import { Observable } from 'rxjs';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';

export interface FiltroMateria {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
    id_departamento:number;
    id_carrera:number;
    id_plan_estudio:number;
    id_tipo_materia_regimen:number;
    id_tipo_materia_lectivo:number;
}

export interface MateriaAjax{
    items: Materia[];
    total_count: number;
}

@Injectable()
export class MateriaService {

    api:string = environment.apiUrl+'materias';

    id_carrera:number;
    id_plan_estudio:number;

    constructor(
        private http: HttpClient,
        ) {
    }

    getAll() {
        return this.http.get<Materia[]>(this.api);
    }

    ajax(filtro:FiltroMateria):  Observable<MateriaAjax>{
        return this.http.get<MateriaAjax>(this.api, {
            params: AuxiliarFunction.toParams(filtro)
        });
    }

    carrera(id_carrera:number){
        return this.http.get<Materia[]>(this.api, {
            params: {
                id_carrera:String(id_carrera)
            }
        });
    }
    planEstudio(id_plan_estudio:number){
        return this.http.get<Materia[]>(this.api, {
            params: {
                id_plan_estudio:String(id_plan_estudio)
            }
        });
    }
 
    getById(id: number) {
        return this.http.get<Materia>([this.api,id].join('/'));
    }
 
    register(item: Materia) {
        return this.http.post<Materia>([this.api].join('/'), item);
    }
 
    update(item: Materia) {
        return this.http.put<Materia>([this.api,item.id].join('/'), item);
    }
 
    delete(id: number) {
        return this.http.delete([this.api,id].join('/'));
    }

    materia_asociar(item: MateriaCorrelativa) {
        return this.http.post<Materia>([this.api,item.id_materia,'correlativas',item.correlatividad_id_materia].join('/'), item);
    }

    materia_desasociar(item: MateriaCorrelativa) {
        return this.http.delete([this.api,item.id_materia,'correlativas',item.correlatividad_id_materia].join('/'));
    }

    tipos_regimen() {
        return this.http.get<TipoMateriaRegimen[]>(environment.apiUrl+ 'materias/regimen/tipos');
    }

    tipos_lectivo() {
        return this.http.get<TipoMateriaLectivo[]>(environment.apiUrl+ 'materias/lectivo/tipos');
    }

    estadisticas_historico(id_materia:number,id_sede){
        return this.http.get<Materia>([this.api,id_materia,'estadisticas/historico'].join('/'),{
            params:{
                id_sede:id_sede,
            }
        });
    }
    estadisticas_anual(id_materia:number,id_sede,anio){
        return this.http.get<Materia>([this.api,id_materia,'estadisticas/anual'].join('/'),{
            params:{
                id_sede:id_sede,
                anio:anio,
            }
        });
    }

}