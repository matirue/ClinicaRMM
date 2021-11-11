import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EspecialistaGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router:Router
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      return this.verificarEspecialistaLogueado();
  }

  verificarEspecialistaLogueado(){
    if(this.auth.isLogged.especialista){
      return true;
    }
    else{
      return false;
    }
  }
  
}
