import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatSliderModule} from '@angular/material/slider';


@Component({
  selector: 'app-wizard-guide-modal',
  standalone: true,
  imports: [MatDialogModule,MatSliderModule, MatButtonModule],
  templateUrl: './wizard-guide-modal.component.html',
  styleUrl: './wizard-guide-modal.component.css'
})
export class WizardGuideModalComponent {
  sliderValue = 1

  constructor(public dialogRef: MatDialogRef<WizardGuideModalComponent>) {}

  previous(): void {
    if(this.sliderValue > 1){
      this.sliderValue = this.sliderValue -1
    }
  }

  next(): void {
   if (this.sliderValue < 4) {
    this.sliderValue = this.sliderValue + 1
   }
  }

  noGuide(){
    localStorage.setItem('guide', 'true')
  }
}
