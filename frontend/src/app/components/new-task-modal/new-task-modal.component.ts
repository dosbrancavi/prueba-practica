import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DataService } from "../../services/data.service";
import { CreateTask, Task } from "../../interfaces/task.interface";
import { MatDialogRef } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatSelectModule } from "@angular/material/select";
import { Router } from "@angular/router";
import {
  ImageCropperComponent,
  ImageCroppedEvent,
} from "ngx-image-cropper";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

@Component({
  selector: "app-new-task-modal",
  standalone: true,
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatGridListModule,
    MatSelectModule,
    ImageCropperComponent,
  ],
  templateUrl: "./new-task-modal.component.html",
  styleUrl: "./new-task-modal.component.css",
})
export class NewTaskModalComponent {
  @ViewChild("imageCanvas") canvas!: ElementRef<HTMLCanvasElement>;

  selectedFileName: string | null = null;
  token = "";
  id: string | null = null;
  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl = '';
  imageBlob: Blob | null | undefined = null;
  imageFile!: File;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private router: Router,
    private dialogRef: MatDialogRef<NewTaskModalComponent>,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  createTaskForm: FormGroup = this.formBuilder.group({
    description: ["", [Validators.required, Validators.maxLength(100)]],
    status: ["Pendiente", [Validators.required]],
    imageUrl: [""],
  });

  get description() { return this.createTaskForm.controls["description"]; }
  get status() { return this.createTaskForm.controls["status"]; }

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl!);
    this.imageBlob = event.blob;
  }

  imageResult(){
    if(this.imageBlob){
      this.imageFile = new File([this.imageBlob], this.selectedFileName || 'croppedImage.png', { type: 'image/png' });

    }
  }

  close(): void {
    this.dialogRef.close();
  }

  create(): void {
    
      this.imageResult();
      const user = JSON.parse(localStorage.getItem('user')!);
      this.token = user.csrfToken
      const body: CreateTask = {
        description: this.description.value,
        status: this.status!.value,
        imageFile: this.imageFile,
        user: { id: user.user.id },
      
      };

      this.dataService.createTask(body, this.token).subscribe({
        next: (res) => {
          console.log("Tarea creada exitosamente:", res);
          this.close();
        },
        error: (err) => {
          console.error("Error al crear la tarea:", err);
          if (err.status === 401) {
            localStorage.removeItem("user");
            this.router.navigate(["/login"]);
            this.close();
          }
        },
      });
    
  }
}
