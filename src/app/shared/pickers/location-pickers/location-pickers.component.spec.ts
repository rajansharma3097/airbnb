import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LocationPickersComponent } from './location-pickers.component';

describe('LocationPickersComponent', () => {
  let component: LocationPickersComponent;
  let fixture: ComponentFixture<LocationPickersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationPickersComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationPickersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
