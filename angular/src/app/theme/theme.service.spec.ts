import { TestBed } from '@angular/core/testing';
import { Theme } from './theme';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get available themes', () => {
    let themes: Theme[] = service.getAvailableThemes();
    expect(themes.length).toBe(2);
  });

  it('should get active theme', () => {
    let theme = service.getActiveTheme();
    expect(theme.name).toBe("light");
    });

  it('should set dark and light theme', () => {
    service.setDarkTheme();
    expect(service.isDarkTheme()).toBeTruthy();

    service.setLightTheme();
    expect(service.isDarkTheme()).toBeFalsy();
  });


  it('should set active theme', () => {
    let themes: Theme[] = service.getAvailableThemes();
    service.setActiveTheme(themes[1]);
    expect(service.isDarkTheme()).toBeTruthy();
  });
});
