import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapModalComponent } from '../../map-modal/map-modal.component';

@Component({
  selector: 'app-location-pickers',
  templateUrl: './location-pickers.component.html',
  styleUrls: ['./location-pickers.component.scss'],
})
export class LocationPickersComponent implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  onPickLocation() {
    this.modalCtrl.create({component: MapModalComponent})
      .then(modelEl => {
        modelEl.present();
      });
  }

}
