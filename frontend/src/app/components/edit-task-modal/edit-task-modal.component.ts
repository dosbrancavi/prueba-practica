import { ChangeDetectorRef, Component, Inject, inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DataService } from "../../services/data.service";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { CreateTask, Task } from "../../interfaces/task.interface";
import { MatButtonModule } from "@angular/material/button";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { Router } from "@angular/router";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { ImageCroppedEvent, ImageCropperComponent } from "ngx-image-cropper";

@Component({
  selector: "app-edit-task-modal",
  standalone: true,
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatGridListModule,
    MatSelectModule,
    ImageCropperComponent,
    MatDialogModule
  ],
  templateUrl: "./edit-task-modal.component.html",
  styleUrl: "./edit-task-modal.component.css",
})
export class EditTaskModalComponent {
  selectedFileName: string | null = null;
  token = ''
  router: Router = inject(Router)
  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl = '';
  imageBlob: Blob | null | undefined = null;
  imageFile!: File;
  selecImage: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    public dialogRef: MatDialogRef<EditTaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) public task: Task,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  editTaskForm: FormGroup = this.formBuilder.group({
    description: [this.task.description, [Validators.required]],
    status: [this.task.status, [Validators.required]],
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

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
    this.selecImage = true;
    this.cdr.detectChanges();
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl!);
    this.imageBlob = event.blob;
    this.editTaskForm.patchValue({ imageUrl: event.objectUrl });
    this.cdr.detectChanges(); 
  }

  cut(){
    this.selecImage = false
    this.cdr.detectChanges(); 
  }
  
  imageResult(){
    if(this.imageBlob){
      this.imageFile = new File([this.imageBlob], this.selectedFileName || 'croppedImage.png', { type: 'image/png' });

    }
  }
  

  save(): void {

    this.imageResult();

    this.task.imageFile = this.imageFile
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
