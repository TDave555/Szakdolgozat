import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { map, Observable } from "rxjs";
import { UserAuthRole } from "./user-auth-role.enum";


@Injectable({ providedIn: 'root' })
export class CoordinatorGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.userRoles$.pipe(
      map(roles => roles?.includes(UserAuthRole.COORDINATOR) || false)
   );
  }
}
