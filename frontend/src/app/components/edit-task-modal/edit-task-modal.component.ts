import { Component, Inject, inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DataService } from "../../services/data.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { CreateTask, Task } from "../../interfaces/task.interface";
import { MatButtonModule } from "@angular/material/button";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { Router } from "@angular/router";

@Component({
  selector: "app-edit-task-modal",
  standalone: true,
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatGridListModule,
    MatSelectModule,
  ],
  templateUrl: "./edit-task-modal.component.html",
  styleUrl: "./edit-task-modal.component.css",
})
export class EditTaskModalComponent {
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  token = ''
  router: Router = inject(Router)
  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    public dialogRef: MatDialogRef<EditTaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) public task: Task
  ) {}

  editTaskForm: FormGroup = this.formBuilder.group({
    description: [this.task.description, Validators.required],
    status: [this.task.status, Validators.required],
    imageUrl: [this.task.imageUrl],
  });

  get description() {
    return this.editTaskForm.get("description");
  }
  get status() {
    return this.editTaskForm.get("status");
  }
  get imageUrl() {
    return this.editTaskForm.get("imageUrl");
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
      const reader = new FileReader();
      reader.onload = () => {
        this.editTaskForm.patchValue({ imageUrl: reader.result });
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  save(): void {

    this.task.imageFile = this.selectedFile
    if (this.editTaskForm.valid) {
      const updatedTask = {
        ...this.task,
        ...this.editTaskForm.value,
      };
      const user = JSON.parse(localStorage.getItem("user")!);
     
      this.token = user.csrfToken
      this.dataService
        .updateTask(updatedTask, this.token)
        .subscribe({
          next: (res) => {
            this.dialogRef.close(updatedTask);
          },
          error: (err) => {
            if (err.status === 401) {
              localStorage.removeItem('user');
              this.router.navigate(['/login']);
              this.close();
            }
          },
        });
    }
  }

  delete(){
    const user = JSON.parse(localStorage.getItem("user")!);
    this.token = user.csrfToken
    this.dataService.deleteTask(this.task.id!,this.token).subscribe({
      next: (res) => {
        this.close();
      },
      error: (err) => {
        if(err.status === 401){
          localStorage.removeItem('user');
          this.router.navigate(['/login'])
          this.close();
        }
      }
    })
  }

  close(): void {
    this.dialogRef.close();
  }
}
