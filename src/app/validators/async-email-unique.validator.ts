
import {map} from 'rxjs/operators';
import { AbstractControl } from '@angular/forms';
import { UsuarioService } from '../_services/usuario.service';


export class ValidateEmailUnique {
  static createValidator(usuarioService: UsuarioService) {
    return (control: AbstractControl) => {
      return usuarioService.coincidencia(control.value).pipe(map((res:any) => {
        return res.coincidencia>0 ? {coincidencia:true} : null;
      }));
    }
  }
}