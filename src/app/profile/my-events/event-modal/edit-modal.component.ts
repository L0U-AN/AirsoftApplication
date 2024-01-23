import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Event, Terrain } from 'src/app/services/events.model';
import { ModalController } from '@ionic/angular';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { StorageService } from 'src/app/services/storage.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss'],
})
export class EditModalComponent implements OnInit {
  event: Event;
  eventForm: FormGroup;
  newImageUrl: any;
  defaultEvent: Event = {
    terrainId: '',
    title: '',
    description: '',
    location: '',
    price: 0,
    imageUrl: '',
    availableFrom: new Date(),
    availableTo: new Date(),
    organizer: [],
    created: new Date(),
    updated: new Date(),
  };

  preview: any = {
    availableFrom: new Date(),
    availableTo: new Date(),
  };

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private storageService: StorageService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    if (this.event) {
      this.preview.availableFrom = this.event.availableFrom;
      this.preview.availableTo = this.event.availableTo;
    } else {
      this.preview.availableFrom = null;
      this.preview.availableTo = null;
    }
    this.event = {
      ...this.defaultEvent,
      ...this.event,
    };

    this.eventForm = this.formBuilder.group({
      title: [this.event.title, [Validators.required]],
      description: [this.event.description, [Validators.required]],
      location: [this.event.location, [Validators.required]],
      price: [this.event.price, [Validators.required, Validators.min(0)]],
      // availableFrom: [this.event.availableFrom, [Validators.required]],
      // availableTo: [this.event.availableTo, [Validators.required]],
      imageUrl: [this.event.imageUrl, [Validators.required]],
    });
  }
  imageName() {
    const newTime = Math.floor(Date.now() / 1000);
    return Math.floor(Math.random() * 20) + newTime;
  }

  availableFromChanged(event: any) {
    this.event.availableFrom = new Date(event.detail.value);
  }

  availableToChanged(event: any) {
    this.event.availableTo = new Date(event.detail.value);
  }

  async showAlert(err: string) {
    const alert = await this.alertCtrl.create({
      message: err,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async uploadFile() {
    await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    }).then(
      async (photo) => {
        this.newImageUrl = await fetch(photo.webPath);
      },
      (err) => {
        this.showAlert(err);
      }
    );
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async confirm() {
    if (this.newImageUrl) {
      const blob = await this.newImageUrl.blob();
      const filePath = `events/thumbnails/${this.imageName()}`;
      const url = await this.storageService.uploadImage(filePath, blob);
      this.eventForm.value.imageUrl = url;
    }

    this.event = await {
      ...this.event,
      ...this.eventForm.value,
    };

    console.log(this.event);

    this.modalCtrl.dismiss(this.event, 'confirm');
  }
}
