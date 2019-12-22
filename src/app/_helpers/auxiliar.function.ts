import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/internal/Observable';
import { HttpResponse } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { IDateAdapter } from '@rschedule/rschedule';

export class AuxiliarFunction{

    public static toParams(modelo:any|[any]){
        let obj = {};
        if(Array.isArray(modelo)){
            modelo.forEach(model=>{
                for(let key in model){
                    if(Array.isArray(modelo[key])){
                        obj[key] = modelo[key].toString();
                    } else {
                        obj[key] = String(modelo[key]);
                    }
                }
            });
        } else {
            for(let key in modelo){
                if(Array.isArray(modelo[key])){
                    obj[key] = modelo[key].toString();
                } else {
                    obj[key] = String(modelo[key]);
                }
            }
        }
        return obj;
    }

    public static isNullorUndefined(x):boolean{
        if (x == null) {
            return true;
        }
    
        if (x === null) {
            return true;
        }
    
        if (typeof x === 'undefined') {
            return true;
        }
        return false;
    }

    public static limpiar_moneda(maskedData) {
        maskedData = String(maskedData).replace(/\./g,'').replace(',','.').replace('$','').replace('%','');
        return Number(maskedData);
    }
    public static formato_moneda(amount,n=2, x=3, s='.', c=',') {
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = Number(amount).toFixed(Math.max(0, ~~n));
        return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
    }

    public static descargar(toastr:ToastrService,obs:Observable<HttpResponse<Blob>>){
        let aviso = toastr.warning('Preparando descarga', '',{
            timeOut:30000,
        });
        let loading = true;
        let suscription = aviso.onHidden.subscribe(()=>{
            if(loading){
                toastr.error('Si esta tardando mucho. Puede resultar de un error. En caso que siga persistiendo, comuniquese con el administrador.')
            }
        });
        return obs.toPromise().then(response=>{
            loading = false;
            var contentDisposition = response.headers.get('Content-Disposition');
            var contentType = response.headers.get('Content-Type');
            var filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();
            suscription.unsubscribe();
            toastr.remove(aviso.toastId);
            toastr.success('Descarga lista');
            var mediaType = contentType;
            var blob = new Blob([response.body], {type: mediaType});
            saveAs(blob,filename)
        },()=>{
            loading = false;
        });
    }
    
    public static imprimir(toastr:ToastrService,obs:Observable<HttpResponse<Blob>>){
        let aviso = toastr.warning('Preparando descarga', '',{
            timeOut:30000,
        });
        let loading = true;
        let suscription = aviso.onHidden.subscribe(()=>{
            if(loading){
                toastr.error('Si esta tardando mucho. Puede resultar de un error. En caso que siga persistiendo, comuniquese con el administrador.')
            }
        });
        return obs.toPromise().then(response=>{
            loading = false;
            suscription.unsubscribe();
            toastr.remove(aviso.toastId);
            toastr.success('Archivo listo');
            var blob = new Blob([response.body], {type: 'application/pdf'});
            const blobUrl = URL.createObjectURL(blob);
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = blobUrl;
            document.body.appendChild(iframe);
            iframe.contentWindow.print();
        },()=>{
            loading = false;
        });
    }

    public static IdDayToWeek(id_day:number):IDateAdapter.Weekday{
        let week:IDateAdapter.Weekday = null;
        switch(id_day){
            case 1:
                week = 'SU';
                break;
            case 2:
                week = 'MO';
                break;
            case 3:
                week = 'TU';
                break;
            case 4:
                week = 'WE';
                break;
            case 5:
                week = 'TH';
                break;
            case 6:
                week = 'FR';
                break;
            case 7:
                week = 'SA';
                break;
        }
        return week;
    }
}