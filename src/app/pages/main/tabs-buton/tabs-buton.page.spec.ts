import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsButonPage } from './tabs-buton.page';

describe('TabsButonPage', () => {
  let component: TabsButonPage;
  let fixture: ComponentFixture<TabsButonPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsButonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
