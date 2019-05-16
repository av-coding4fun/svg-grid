import { Component, HostListener, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-singleroad',
  templateUrl: './singleroad.component.html',
})
export class SingleRoadComponent {
  @Output() getSvgSource: EventEmitter<any> = new EventEmitter();
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.stopPropagation();
    this.getSvgSource.emit({svgSource: 'roadLine', x: event.pageX, y: event.pageY});
 }
}
