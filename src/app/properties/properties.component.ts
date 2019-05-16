import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent {
  constructor() { }
  @Output() propertyChange: EventEmitter<any> = new EventEmitter();
  public directions: Array<string> = ['Horizontal', 'Vertical'];
  public roadLength = 80;
  public valueChange(event: Event) {
    this.propertyChange.emit(event.target);
  }
}
