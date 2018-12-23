import { Component, OnInit } from "@angular/core";
import { Tag } from "./Tag";
import { NavController, AlertController, PopoverController } from "@ionic/angular";
import { Http, Headers } from "@angular/http";
import { Globals } from "../globals";

@Component({
  selector: "app-vis",
  templateUrl: "./vis.page.html",
  styleUrls: ["./vis.page.scss"],
})
export class VisPage implements OnInit {

  username: string;
  userTagList: Tag[] = [];
  appConfig = Globals.config;
  pickedDate: string;
  selectedVariableName: string;

  resetVisImageTransform: () => void;


  constructor(private navCtrl: NavController, private http: Http, private alertCtrl: AlertController) { }

  async ngOnInit() {
    this.verifyUser();

    this.pickedDate = this.appConfig.minDate;
    this.selectedVariableName = this.appConfig.variableList[0];
  }

  private async verifyUser() {
    var username = await this.obtainUsername();
    if (!username) {
      const alr = await this.alertCtrl.create({
        header: "Fail to Obtain User Info.",
        message: "Please sign in again.",
        buttons: ["OK"]
      });
      alr.present();
      this.navCtrl.navigateBack("sign-in");
    } else {
      this.username = username;
      this.userTagList = await this.obtainUserTags();
    }
  }

  private async obtainUserTags() {
    const id = sessionStorage.getItem("userId");
    const response = await this.http.get(Globals.config.serverEndPoint + "/tag", {
      headers: new Headers({
        "User-Unique-Id": id ? id : ""
      })
    }).toPromise();
    return response.json();
  }

  private async obtainUsername() {
    const id = sessionStorage.getItem("userId");
    const response = await this.http.get(Globals.config.serverEndPoint + "/user", {
      headers: new Headers({
        "User-Unique-Id": id ? id : ""
      })
    }).toPromise();
    return response.text();
  }

  signOutClick() {
    sessionStorage.removeItem("userId");
    this.navCtrl.navigateBack("sign-in");
  }

}
