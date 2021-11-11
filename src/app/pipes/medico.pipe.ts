import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../clases/user';

@Pipe({
  name: 'medico'
})

/***Pipe que retorna el nombre del doc */
export class MedicoPipe implements PipeTransform {

  transform(value: User, items: any): any {
    if(!value)return items;
      if(!items)return value;
      return value.apellido + ", " +value.nombre;
      
  }

}
