import { Component } from '@angular/core';
import {SortingVisualizerComponent} from "./components/sorting-visualizer/sorting-visualizer.component";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone:true,
  imports: [SortingVisualizerComponent]
})
export class AppComponent {}
