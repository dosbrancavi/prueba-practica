import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardGuideModalComponent } from './wizard-guide-modal.component';

describe('WizardGuideModalComponent', () => {
  let component: WizardGuideModalComponent;
  let fixture: ComponentFixture<WizardGuideModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WizardGuideModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WizardGuideModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
