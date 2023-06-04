import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.scss']
})
export class CreateDialogComponent {
  form!: FormGroup;
  newFolder!: string
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) newFolder: string,
  ) {
    this.newFolder = newFolder
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
