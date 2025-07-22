import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableLight } from './data-table-light';

describe('DataTableLight', () => {
  let component: DataTableLight;
  let fixture: ComponentFixture<DataTableLight>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableLight]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataTableLight);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
