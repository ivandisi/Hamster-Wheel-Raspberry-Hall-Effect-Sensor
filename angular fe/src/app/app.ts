import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WeekReportComponent } from './components/week-report/week-report.component';
import { MonthReportComponent } from './components/months-report/month-report.component';
import { DailyRecapComponent } from './components/daily-recap/daily-recap.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WeekReportComponent, MonthReportComponent, DailyRecapComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('hamster-monitor');
}
