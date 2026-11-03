import { DatePipe } from '@angular/common';
import { Component, computed } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendarDays } from '@ng-icons/lucide';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isDeadline: boolean;
}

@Component({
  selector: 'app-grades-calendar',
  imports: [DatePipe, NgIcon],
  providers: [provideIcons({ lucideCalendarDays })],
  templateUrl: './grades-calendar.html',
})
export class GradesCalendar {
  protected readonly today = new Date();
  protected readonly deadline = new Date(
    this.today.getFullYear(),
    this.today.getMonth(),
    this.today.getDate() + 7,
  );
  protected readonly weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  protected readonly monthLabel = this.today.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });
  protected readonly monthLabelText = this.monthLabel.charAt(0).toLocaleUpperCase('pt-BR') + this.monthLabel.slice(1);
  protected readonly calendarDays = computed<CalendarDay[]>(() => {
    const year = this.today.getFullYear();
    const month = this.today.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

    return Array.from({ length: cellCount }, (_, index) => {
      const date = new Date(year, month, index - firstWeekday + 1);
      return {
        date,
        isCurrentMonth: date.getMonth() === month,
        isToday: this.isSameDay(date, this.today),
        isDeadline: this.isSameDay(date, this.deadline),
      };
    });
  });

  private isSameDay(first: Date, second: Date): boolean {
    return first.getFullYear() === second.getFullYear()
      && first.getMonth() === second.getMonth()
      && first.getDate() === second.getDate();
  }
}