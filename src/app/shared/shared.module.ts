import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationPickersComponent } from './pickers/location-pickers/location-pickers.component';
import { MapModalComponent } from './map-modal/map-modal.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [LocationPickersComponent, MapModalComponent],
    imports: [CommonModule, IonicModule],
    exports: [LocationPickersComponent, MapModalComponent],
    entryComponents: [MapModalComponent]
})
export class SharedModule {}