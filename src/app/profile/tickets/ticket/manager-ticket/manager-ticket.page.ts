import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/services/user.model';
import { ManagerRequest } from 'src/app/services/manager-request.model';

@Component({
  selector: 'app-manager-ticket',
  templateUrl: './manager-ticket.page.html',
  styleUrls: ['./manager-ticket.page.scss'],
})
export class ManagerTicketPage implements OnInit {

  isDataAvailable = false;
  managerTicket: ManagerRequest;
  userId: string;
  ticketAdmin: User;
  ticketUser: User;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('managerTicketId')) {
        // redirect
        return;
      }
      const managerTicketId = paramMap.get('managerTicketId');
      console.log(managerTicketId);
      this.dataService.getManagerTicketById(managerTicketId).subscribe((ticketRes) => {
        this.managerTicket = ticketRes;

        this.dataService.getUserById(this.managerTicket.adminId).then((adminRes) => {
          if (adminRes.docs.length > 0) {
            this.ticketAdmin = adminRes.docs[0].data();
          }
          this.isDataAvailable = true;
        });

        this.dataService.getUserById(this.managerTicket.uid).then((userRes) => {
          if (userRes.docs.length > 0) {
            this.ticketUser = userRes.docs[0].data();
            this.ticketUser.docId = userRes.docs[0].id;
          }
        });

        this.userId = this.authService.currentUser.uid;
      });
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

  async updateManagerTicket(status: string) {
    if (status === 'IN_PROGRESS') {
      this.managerTicket.adminId = this.authService.currentUser.uid;
    }
    if (status === 'ACCEPTED') {
      if (!this.ticketUser.companyId) {
        const company = await this.dataService.addCompany({
          companyId: this.managerTicket.companyId,
          name: this.managerTicket.companyName,
          companyNumber: this.managerTicket.companyNumber,
          address: this.managerTicket.companyAddress,
          phone: this.managerTicket.companyPhone,
          email: this.managerTicket.companyEmail,
          website: this.managerTicket.companyWebsite,
          description: this.managerTicket.companyDescription,
          status: 'ACTIVE',
          createdDate: new Date(),
          createdBy: this.ticketUser.uid,
          updatedDate: new Date(),
        });
        this.ticketUser.companyId = company.id;
      } else {
        await this.dataService
          .getCompanyById(this.ticketUser.companyId)
          .then(async (res) => {
            if (res.data()) {
              const company = res.data();
              company.name = this.managerTicket.companyName;
              company.companyNumber = this.managerTicket.companyNumber;
              company.address = this.managerTicket.companyAddress;
              company.phone = this.managerTicket.companyPhone;
              company.email = this.managerTicket.companyEmail;
              company.website = this.managerTicket.companyWebsite;
              company.description = this.managerTicket.companyDescription;
              company.status = 'ACTIVE';
              company.updatedDate = new Date();
              this.dataService.updateCompany(
                this.ticketUser.companyId,
                company
              );
            } else {
              await this.dataService
                .addCompany({
                  companyId: this.managerTicket.companyId,
                  name: this.managerTicket.companyName,
                  companyNumber: this.managerTicket.companyNumber,
                  address: this.managerTicket.companyAddress,
                  phone: this.managerTicket.companyPhone,
                  email: this.managerTicket.companyEmail,
                  website: this.managerTicket.companyWebsite,
                  description: this.managerTicket.companyDescription,
                  status: 'ACTIVE',
                  createdDate: new Date(),
                  createdBy: this.ticketUser.uid,
                  updatedDate: new Date(),
                })
                .then((companyResult) => {
                  this.ticketUser.companyId = companyResult.id;
                });
            }
          });
      }
      this.ticketUser.isManager = true;
      this.dataService.updateUser(this.ticketUser);
    }
    if (status === 'REJECTED') {
      if (!this.ticketUser.companyId) {
        this.dataService
          .addCompany({
            companyId: this.managerTicket.companyId,
            name: this.managerTicket.companyName,
            companyNumber: this.managerTicket.companyNumber,
            address: this.managerTicket.companyAddress,
            phone: this.managerTicket.companyPhone,
            email: this.managerTicket.companyEmail,
            website: this.managerTicket.companyWebsite,
            description: this.managerTicket.companyDescription,
            status: 'DISABLED',
            createdDate: new Date(),
            createdBy: this.ticketUser.uid,
            updatedDate: new Date(),
          })
          .then((res) => {
            this.ticketUser.companyId = res.id;
          });
      } else {
        await this.dataService
          .getCompanyById(this.ticketUser.companyId)
          .then(async (res) => {
            if (res.data()) {
              const company = res.data();
              company.companyId = this.managerTicket.companyId;
              company.name = this.managerTicket.companyName;
              company.companyNumber = this.managerTicket.companyNumber;
              company.address = this.managerTicket.companyAddress;
              company.phone = this.managerTicket.companyPhone;
              company.email = this.managerTicket.companyEmail;
              company.website = this.managerTicket.companyWebsite;
              company.description = this.managerTicket.companyDescription;
              company.status = 'DISABLED';
              company.updatedDate = new Date();
              this.dataService.updateCompany(
                this.ticketUser.companyId,
                company
              );
            } else {
              await this.dataService
                .addCompany({
                  companyId: this.managerTicket.companyId,
                  name: this.managerTicket.companyName,
                  companyNumber: this.managerTicket.companyNumber,
                  address: this.managerTicket.companyAddress,
                  phone: this.managerTicket.companyPhone,
                  email: this.managerTicket.companyEmail,
                  website: this.managerTicket.companyWebsite,
                  description: this.managerTicket.companyDescription,
                  status: 'DISABLED',
                  createdDate: new Date(),
                  createdBy: this.ticketUser.uid,
                  updatedDate: new Date(),
                })
                .then((result) => {
                  this.ticketUser.companyId = result.id;
                });
            }
          });
      }
      this.ticketUser.isManager = false;
      this.dataService.updateUser(this.ticketUser);
    }
    this.managerTicket.status = status;
    this.dataService.updateManagerTicket(this.managerTicket.docId, this.managerTicket);
  }

}
