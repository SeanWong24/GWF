import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Tag } from '../../Tag';
import { Http, Headers } from '@angular/http';
import { Globals } from 'src/app/globals';

@Component({
  selector: 'app-add-tag-modal',
  templateUrl: './add-tag-modal.page.html',
  styleUrls: ['./add-tag-modal.page.scss'],
})
export class AddTagModalPage implements OnInit {

  @Input() pickedDate: string;
  @Input() selectedVariableName: string;
  @Input() currentTag: Tag;

  @Input() private isModifying: boolean;

  sharedUserList: { id: string, username: string }[] = [];

  get isDateLimited() {
    return this.currentTag.date as unknown as boolean;
  }
  set isDateLimited(value: boolean) {
    this.currentTag.date = this.pickedDate;
  }

  get isVariableLimited() {
    return this.currentTag.variable as unknown as boolean;
  }
  set isVariableLimited(value: boolean) {
    this.currentTag.variable = this.selectedVariableName;
  }

  constructor(private modalCtrl: ModalController, private http: Http, private alertCtrl: AlertController) { }

  ngOnInit() {
  }


  removeSharedUser(user: { id: string, username: string }) {
    var index = this.sharedUserList.findIndex(u => u.id == user.id);
    this.sharedUserList.splice(index, 1);
  }

  async save() {
    const id = sessionStorage.getItem("userId");
    if(this.isModifying){
      await this.modify(id);
    }
    else{
      await this.add(id);
    }
  }

  private async add(id: string) {
    try {
      const response = await this.http.put(
        Globals.config.serverEndPoint + "/tag",
        this.currentTag,
        {
          headers: new Headers({
            "User-Unique-Id": id ? id : ""
          })
        }).toPromise();
      this.close();
    }
    catch (e) {
      const alt = await this.alertCtrl.create({
        header: "Fail to Create.",
        message: "Please try again.",
        buttons: [
          "OK"
        ]
      });
      alt.present();
    }
  }

  private async modify(id: string) {
    try {
      const response = await this.http.post(
        Globals.config.serverEndPoint + "/tag",
        this.currentTag
      ).toPromise();
      this.close();
    }
    catch (e) {
      const alt = await this.alertCtrl.create({
        header: "Fail to Update.",
        message: "Please try again.",
        buttons: [
          "OK"
        ]
      });
      alt.present();
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
