import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { OrganizerRequest } from 'src/app/services/organizer-request.model';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/services/user.model';


@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.page.html',
  styleUrls: ['./ticket.page.scss'],
})
export class TicketPage implements OnInit {

  isDataAvailable = false;
  ticket: OrganizerRequest;
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
      if (!paramMap.has('ticketId')) {
        // redirect
        return;
      }
      const ticketId = paramMap.get('ticketId');
      console.log(ticketId);
      this.dataService.getTicketById(ticketId).subscribe((ticketRes) => {
        this.ticket = ticketRes;

        this.dataService.getUserById(this.ticket.adminId).then((adminRes) => {
          if (adminRes.docs.length > 0) {
            this.ticketAdmin = adminRes.docs[0].data();
          }
          this.isDataAvailable = true;
        });

        this.dataService.getUserById(this.ticket.uid).then((userRes) => {
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

  async updateTicket(status: string) {
    if (status === 'IN_PROGRESS') {
      this.ticket.adminId = this.authService.currentUser.uid;
    }
    if (status === 'ACCEPTED') {
      if (!this.ticketUser.terrainId) {
        const terrain = await this.dataService.addTerrainOfficial({
          terrainId: this.ticket.terrainId,
          name: this.ticket.terrainName,
          companyNumber: this.ticket.companyNumber,
          address: this.ticket.terrainAddress,
          phone: this.ticket.terrainPhone,
          email: this.ticket.terrainEmail,
          website: this.ticket.terrainWebsite,
          description: this.ticket.terrainDescription,
          status: 'ACTIVE',
          createdDate: new Date(),
          createdBy: this.ticketUser.uid,
          updatedDate: new Date(),
        });
        this.ticketUser.terrainId = terrain.id;
      } else {
        await this.dataService
          .getTerrainOfficialById(this.ticketUser.terrainId)
          .then(async (res) => {
            if (res.data()) {
              const terrain = res.data();
              terrain.name = this.ticket.terrainName;
              terrain.companyNumber = this.ticket.companyNumber;
              terrain.address = this.ticket.terrainAddress;
              terrain.phone = this.ticket.terrainPhone;
              terrain.email = this.ticket.terrainEmail;
              terrain.website = this.ticket.terrainWebsite;
              terrain.description = this.ticket.terrainDescription;
              terrain.status = 'ACTIVE';
              terrain.updatedDate = new Date();
              this.dataService.updateTerrainOfficial(
                this.ticketUser.terrainId,
                terrain
              );
            } else {
              await this.dataService
                .addTerrainOfficial({
                  terrainId: this.ticket.terrainId,
                  name: this.ticket.terrainName,
                  companyNumber: this.ticket.companyNumber,
                  address: this.ticket.terrainAddress,
                  phone: this.ticket.terrainPhone,
                  email: this.ticket.terrainEmail,
                  website: this.ticket.terrainWebsite,
                  description: this.ticket.terrainDescription,
                  status: 'ACTIVE',
                  createdDate: new Date(),
                  createdBy: this.ticketUser.uid,
                  updatedDate: new Date(),
                })
                .then((terrainResult) => {
                  this.ticketUser.terrainId = terrainResult.id;
                });
            }
          });
      }
      this.ticketUser.isOrganizer = true;
      this.dataService.updateUser(this.ticketUser);
    }
    if (status === 'REJECTED') {
      if (!this.ticketUser.terrainId) {
        this.dataService
          .addTerrainOfficial({
            terrainId: this.ticket.terrainId,
            name: this.ticket.terrainName,
            companyNumber: this.ticket.companyNumber,
            address: this.ticket.terrainAddress,
            phone: this.ticket.terrainPhone,
            email: this.ticket.terrainEmail,
            website: this.ticket.terrainWebsite,
            description: this.ticket.terrainDescription,
            status: 'DISABLED',
            createdDate: new Date(),
            createdBy: this.ticketUser.uid,
            updatedDate: new Date(),
          })
          .then((res) => {
            this.ticketUser.terrainId = res.id;
          });
      } else {
        await this.dataService
          .getTerrainOfficialById(this.ticketUser.terrainId)
          .then(async (res) => {
            if (res.data()) {
              const terrain = res.data();
              terrain.terrainId = this.ticket.terrainId;
              terrain.name = this.ticket.terrainName;
              terrain.companyNumber = this.ticket.companyNumber;
              terrain.address = this.ticket.terrainAddress;
              terrain.phone = this.ticket.terrainPhone;
              terrain.email = this.ticket.terrainEmail;
              terrain.website = this.ticket.terrainWebsite;
              terrain.description = this.ticket.terrainDescription;
              terrain.status = 'DISABLED';
              terrain.updatedDate = new Date();
              this.dataService.updateTerrainOfficial(
                this.ticketUser.terrainId,
                terrain
              );
            } else {
              await this.dataService
                .addTerrainOfficial({
                  terrainId: this.ticket.terrainId,
                  name: this.ticket.terrainName,
                  companyNumber: this.ticket.companyNumber,
                  address: this.ticket.terrainAddress,
                  phone: this.ticket.terrainPhone,
                  email: this.ticket.terrainEmail,
                  website: this.ticket.terrainWebsite,
                  description: this.ticket.terrainDescription,
                  status: 'DISABLED',
                  createdDate: new Date(),
                  createdBy: this.ticketUser.uid,
                  updatedDate: new Date(),
                })
                .then((result) => {
                  this.ticketUser.terrainId = result.id;
                });
            }
          });
      }
      this.ticketUser.isOrganizer = false;
      this.dataService.updateUser(this.ticketUser);
    }
    this.ticket.status = status;
    this.dataService.updateTicket(this.ticket.docId, this.ticket);
  }
}
