import { Component, OnInit } from "@angular/core";
import { Http } from "@angular/http";
import { NavController, AlertController } from "@ionic/angular";
import { Globals } from "../globals";

@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.page.html",
  styleUrls: ["./sign-in.page.scss"],
})
export class SignInPage implements OnInit {

  signInButtonText: string;
  username: string;
  password: string;

  constructor(private navCtrl: NavController, private http: Http, private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.signInButtonText = "Sign In";
    this.username = undefined;
    this.password = undefined;
  }

  async signIn() {
    this.signInButtonText = "Sign You In...";
    const response = await this.http.post(
      Globals.config.serverEndPoint + "/user/verify",
      {
        username: this.username,
        password: this.password
      }
    ).toPromise();
    const responseText = response.text();
    if (!responseText || responseText == "") {
      const alr = await this.alertCtrl.create({
        header: "Authorization Failed.",
        message: "Please try again.",
        buttons: ["OK"]
      });
      alr.present();
      this.password = null;
      this.signInButtonText = "Login";
    } else {
      sessionStorage.setItem("userId", responseText.toString());
      this.navCtrl.navigateForward("vis");
    }
  }

  signUp() {
    this.navCtrl.navigateForward("sign-up");
  }
}
