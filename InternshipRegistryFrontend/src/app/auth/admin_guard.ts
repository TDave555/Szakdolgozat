import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { map, Observable } from "rxjs";
import { UserRole } from "../models/user-role.enum";

@Injectable({ providedIn: 'root' })
export class AudminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.userRoles$.pipe(
      map(roles => roles?.includes(UserRole.ADMIN) || false)
   );
  }
}
