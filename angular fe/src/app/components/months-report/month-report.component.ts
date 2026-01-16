import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Trip } from '../../model/Trip';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'month-report',
  templateUrl: './month-report.html',
  styleUrls: ['./month-report.css'],
  imports: [CommonModule],
})

export class MonthReportComponent implements OnInit {
  
  monthsLabel: string[] = [
    'Jan', 'Feb', 'Mar', 'Apr',
    'May', 'Jun', 'Jul', 'Aug',
    'Sep', 'Oct', 'Nov', 'Dec'
  ];
  values: Trip[] = [];
  year: number = 0;
  maxTrips: number = 0;

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

  onDateChange(eventOrDate: any) {
    let date: Date;
    if (eventOrDate instanceof Date) {
      date = eventOrDate;
    } else {
      date = new Date(eventOrDate.target.value);
    }

    this.year = date.getFullYear()

    this.callApiWithDates(this.year);
  }

  callApiWithDates(year: number) {
    const params = { year: year };

    this.http.get<Trip[]>('/api/getByYear', { params }).subscribe({
      next: res => {
        this.values = res.map(v => ({
          ...v,
          trips: Number(v.trips) 
        }));
        this.maxTrips = Math.max(...this.values.map(v => v.trips));
        this.cdr.detectChanges();
      },
      error: err => console.error('Errore API:', err)
    });
  }

}