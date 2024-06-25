import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { CreateTask, Task } from '../../interfaces/task.interface';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-new-task-modal',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule, MatButtonModule, MatGridListModule, MatSelectModule],
  templateUrl: './new-task-modal.component.html',
  styleUrl: './new-task-modal.component.css'
})
export class NewTaskModalComponent {
  createTaskForm: FormGroup;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  token = '';
  id = null;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    public dialogRef: MatDialogRef<NewTaskModalComponent>
  ) {
    this.createTaskForm = this.formBuilder.group({
      description: ['', Validators.required],
      status: ['Pendiente', Validators.required],
      imageUrl: ['']
    });
  }

  get description() { return this.createTaskForm.get('description'); }
  get status() { return this.createTaskForm.get('status'); }
  get imageUrl() { return this.createTaskForm.get('imageUrl'); }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
      const reader = new FileReader();
      reader.onload = () => {
        this.createTaskForm.patchValue({ imageUrl: reader.result });
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  create(): void {
    if (this.createTaskForm.valid) {
     const user = JSON.parse(localStorage.getItem('user')!);
      this.token = user.csrfToken;
      this.id = user.user.id;

      console.log(this.selectedFile)
      // if (!id) {
      //   console.error('No se pudo obtener el ID del usuario.');
      //   return;
      // }

      const body: CreateTask = {
        description: this.description!.value,
        status: this.status!.value,
        imageFile: this.selectedFile,
        user: { id: this.id! }
      };

      this.dataService.createTask(body, this.token).subscribe({
        next: (res) => {
          console.log(res);
          this.close();
        },
        error: (err) => {
          console.error('Error al crear la tarea:', err);
        }
      });
    } else {
      console.error('El formulario no es válido.');
    }
  }
}
