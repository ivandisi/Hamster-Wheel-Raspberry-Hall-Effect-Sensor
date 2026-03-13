import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WeekReportComponent } from './components/week-report/week-report.component';
import { MonthReportComponent } from './components/months-report/month-report.component';
import { DailyReportComponent } from './components/daily-report/daily-report.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WeekReportComponent, MonthReportComponent, DailyReportComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('hamster-monitor');
}
