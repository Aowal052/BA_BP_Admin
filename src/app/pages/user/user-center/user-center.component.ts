import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/@core/data/userData';
import { WorkGroup } from 'src/app/@core/data/work-group';
import { UserDataService } from 'src/app/@core/mock/user-data.service';
import { WorkGroupService } from 'src/app/@core/mock/work-group.service';

@Component({
  selector: 'da-user-center',
  templateUrl: './user-center.component.html',
  styleUrls: ['./user-center.component.scss'],
})
export class UserCenterComponent implements OnInit {
  user: User = {};

  busy: Subscription = new Subscription();

  spaceBusy: Subscription = new Subscription();

  source = [
    { title: 'User Center' },
    {
      title: 'User Center',
      link: '/pages/user/center',
    },
  ];

  activeTab: string | number = 'first';

  tabs = [
    {
      id: 'first',
      label: 'Sales',
    },
    {
      id: 'second',
      label: 'Purchase',
    },
  ];

  articles = [];

  projects = [];

  workGroups: WorkGroup[] = [];

  constructor(private userDataService: UserDataService, private workGroupService: WorkGroupService) {}

  ngOnInit() {
    if (localStorage.getItem('userinfo')) {
      this.user = JSON.parse(localStorage.getItem('userinfo')!);
    }
    this.workGroupService.getWorkGroups().subscribe((group) => {
      this.workGroups = group;
    });
    this.getListData();
  }

  getListData() {
    switch (this.activeTab) {
      case 'first':
        this.getArticles();
        return;
      case 'second':
        this.getProjects();
        return;
    }
  }

  getArticles() {
    this.spaceBusy = this.userDataService.getArticles().subscribe((res) => {
      this.articles = res;
    });
  }

  getProjects() {
    this.spaceBusy = this.userDataService.getProjects().subscribe((res) => {
      this.projects = res;
    });
  }

  activeTabChange(e: string | number) {
    this.getListData();
  }

  actionHandler(key: string, item: any) {
    if (item[key + 'Attached']) {
      item[key] -= 1;
    } else {
      item[key] += 1;
    }
    item[key + 'Attached'] = !item[key + 'Attached'];
  }
}
