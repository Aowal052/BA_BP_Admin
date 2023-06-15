import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/@shared/models/user';

@Component({
  selector: 'da-message-notification',
  templateUrl: './message-notification.component.html',
  styleUrls: ['../user-settings.component.scss'],
})
export class MessageNotificationComponent implements OnInit {
  messageItems = [
    {
      id:1,
      title: 'Yearly Commission',
      description: 'বিঃ দ্রঃ ইয়ারলি কমিশনের বিপরীতে কোনো নগদ অর্থ প্রদান করা হবে না, পণ্য প্রদান করা হবে।',
      isActive:false
    },
    {
      id:2,
      title: 'Monthly Commission',
      description: 'বিঃ দ্রঃ মাসের শেষ কর্ম দিবসে হিসাব ক্লোজ না করলে ডিলার তার প্রাপ্ত ¯øাব হতে ১% কমিশন কম পাবেন ও পণ্য ডেলিভারি বন্ধ থাকবে',
      isActive:false
    },
    {
      id:3,
      title: 'Yearly Credit',
      description: '',
      isActive:false
    },
    {
      id:4,
      title: 'DO Commission',
      description: 'ডিও কমিশন প্রাপ্ত ব্যবসায়ীগণ উপরে উল্লেখিত মাসিক কমিশনের আওতায় আসবে না।',
      isActive:false
    }
  ]

  user!: User;
  haveLoggedIn = false;
  constructor() {}

  ngOnInit(): void {
    if (localStorage.getItem('userinfo')) {
      this.user = JSON.parse(localStorage.getItem('userinfo')!);
      this.haveLoggedIn = true;
    }
  }
  setcommission(event: any) {
    this.messageItems = this.messageItems.map(item => ({
      ...item,
      isActive: item.id === event.id ? true : false
    }));
  }
  
}
