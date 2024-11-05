import {inject, Injectable} from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
} from "@angular/material/snack-bar";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DialogComponent} from "../shared-components/dialog/dialog.component";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _snackBar = inject(MatSnackBar)
  readonly dialog = inject(MatDialog);
  constructor() {}

  openSnackBar(message: string, action: string, panelClass: string) {
    let config = new MatSnackBarConfig();
    config.duration = 3000;
    config.verticalPosition = "top";
    config.horizontalPosition = "center";
    config.panelClass = ['snackbar', panelClass];
    this._snackBar.open(message, action, config);
  }
  openDialog(message: string, color: string, icon: string) {
    let config = new MatDialogConfig();
    config.minWidth = 500;
    config.data = {
      message: message,
      color: color,
      icon: icon
    };
    this.dialog.open(DialogComponent,config)
  }

  showSuccess(message: string) {
    this.openDialog(message,'#189323','check');
  }
  showErrorDialog(message: string) {
    this.openDialog(message,'#803232','warning');
  }

  showInfo(message: string) {
  }

  showWarningSnackbar(message: string) {
    this.openSnackBar(message,"OK","snackbar-warning");
  }
}
