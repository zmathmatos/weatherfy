import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ComponenteClima } from './features/weather/clima-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ComponenteClima],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  title = 'weatherfy';
}
