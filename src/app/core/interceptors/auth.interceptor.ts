import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.headers.get('No-Auth') === 'True') {
    // Skip adding Authorization header if explicitly asked
    return next(req);
  }

  if (typeof window !== 'undefined') {
    const authToken = localStorage.getItem('userToken');

    if (authToken) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
      return next(authReq);
    }
  }

  return next(req);
};
