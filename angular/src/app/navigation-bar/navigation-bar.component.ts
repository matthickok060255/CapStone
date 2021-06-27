
import { User } from './../domainObjects/user';
import { Component, OnInit } from "@angular/core";
import { ThemeService } from "src/app/theme/theme.service";
import { AccountService } from '../account/account.service';
import { Router } from '@angular/router';

@Component({
    selector: "app-navaiagation-bar",
    templateUrl: "./navigation-bar.component.html",
    styleUrls: ["./navigation-bar.component.scss"]
})
export class NaviationBarComponent implements OnInit {
    public bulb: String = "lightbulb"
    public user!: User;

    constructor(
        private themeService: ThemeService,
        private accountService: AccountService,
        public router: Router
    ) { }

    ngOnInit() {
      this.user = this.accountService.userValue;
      console.log(this.user);
        this.toggleTheme();

    }

    toggleTheme() {
        if (this.themeService.isDarkTheme()) {
            this.themeService.setLightTheme();
            this.bulb = "lightbulb";
        } else {
            this.themeService.setDarkTheme();
            this.bulb = "lightbulb_outline";

        }
    }

    createGame() {
      this.router.navigateByUrl("createGame/");
    }
}
