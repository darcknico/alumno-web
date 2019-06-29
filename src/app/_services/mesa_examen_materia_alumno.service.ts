import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MesaExamenMateriaAlumno } from '../_models/mesa.examen';
 
@Injectable()
export class MesaExamenMateriaAlumnoService {

    api:string = environment.apiUrl+'sedes/';
    id_sede:number;
    id_mesa_examen_materia:number;
    constructor(
        private http: HttpClient,
        ) {
    }

    sede(id_sede:number,id_mesa_examen_materia:number){
        this.id_sede = id_sede;
        this.id_mesa_examen_materia = id_mesa_examen_materia;
    }

    getById(id:number) {
        return this.http.get<MesaExamenMateriaAlumno>(this.api + this.id_sede + '/mesas/materias/' + this.id_mesa_examen_materia + '/alumnos/' + id);
    }

    update(item: MesaExamenMateriaAlumno) {
        return this.http.put<MesaExamenMateriaAlumno>(this.api + this.id_sede + '/mesas/materias/' + this.id_mesa_examen_materia + '/alumnos/' + item.id,item);
    }


}