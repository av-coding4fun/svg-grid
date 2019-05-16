import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { PropertiesComponent } from './properties/properties.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public constructor(private renderer: Renderer2) { }
  public title = 'road-test';
  public gridSquarePx = 20;
  public svgPattern: String;
  public svgSourceElement: any;
  public selectedBox: HTMLDivElement;
  @ViewChild('xRuler') rulerElementX: ElementRef;
  @ViewChild('yRuler') rulerElementY: ElementRef;
  @ViewChild('mainContainer') mainContainer: ElementRef;
  @ViewChild('editorContainer') editorContainer: ElementRef;
  @ViewChild('diagramContainer') diagramContainer: ElementRef;
  @ViewChild('properties') properties: PropertiesComponent;
  public rulerContextX: CanvasRenderingContext2D;
  public rulerContextY: CanvasRenderingContext2D;
  public gridContainer: SVGElement;
  public gridProperties: any = {
    roadLength: 0,
    direction: ''
  };
  public components: Array<any> = [];
  public ngOnInit(): void {
    this.gridProperties.roadLength = this.properties.roadLength;
    this.gridProperties.direction = this.properties.directions[0];
    this.rulerContextX = this.rulerElementX.nativeElement.getContext('2d');
    this.rulerContextY = this.rulerElementY.nativeElement.getContext('2d');
    if (this.gridProperties.direction === 'Horizontal') {
      this.drawRulerX();
    } else if (this.gridProperties.direction === 'Vertical') {
      this.drawRulerY();
    }
  }
  public onMouseWheelInGrid(event: WheelEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.deltaY < 0) {
      this.gridSquarePx = this.gridSquarePx + 4;
    } else if (event.deltaY > 0 && this.gridSquarePx - 20 > 0) {
      this.gridSquarePx = this.gridSquarePx - 4;
    }
    if (this.gridProperties.direction === 'Horizontal') {
      this.drawRulerX();
    } else if (this.gridProperties.direction === 'Vertical') {
      this.drawRulerY();
    }
    if (this.selectedBox) {
      this.selectedBox.style.width = `${this.gridSquarePx}px`;
      this.selectedBox.style.height = `${this.gridSquarePx}px`;
    }
  }
  public drawRulerX() {
    const length = this.getGridWidth();
    this.rulerContextX.canvas.width = length;
    this.rulerContextX.clearRect(0, 0, length, 20);
    this.rulerContextX.lineWidth = 1;
    this.rulerContextX.beginPath();
    this.rulerContextX.moveTo(0, 20);
    this.rulerContextX.lineTo(length, 20);
    this.rulerContextX.textAlign = 'center';
    const step = this.gridSquarePx / 4;
    for (let interval = 0; interval <= length; interval = interval + step) {
      if (interval % this.gridSquarePx === 0) {
        this.rulerContextX.fillText(`${interval / this.gridSquarePx * 4}`, interval, 8);
        this.rulerContextX.moveTo(interval, 10);
        this.rulerContextX.lineTo(interval, 20);
      } else if (this.gridSquarePx >= 28) {
        this.rulerContextX.moveTo(interval, 14);
        this.rulerContextX.lineTo(interval, 20);
      }
    }
    this.rulerContextX.stroke();
  }
  public drawRulerY() {
    const length = this.getGridHeight();
    this.rulerContextY.canvas.height = length;
    this.rulerContextY.clearRect(0, 0, 20, length);
    this.rulerContextY.lineWidth = 1;
    this.rulerContextY.beginPath();
    this.rulerContextY.moveTo(20, 0);
    this.rulerContextY.lineTo(20, length);
    this.rulerContextY.textBaseline = 'middle';
    this.rulerContextY.textAlign = 'center';
    const step = this.gridSquarePx / 4;
    for (let interval = 0; interval <= length; interval = interval + step) {
      if (interval % this.gridSquarePx === 0) {
        this.rulerContextY.save();
        this.rulerContextY.setTransform(-1, 0, 0, -1, 6, length);
        this.rulerContextY.rotate(Math.PI / 2);
        this.rulerContextY.fillText(`${interval / this.gridSquarePx * 4}`, length - interval, 0);
        this.rulerContextY.restore();
        this.rulerContextY.moveTo(10, interval);
        this.rulerContextY.lineTo(20, interval);
      } else if (this.gridSquarePx >= 28) {
        this.rulerContextY.moveTo(14, interval);
        this.rulerContextY.lineTo(20, interval);
      }
    }
    this.rulerContextY.stroke();
  }
  public updateGrid(property: any) {
    switch (property.id) {
      case 'roadLength':
        this.gridProperties.roadLength = property.value;
        if (this.gridProperties.direction === 'Horizontal') {
          this.drawRulerX();
        } else if (this.gridProperties.direction === 'Vertical') {
          this.drawRulerY();
        }
        break;
      case 'direction':
        this.gridProperties.direction = property.value;
        if (this.gridProperties.direction === 'Horizontal') {
          this.rulerContextY.clearRect(0, 0, 20, this.getGridWidth());
          this.drawRulerX();
        } else if (this.gridProperties.direction === 'Vertical') {
          this.rulerContextX.clearRect(0, 0, this.getGridHeight(), 20);
          this.drawRulerY();
        }
        break;
    }
  }
  public getGridWidth() {
    if (this.gridProperties.direction === 'Horizontal') {
      return this.gridSquarePx * this.gridProperties.roadLength / 4;
    }
    return this.gridSquarePx * 8;
  }
  public getGridHeight() {
    if (this.gridProperties.direction === 'Vertical') {
      return this.gridSquarePx * this.gridProperties.roadLength / 4;
    }
    return this.gridSquarePx * 8;
  }
  public calculateSmallGrid() {
    const first: number = this.gridSquarePx / 4;
    const second: number = this.gridSquarePx / 2;
    const third: number = this.gridSquarePx * 3 / 4;
    return `M 0 ${first} L ${this.gridSquarePx} ${first} M ${first} 0 L ${first} ${this.gridSquarePx}` +
      `M 0 ${second} L ${this.gridSquarePx} ${second} M ${second} 0 L ${second} ${this.gridSquarePx}` +
      `M 0 ${third} L ${this.gridSquarePx} ${third} M ${third} 0 L ${third} ${this.gridSquarePx}`;
  }
  public calculateBigGrid() {
    return `M ${this.gridSquarePx} 0 L 0 0 0 ${this.gridSquarePx}`;
  }
  public calculateRoadLine() {
    return `M 0 ${this.gridSquarePx / 4} H ${this.gridSquarePx} V ${this.gridSquarePx * 3 / 4} H 0`;
  }
  public calculateMiddleLine() {
    return `M ${this.gridSquarePx / 8} ${this.gridSquarePx / 2} H ${this.gridSquarePx}`;
  }
  public setSvgSource(data: any) {
    if (this.svgPattern !== data.svgSource && !this.selectedBox) {
      this.svgPattern = data.svgSource;
      this.selectedBox = this.renderer.createElement('div');
      this.renderer.setStyle(this.selectedBox, 'border', '1px dashed black');
      this.renderer.setStyle(this.selectedBox, 'width', `${this.gridSquarePx}px`);
      this.renderer.setStyle(this.selectedBox, 'height', `${this.gridSquarePx}px`);
      this.renderer.setStyle(this.selectedBox, 'top', `${data.y}px`);
      this.renderer.setStyle(this.selectedBox, 'left', `${data.x}px`);
      this.renderer.setStyle(this.selectedBox, 'position', 'absolute');
      this.renderer.setStyle(this.selectedBox, 'pointer-events', 'none');
      this.renderer.appendChild(this.mainContainer.nativeElement, this.selectedBox);
    } else {
      this.renderer.removeChild(this.mainContainer.nativeElement, this.selectedBox);
      this.svgPattern = null;
      this.selectedBox = null;
    }
  }
  public moveInContainer(event: MouseEvent) {
    event.stopPropagation();
    if (this.svgPattern) {
      if (this.selectedBox.parentElement === this.mainContainer.nativeElement) {
        this.selectedBox.style.top = `${event.pageY}px`;
        this.selectedBox.style.left = `${event.pageX}px`;
      } else {
        const step = this.gridSquarePx / 4;
        this.selectedBox.style.top = `${(Math.ceil((event.layerY - 10) / step) * step)}px`;
        this.selectedBox.style.left = `${(Math.ceil((event.layerX - 10) / step) * step)}px`;
      }
    } else if (this.svgSourceElement) {
      const step = this.gridSquarePx / 4;
      this.svgSourceElement.x = (Math.ceil((event.layerX - 10) / step) * step) / step,
      this.svgSourceElement.y = (Math.ceil((event.layerY - 10) / step) * step) / step;
    }
  }
  public clickInGrid(event: MouseEvent) {
    event.stopPropagation();
    if (this.svgPattern) {
      const step = this.gridSquarePx / 4;
      this.renderer.removeChild(this.editorContainer.nativeElement, this.selectedBox);
      this.components.push(
        { x: (Math.ceil((event.layerX - 10) / step) * step) / step,
          y: (Math.ceil((event.layerY - 10) / step) * step) / step,
          fill: this.svgPattern
      });
      this.svgPattern = null;
      this.selectedBox = null;
    }
  }
  public moveElementToGrid() {
    if (this.selectedBox) {
      this.renderer.removeChild(this.mainContainer.nativeElement, this.selectedBox);
      this.renderer.appendChild(this.editorContainer.nativeElement, this.selectedBox);
    }
  }
  public moveElementOutOfGrid() {
    if (this.selectedBox) {
      this.renderer.removeChild(this.editorContainer.nativeElement, this.selectedBox);
      this.renderer.appendChild(this.mainContainer.nativeElement, this.selectedBox);
    }
  }
  public clickInContainer(event: MouseEvent) {
    if (this.svgPattern && this.selectedBox) {
      this.renderer.removeChild(this.mainContainer.nativeElement, this.selectedBox);
      this.svgPattern = null;
      this.selectedBox = null;
    }
  }
  public getCoord(value: number) {
    const step = this.gridSquarePx / 4;
    return value * step;
  }
  public test(event: MouseEvent, component: any) {
    event.stopPropagation();
    const target = <SVGRectElement>event.target;
    if (!this.svgSourceElement) {
      target.style.strokeWidth = '1';
      target.style.stroke = '#000000';
      target.style.strokeDasharray = '3';
      this.svgSourceElement = component;
    } else {
      target.style.strokeWidth = '';
      target.style.stroke = '';
      target.style.strokeDasharray = '';
      this.svgSourceElement = null;
    }
  }
}
