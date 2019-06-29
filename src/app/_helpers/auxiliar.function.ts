export class AuxiliarFunction{

    public static toParams(modelo:any|[any]){
        let obj = {};
        if(Array.isArray(modelo)){
            modelo.forEach(model=>{
                for(let key in model){
                    obj[key] = String(modelo[key]);
                }
            });
        } else {
            for(let key in modelo){
                obj[key] = String(modelo[key]);
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
}