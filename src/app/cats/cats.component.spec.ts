import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { CatsComponent } from './cats.component';
import { AuthService } from '../services/auth.service';
import { CatService } from '../services/cat.service';
import { of, BehaviorSubject } from 'rxjs';

class MockAuthService {
  private loggedIn = new BehaviorSubject<boolean>(true);

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  getLoggedInValue() {
    return this.loggedIn.getValue();
  }

  setLoggedIn(value: boolean) {
    this.loggedIn.next(value);
  }
}

class MockCatService {
  getUserCats(userId: string) {
    return of([]);
  }

  addCat(cat: any, userId: string) {
    return of({});
  }

  updateCat(id: string, cat: any) {
    return of(cat);
  }

  deleteCat(id: string) {
    return of({});
  }
}

class MockActivatedRoute {
  snapshot = {
    paramMap: {
      get: () => null
    }
  };
}

beforeAll(() => {
  (globalThis as any).google = {
    maps: {
      Map: class {
        addListener() {}
      },
      LatLngLiteral: class {},
      MapTypeId: { ROADMAP: 'roadmap' },
      Animation: { DROP: 'drop' },
      Marker: class {
        setMap(_: any) {}
        getTitle() {
          return '';
        }
        addListener() {}
      },
      InfoWindow: class {
        constructor(_: any) {}
        open() {}
      }
    }
  };
});

describe('CatsComponent', () => {
  let component: CatsComponent;
  let fixture: ComponentFixture<CatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CatsComponent
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: CatService, useClass: MockCatService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});