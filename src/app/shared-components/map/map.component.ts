import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit {
  @ViewChild('svgContainer', { static: true }) svgContainer: ElementRef | undefined;
  @Output() regionSelected = new EventEmitter<string>();
  @ViewChild('regionNameDisplay', { static: true }) regionNameDisplay: ElementRef | undefined;
  private widthOnMobile: number = 1;
  private heightOnMobile: number = 1;
  private widthOnPc: number = 1;
  private heightOnPc: number = 1;

  ngOnInit() {
    this.loadSVG();
    window.addEventListener('resize', () => this.adjustSVGSize());
  }
  loadSVG() {
    fetch('poland-map.svg')
      .then(response => response.text())
      .then(svg => {
        if (this.svgContainer) {
          this.svgContainer.nativeElement.innerHTML = svg;
          this.addInteractivity();
          this.applyStyles();
          this.adjustSVGSize();
        }
      })
      .catch(error => console.error('Error loading SVG:', error));
  }

  addInteractivity() {
    const svgElement = this.svgContainer?.nativeElement.querySelector('svg');
    if (svgElement) {
      svgElement.querySelectorAll('path').forEach((path: SVGPathElement) => {
        path.addEventListener('click', () => {
          const regionName = path.getAttribute('data-name') || 'unknown';
          this.onPathClick(regionName);
        });
        path.addEventListener('mouseover', (event) => {
          const regionName = path.getAttribute('data-name') || 'unknown';
          this.onMouseOver(event,regionName)
        });
        path.addEventListener('mouseout', (event) => this.onMouseOut(event));
      });
    }
  }

  applyStyles() {
    const svgElement = this.svgContainer?.nativeElement.querySelector('svg');
    const mobileScale = 1.5;
    const pcScale = 1.2;
    this.widthOnMobile = svgElement.getAttribute('width') / mobileScale;
    this.heightOnMobile = svgElement.getAttribute('height') / mobileScale;
    this.widthOnPc = svgElement.getAttribute('width') / pcScale;
    this.heightOnPc = svgElement.getAttribute('height') / pcScale;

    if (svgElement) {
      svgElement.querySelectorAll('path').forEach((path: SVGPathElement) => {
        path.setAttribute('fill', '#4caf50');
        path.setAttribute('stroke', '#07530e');
        path.setAttribute('stroke-width', '2.5');
      });
    }
  }
  adjustSVGSize() {
    const svgElement = this.svgContainer?.nativeElement.querySelector('svg');
    if (svgElement) {
      const windowWidth = window.innerWidth;
      if (windowWidth <= 900) {
        svgElement.setAttribute('width', this.widthOnMobile);
        svgElement.setAttribute('height', this.heightOnMobile);
      } else {
        svgElement.setAttribute('width', this.widthOnPc);
        svgElement.setAttribute('height', this.heightOnPc);
      }
    }
  }

  onPathClick(regionName: string) {
    this.regionSelected.emit(regionName);
  }

  onMouseOver(event: MouseEvent, regionName: string) {
    const target = event.target as SVGPathElement;
    target.style.cursor = 'pointer';
    target.style.strokeWidth = '3.5px';
    target.style.fill = '#189323';
    target.style.transition = 'fill 0.1s ease, stroke-width 0.1s ease';
    if (this.regionNameDisplay) {
      const regionNameElement = this.regionNameDisplay.nativeElement;
      regionNameElement.textContent = regionName;
      regionNameElement.style.display = 'block';
      regionNameElement.style.left = `${event.pageX + 10}px`;
      regionNameElement.style.top = `${event.pageY + 10}px`;
    }
  }

  onMouseOut(event: MouseEvent) {
    const target = event.target as SVGPathElement;
    target.style.fill = '';
    target.style.strokeWidth = '2.5px';
    if (this.regionNameDisplay) {
      this.regionNameDisplay.nativeElement.style.display = 'none';
    }
  }
}
