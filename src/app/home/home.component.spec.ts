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

  it('Should display the hero section message', () => {
    const paragraph = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(paragraph.textContent).toContain('The purrfect place to keep track of your feline friends!');
  });

  it('Should contain the hero section div', () => {
    const hero = fixture.debugElement.query(By.css('.hero-section'));
    expect(hero).toBeTruthy();
  });

  it('Should render exactly one image (logo)', () => {
    const imgs = fixture.debugElement.queryAll(By.css('img'));
    expect(imgs.length).toBe(1);
  });

  it('Should render exactly one paragraph', () => {
    const paragraphs = fixture.debugElement.queryAll(By.css('p'));
    expect(paragraphs.length).toBe(1);
  });

});
