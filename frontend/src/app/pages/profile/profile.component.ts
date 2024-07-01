import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { UserResponse } from '../../interfaces/user.interface';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatCardModule, MatGridListModule, MatButtonModule, MatIconModule, MatInputModule, MatChipsModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  session = JSON.parse(localStorage.getItem('user')!);
  user!: UserResponse;
  router: Router = inject(Router);
  token!: string;
  disabled: boolean = true;
  userTaken: boolean = false;
  editUserForm: FormGroup;
  edited: boolean = false;


  constructor(private formBuilder: FormBuilder, private dataService: DataService) {
    this.editUserForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(9), Validators.pattern("\\d{4}-\\d{4}")]],
      age: ['', [Validators.required]],
      gender: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.token = this.session.csrfToken;
    this.dataService.getUserById(this.token, Number(this.session.user.id)).subscribe({
      next: (result) => {
        this.user = result;
        this.editUserForm.patchValue({
          username: this.user.username,
          phoneNumber: this.user.phoneNumber,
          age: this.user.age,
          gender: this.user.gender
        });
      },
      error: (err) => {
        if (err.status === 401) {
          localStorage.removeItem("user");
          this.router.navigate(["/login"]);
        }
      }
    });
  }

  get username() { return this.editUserForm.get('username'); }
  get phoneNumber() { return this.editUserForm.get('phoneNumber'); }
  get age() { return this.editUserForm.get('age'); }
  get gender() { return this.editUserForm.get('gender'); }

  logOut() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  delete(){
    this.dataService.deleteUser(this.token, Number(this.user.id)).subscribe({
      next: () => {
        localStorage.removeItem("user");
        this.router.navigate(["/login"]);
      },
      error: (error) => {
        if(error.status === 401){
          localStorage.removeItem("user");
          this.router.navigate(["/login"]);
        }
      }
    })
  }

  update(){
    const body:UserResponse = {
      username: this.username?.value,
      gender: this.gender?.value,
      age: this.age?.value,
      id: this.user.id,
      phoneNumber: this.phoneNumber?.value
    }
    console.log(body);
    this.dataService.updateUser(this.token, body).subscribe({
      next: (res) => {
        this.edited = true;
        setTimeout(() => {this.edited = false},3000)
      },
      error: (err) => {
        if(err.status === 401){
          localStorage.removeItem("user");
          this.router.navigate(["/login"]);
        }else{
          this.userTaken = true;
          console.log(this.userTaken)
          setTimeout(() => {this.userTaken = false},3000)
        }
      }
    })
  }

  back() {
    this.router.navigate(['/tasks']);
  }
}

