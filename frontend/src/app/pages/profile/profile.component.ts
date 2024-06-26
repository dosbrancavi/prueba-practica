import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatCardModule, MatGridListModule, MatButtonModule, MatIconModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  session = JSON.parse(localStorage.getItem('user')!);
  user = this.session.user;
  name= this.user.username;
  age= this.user.age;
  phoneNumber= this.user.phoneNumber;
  gender= this.user.gender;
  router: Router = inject(Router);


  logOut(){
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  back(){
    this.router.navigate(['/tasks']);

  }
}
