import { Injectable } from '@angular/core';
import { SppinerService } from '../services/spinner.service';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';

@Injectable()
export class SppinerInterceptor implements HttpInterceptor {

  constructor(private readonly sppinerSvc : SppinerService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.sppinerSvc.show();
    return next.handle(request).pipe(

      finalize(() => this.sppinerSvc.hide())
      
    )
  }
}
