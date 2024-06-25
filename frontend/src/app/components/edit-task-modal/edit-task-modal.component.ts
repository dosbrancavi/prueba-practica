import { Component, Inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DataService } from "../../services/data.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Task } from "../../interfaces/task.interface";
import { MatButtonModule } from "@angular/material/button";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";

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

  save(): void {
    if (this.editTaskForm.valid) {
      const updatedTask = {
        ...this.task,
        ...this.editTaskForm.value,
      };

      this.dataService
        .updateTask(updatedTask, localStorage.getItem("csrfToken")!)
        .subscribe({
          next: (res) => {
            this.dialogRef.close(res);
          },
          error: (err) => {
            console.error(err);
          },
        });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}