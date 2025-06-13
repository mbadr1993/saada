import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { UserService } from './services/user.service';
import { NavigationComponent } from './components/core/navigation/navigation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule, CommonModule, NavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'saada';
  constructor(
    private translate: TranslateService,
    public userService: UserService,
    private router: Router
  ) {
    translate.addLangs(['en', 'ar']);
    translate.setDefaultLang('ar');
    translate.use('ar');
  }

  ngOnInit() {
    this.userService.loadUser();
    if (this.userService.user) {
      // Set auto sign out for 60 minutes (example)
      this.userService.setAutoSignOut(60, () => {
        this.router.navigate(['/']);
      });
    }
  }
}
