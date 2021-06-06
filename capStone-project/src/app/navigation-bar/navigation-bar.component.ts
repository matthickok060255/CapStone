import { Component, OnInit } from "@angular/core";
import { ThemeService } from "src/app/theme/theme.service";

@Component({
    selector: "app-navaiagation-bar",
    templateUrl: "./navigation-bar.component.html",
    styleUrls: ["./navigation-bar.component.scss"]
})
export class NaviationBarComponent implements OnInit {
    public bulb: String = "lightbulb"

    constructor(
        private themeService: ThemeService
    ) { }

    ngOnInit() {
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
}