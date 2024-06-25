import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";

export const canActivateAuthnGuard: CanActivateFn = (_: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  console.log(state);
  return verifyAuthToken(state)
}

export const verifyAuthToken = async(state: RouterStateSnapshot) => {
    const user = JSON.parse(localStorage.getItem('user')!);
    const token = user?.csrfToken;
    const router: Router = inject(Router);
    if (token && (state.url !== '/login' &&  state.url !== '/register')) {
        return true
    }else{
        router.navigate(['/login'])
    }

    return false;

}
