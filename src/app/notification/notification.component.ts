import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  @Input() message: string = '';

  constructor() { }

  ngOnInit(): void {
    if (this.message) {
      setTimeout(() => this.message = '', 3000); // Hide message after 3 seconds
    }
  }
}
