import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/services/user.model';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';
import { OrganizerRequest } from 'src/app/services/organizer-request.model';
import { ManagerRequest } from 'src/app/services/manager-request.model';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
})
export class TicketsPage implements OnInit {
  user: User;
  organizerForm: FormGroup;
  organizerRequests: OrganizerRequest[];
  managerForm: FormGroup;
  managerRequests: ManagerRequest[];

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadOrganizerRequests();
    this.loadManagerRequests();
  }

  loadOrganizerRequests() {
    this.dataService.getOrganizerRequests().subscribe((data) => {
      console.log('Organizer Requests:', data);
      this.organizerRequests = data.sort((a, b) => a.status === 'PENDING' ? -1 : 1);
      console.log(this.organizerRequests);
    });
  }

  loadManagerRequests() {
    this.dataService.getManagerRequests().subscribe((data) => {
      console.log('Manager Requests:', data);
      this.managerRequests = data.sort((a, b) => a.status === 'PENDING' ? -1 : 1);
      console.log(this.managerRequests);
    });
  }


  statusColor(status: string) {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'IN_PROGRESS':
        return 'success';
      case 'ACCEPTED':
        return 'medium';
      case 'REJECTED':
        return 'medium';
    }
  }

  formatTimestampDate(timestamp: Timestamp | Date): string {
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
  return new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
  }
}
