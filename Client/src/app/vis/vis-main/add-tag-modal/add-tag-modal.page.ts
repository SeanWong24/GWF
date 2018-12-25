import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-tag-modal',
  templateUrl: './add-tag-modal.page.html',
  styleUrls: ['./add-tag-modal.page.scss'],
})
export class AddTagModalPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
