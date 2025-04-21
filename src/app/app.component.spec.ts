import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'CatPurrfect' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('CatPurrfect');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, CatPurrfect');
  });

  it('should have a main container div', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const mainContainer = compiled.querySelector('div.container');
    expect(mainContainer).toBeTruthy();
  });

  it('should contain a router-outlet element', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
    expect(routerOutlet).toBeTruthy();
  });

  it('should include a navbar component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const navbar = fixture.debugElement.query(By.css('app-navbar'));
    expect(navbar).toBeTruthy();
  });
});
