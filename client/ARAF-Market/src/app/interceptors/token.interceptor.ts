import { HttpHeaders, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * @Author : Ahmed M.salah
 * Retrieves the authentication token from local storage
 * @returns The stored token or an empty string if none exists
 */
function getToken(): string {
  return localStorage.getItem('token') || '';
}

/**
 * Determines if a request should be excluded from token injection
 * @param request The HTTP request to check
 * @returns True if the request should skip token authentication
 * @Author : Ahmed M.salah
 */
function isExcludedEndpoint(request: HttpRequest<unknown>): boolean {
  const excludedEndpoints = [
    'http://127.0.0.1:3000/auth/signin',
    'http://127.0.0.1:3000/auth/signup'
  ];

  return excludedEndpoints.some(endpoint => request.url.includes(endpoint));
}

/**
 * HTTP interceptor that adds authentication token to outgoing requests
 */
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip token injection for excluded endpoints
  if (isExcludedEndpoint(req)) {
    return next(req);
  }

  const token = getToken();

  // Only add token if it exists
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('token', `${token}`)
    });

    // Process the modified request
    return next(authReq).pipe(
      catchError(error => {
        if (error.status === 401) {
          // Token expired or invalid
          // Could add logic to refresh token or redirect to login
          localStorage.removeItem('token');
          // Redirect to login page or trigger auth service method
          // window.location.href = '/login';
        }
        return throwError(() => error);
      })
    );
  }
  return next(req);
};
