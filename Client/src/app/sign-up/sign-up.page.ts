import { Component, OnInit } from "@angular/core";
import { Http } from "@angular/http";
import { NavController, AlertController } from "@ionic/angular";
import { Globals } from "../globals";

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.page.html",
  styleUrls: ["./sign-up.page.scss"],
})
export class SignUpPage implements OnInit {

  signUpButtonText: string;
  username: string;
  password: string;
  passwordConfirm: string;

  constructor(private navCtrl: NavController, private http: Http, private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.signUpButtonText = "Sign Up";
  }

  async signUp() {
    if (this.password == this.passwordConfirm) {
      try{
        this.signUpButtonText = "Sign You Up...";
        const response = await this.http.put(
          Globals.config.serverEndPoint + "/user",
          {
            username: this.username,
            password: this.password
          }
        ).toPromise();
        const alr = await this.alertCtrl.create({
          header: "User Created.",
          message: "Now you can login with your new username and password.",
          buttons: ["OK"]
        });
        alr.present();

        this.navCtrl.navigateBack("sign-in");
      }
      catch(e){
        const alr = await this.alertCtrl.create({
          header: "User Creation Failed.",
          message: "Please try again.",
          buttons: ["OK"]
        });
        alr.present();

        this.username = null;
        this.password = null;
        this.passwordConfirm = null;
      }
    }
    else{
      const alr = await this.alertCtrl.create({
        header: "Re-entered Password Not Match.",
        message: "Please check your password and enter again.",
        buttons: ["OK"]
      });
      alr.present();

      this.password = null;
      this.passwordConfirm = null;
      this.signUpButtonText = "Sign Up";
    }
  }

  signIn() {
    this.navCtrl.navigateBack("sign-in");
  }

}
