import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { By } from '@angular/platform-browser';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should render the CatPurrfect logo with correct text', () => {
    const img = fixture.debugElement.query(By.css('img'));
    expect(img).toBeTruthy();
    expect(img.attributes['src']).toContain('assets/CatPurrfect.png');
    expect(img.attributes['alt']).toBe('CatPurrfect Logo');
  });

  it('Should display the correct intro text', () => {
    const paragraph = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(paragraph.textContent).toContain('The purrfect place to keep track of your feline friends!');
  });

  it('Should have a header element with expected text', () => {
    const header = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(header.textContent).toContain('Welcome to CatPurrfect');
  });

  it('Should contain a container div for content', () => {
    const container = fixture.debugElement.query(By.css('.container'));
    expect(container).toBeTruthy();
  });

  it('Should match snapshot of component HTML', () => {
    expect(fixture.nativeElement.innerHTML).toMatchSnapshot();
  });
});
