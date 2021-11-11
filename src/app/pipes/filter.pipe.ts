import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appFilter'
})

/**Pipe uzado para hacer un buscador o filtro */
export class FilterPipe implements PipeTransform {

  
  transform(items: any, value: string): any {
    if(!value)return items;
      if(!items)return value;
      
      value = value.toLowerCase();
      return items.filter((data)=>{
        return JSON.stringify(data).toLowerCase().includes(value);
      });
  }

}
