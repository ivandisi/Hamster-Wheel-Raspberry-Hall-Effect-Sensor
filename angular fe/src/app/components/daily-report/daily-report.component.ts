import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Trip } from '../../model/Trip';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'daily-report',
  templateUrl: './daily-report.html',
  styleUrls: ['./daily-report.css'],
  imports: [CommonModule],
})

export class DailyReportComponent implements OnInit {
  
  values: Trip[] = [];
  days: string[] = [];
  maxTrips: number = 0;
  
  loading = false;

  todayString: string = '';

  activeTab: number = 1;

  switchTab(tabIndex: number) {
    this.activeTab = tabIndex;
  }

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    const today = new Date();
    this.todayString = today.toISOString().slice(0,10);
    this.onDateChange(today);
  }

    formatDateYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() = 0-11
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}${month}${day}`;
  }

  onDateChange(eventOrDate: any) {
    let date: Date;
    if (eventOrDate instanceof Date) {
      date = eventOrDate;
    } else {
      date = new Date(eventOrDate.target.value);
    }

    this.callApiWithDates(this.formatDateYYYYMMDD(date));
  }

  callApiWithDates(date: string) {
    
    this.loading = true;
    const params = { day: date };

    this.http.get<Trip[]>('/api/getByDay', { params }).subscribe({
      next: res => {
        this.loading = false;
        this.values = res.map(v => ({
          ...v,
          trips: Number(v.trips)  
        }));
        this.maxTrips = Math.max(...this.values.map(v => v.trips));
        this.cdr.detectChanges();
      },
      error: err => {
          this.loading = false;
          console.error('Errore API:', err)
      }
    });
  }

}