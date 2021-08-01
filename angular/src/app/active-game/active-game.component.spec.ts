import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AccountService } from '../account/account.service';
import { Game } from '../domainObjects/game';
import { gameState } from '../domainObjects/gameStateEnum';
import { User } from '../domainObjects/user';
import { ActiveGameComponent } from './active-game.component';

class mockRouter {
  navigateByUrl(url: any, extras?: any): any {
    return null;
  }

  navigate(commands: any[], extras?: any): any {
    return null;
  }
}

class mockAccountService {
  userValue: User = new User();
  login(user: User): Observable<any> {
    return of(null);
  }
}

class mockActivatedRoute {
  params = of({id: "test"})
}



describe('ActiveGameComponent', () => {
  let component: ActiveGameComponent;
  let fixture: ComponentFixture<ActiveGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveGameComponent ],
      providers: [{provide: ActivatedRoute, useClass: mockActivatedRoute},
        {provide: Router, useClass: mockRouter},
        {provide: AccountService, useClass: mockAccountService},
      ],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();


    component.game =  new Game("name",
    15,
    10,
    1,
    true,
    false,
    true,
    "",
    new Date(),
    0,
    gameState.CREATED);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send pusher notifications', () => {
    let user = new User();
    user.id = "1";
    user.role = "werewolf";
    user.username = "testUser";
    component.sendPlayerInfo(user);
    component.removePlayerInfo(user);

    expect(component).toBeTruthy();
  });

  it('should go through day cycles', () => {
    let user1 = new User();
    user1.id = "1";
    user1.role = "werewolf";
    user1.username = "testUser1";

    let user2 = new User();
    user2.id = "2";
    user2.role = "werewolf";
    user2.username = "testUser2";

    let user3 = new User();
    user3.id = "3";
    user3.role = "villager";
    user3.username = "testUser3";

    let user4 = new User();
    user4.id = "4";
    user4.role = "villager";
    user4.username = "testUser4";

    let user5 = new User();
    user5.id = "5";
    user5.role = "villager";
    user5.username = "testUser5";


    // With no vote
    component.idToUserNameMap.clear();
    component.isDay = true;
    component.checkCycles();

    // With a tie vote
    component.isDay = true;
    component.idToUserNameMap.set(user1.id, user1);
    component.idToUserNameMap.set(user2.id, user2);
    component.idToUserNameMap.set(user3.id, user3);
    component.idToUserNameMap.set(user4.id, user4);
    component.idToUserNameMap.set(user5.id, user5);

    component.checkCycles();
    component.idToUserNameMap.forEach(((user: User, userId: string) => {
      expect(user.isEliminated).toBeFalsy();
      user.isEliminated = false;
    }))

    // With a player being voted out
    component.isDay = true;
    user1.voteCount = 2;
    user4.voteCount = 3;
    component.idToUserNameMap.set(user1.id, user1);
    component.idToUserNameMap.set(user4.id, user4);
    component.checkCycles();


    expect(component.idToUserNameMap.get("4")?.isEliminated).toBeTruthy();
  });

  it('should go through night cycles', () => {
    let user1 = new User();
    user1.id = "1";
    user1.role = "werewolf";
    user1.username = "testUser1";

    let user2 = new User();
    user2.id = "2";
    user2.role = "werewolf";
    user2.username = "testUser2";

    let user3 = new User();
    user3.id = "3";
    user3.role = "villager";
    user3.username = "testUser3";

    let user4 = new User();
    user4.id = "4";
    user4.role = "villager";
    user4.username = "testUser4";

    let user5 = new User();
    user5.id = "5";
    user5.role = "villager";
    user5.username = "testUser5";


    // With no vote
    component.idToUserNameMap.clear();
    component.isDay = false;
    component.checkCycles();

    // With a tie vote
    component.isDay = false;
    component.idToUserNameMap.set(user1.id, user1);
    component.idToUserNameMap.set(user2.id, user2);
    component.idToUserNameMap.set(user3.id, user3);
    component.idToUserNameMap.set(user4.id, user4);
    component.idToUserNameMap.set(user5.id, user5);

    component.checkCycles();
    component.idToUserNameMap.forEach(((user: User, userId: string) => {
      expect(user.isEliminated).toBeFalsy();
      user.isEliminated = false;
    }))

    // With a player being voted out
    component.isDay = false;
    user4.voteCount = 2;
    component.idToUserNameMap.set(user4.id, user4);
    component.checkCycles();

    expect(component.idToUserNameMap.get("4")?.isEliminated).toBeTruthy();
  });

  it('should assign roles', () => {
    let user1 = new User();
    user1.id = "1";
    user1.username = "testUser1";

    let user2 = new User();
    user2.id = "2";
    user2.username = "testUser2";

    let user3 = new User();
    user3.id = "3";
    user3.username = "testUser3";

    let user4 = new User();
    user4.id = "4";
    user4.username = "testUser4";

    let user5 = new User();
    user5.id = "5";
    user5.username = "testUser5";


    component.assignRoles();
    component.idToUserNameMap.forEach(((user: User, userId: string) => {
      expect(user.role).toBeTruthy();
    }))
  });

  it('should check states', () => {
    component.isDay = true;
    expect(component.isDayCycle()).toBeTruthy();

    let user1 = new User();
    user1.id = "1";
    user1.username = "testUser1";
    component.user = user1;
    component.game.createdBy = "testUser1";
    expect(component.isCreator()).toBeTruthy();

    expect(component.isWerewolf()).toBeFalse();
    component.role = "werewolf";
    component.user = user1;
    component.game.createdBy = "testUser1";
    component.isDay = false;
    expect(component.isWerewolf()).toBeTrue();

    component.user = user1;
    component.idToUserNameMap.set(user1.id, user1);
    expect(component.validPlayer).toBeTrue();
  });

  it('should vote for user', () => {
    let user1 = new User();
    user1.id = "1";
    user1.role = "werewolf";
    user1.username = "testUser1";

    let user2 = new User();
    user2.id = "2";
    user2.role = "werewolf";
    user2.username = "testUser2";

    let user3 = new User();
    user3.id = "3";
    user3.role = "villager";
    user3.username = "testUser3";

    let user4 = new User();
    user4.id = "4";
    user4.role = "villager";
    user4.username = "testUser4";

    let user5 = new User();
    user5.id = "5";
    user5.role = "villager";
    user5.username = "testUser5";


    // With no vote
    component.idToUserNameMap.clear();
    component.isDay = false;

    // With a tie vote
    component.isDay = false;
    component.idToUserNameMap.set(user1.id, user1);
    component.idToUserNameMap.set(user2.id, user2);
    component.idToUserNameMap.set(user3.id, user3);
    component.idToUserNameMap.set(user4.id, user4);
    component.idToUserNameMap.set(user5.id, user5);
    component.voteClicked("4");
    expect(component.idToUserNameMap.get("4")?.voteCount).toBe(1);
    component.voteClicked("4");
  });

  it('should reveal a user', () => {
    let user1 = new User();
    user1.id = "1";
    user1.role = "werewolf";
    user1.username = "testUser1";

    let user2 = new User();
    user2.id = "2";
    user2.role = "werewolf";
    user2.username = "testUser2";

    let user3 = new User();
    user3.id = "3";
    user3.role = "villager";
    user3.username = "testUser3";

    let user4 = new User();
    user4.id = "4";
    user4.role = "villager";
    user4.username = "testUser4";

    let user5 = new User();
    user5.id = "5";
    user5.role = "villager";
    user5.username = "testUser5";


    // With no vote
    component.idToUserNameMap.clear();
    component.isDay = false;

    // With a tie vote
    component.isDay = false;
    component.idToUserNameMap.set(user1.id, user1);
    component.idToUserNameMap.set(user2.id, user2);
    component.idToUserNameMap.set(user3.id, user3);
    component.idToUserNameMap.set(user4.id, user4);
    component.idToUserNameMap.set(user5.id, user5);
    component.revealClicked("4");
    expect(component.idToUserNameMap.get("4")?.isRevealed).toBe(true);
    component.revealClicked("4");
  });

  it('should reveal a user', () => {
    let user1 = new User();
    user1.id = "1";
    user1.role = "werewolf";
    user1.username = "testUser1";

    let user2 = new User();
    user2.id = "2";
    user2.role = "werewolf";
    user2.username = "testUser2";

    let user3 = new User();
    user3.id = "3";
    user3.role = "villager";
    user3.username = "testUser3";

    let user4 = new User();
    user4.id = "4";
    user4.role = "villager";
    user4.username = "testUser4";

    let user5 = new User();
    user5.id = "5";
    user5.role = "villager";
    user5.username = "testUser5";


    // With no vote
    component.idToUserNameMap.clear();
    component.isDay = false;

    // With a tie vote
    component.isDay = false;
    component.idToUserNameMap.set(user1.id, user1);
    component.idToUserNameMap.set(user2.id, user2);
    component.idToUserNameMap.set(user3.id, user3);
    component.idToUserNameMap.set(user4.id, user4);
    component.idToUserNameMap.set(user5.id, user5);
    component.protectClicked("4");
    expect(component.idToUserNameMap.get("4")?.isProtected).toBe(true);
    component.protectClicked("4");
  });
});
