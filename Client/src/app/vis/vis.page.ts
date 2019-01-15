import { Component, OnInit } from "@angular/core";
import { Tag } from "./Tag";
import { NavController, AlertController, PopoverController } from "@ionic/angular";
import { Http, Headers } from "@angular/http";
import { Globals } from "../globals";
import { DatasetInfo } from "../DatasetInfo";

@Component({
  selector: "app-vis",
  templateUrl: "./vis.page.html",
  styleUrls: ["./vis.page.scss"],
})
export class VisPage implements OnInit {

  username: string;
  userTagList: Tag[] = [];
  datasetInfo: DatasetInfo = {} as DatasetInfo;
  pickedDate: string;
  selectedVariableName: string;
  selectRectForAddingTag: boolean = true;

  resetVisImageTransform: () => void;
  resetPCBrush: () => void;
  updateChart: (date: string, xMin?: number, yMin?: number, xMax?: number, yMax?: number) => void;


  constructor(private navCtrl: NavController, private http: Http, private alertCtrl: AlertController) { }

  async ngOnInit() {
    this.verifyUser();

    this.datasetInfo = await this.obtainDatasetInfo();
    this.pickedDate = this.datasetInfo.minDate;
    this.selectedVariableName = this.datasetInfo.variableList[0];
  }

  private async obtainDatasetInfo() {
    var response = await this.http.get(Globals.config.serverEndPoint + "/dataset").toPromise();
    return response.json();
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
      this.obtainUserTags();
    }
  }

  obtainUserTags = async () => {
    const id = sessionStorage.getItem("userId");
    const response = await this.http.get(Globals.config.serverEndPoint + "/tag", {
      headers: new Headers({
        "User-Unique-Id": id ? id : ""
      })
    }).toPromise();
    this.userTagList = response.json();
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
