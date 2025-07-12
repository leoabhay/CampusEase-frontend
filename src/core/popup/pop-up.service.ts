import { Injectable } from '@angular/core';
declare let alertify: any;
@Injectable({
  providedIn: 'root'
})
export class PopUpService {
  showConfirmationPopup(): Promise<boolean> {
    return new Promise((resolve) => {
      alertify.confirm('Confirmation', 'Are you sure you want to Delete?', () => {
        resolve(true);
      }, () => {
        resolve(false);
      });
    });
  }
  showSuccessMessage(message: string): void {
    alertify.success(message);
  }

  showErrorMessage(message: string): void {
    alertify.error(message);
  }
}