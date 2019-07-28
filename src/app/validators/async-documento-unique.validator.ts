import { AbstractControl } from '@angular/forms';
import { AlumnoService } from '../_services/alumno.service';
import { map } from 'rxjs/operators';


export class ValidateDocumentoUnique {

    static createValidator(service: AlumnoService) {
        return (control: AbstractControl) => {
            return service.coincidencia(control.get('id_tipo_documento').value,control.get('documento').value).pipe(
                map(res=>{
                    if(res.coincidencia){
                        return res;
                    }
                    return null;
                }),
                );
        }
    }
}