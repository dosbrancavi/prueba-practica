import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";

export const publicGuard: CanActivateFn = (_: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  console.log(state);
  return verifyPublicAccess(state)
}

export const verifyPublicAccess = async(state: RouterStateSnapshot) => {
    const user = JSON.parse(localStorage.getItem('user')!);
    const token = user?.csrfToken;
    const router: Router = inject(Router);
    if (token) {
        router.navigate(['/tasks'])
    }

    return true;

}
