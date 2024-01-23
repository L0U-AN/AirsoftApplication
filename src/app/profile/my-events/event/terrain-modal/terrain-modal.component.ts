import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Event, Terrain } from 'src/app/services/events.model';
import { ModalController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { ToastController } from '@ionic/angular';
import {
  Validators,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import write_blob from 'capacitor-blob-writer';
import { DataService } from 'src/app/services/data.service';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Component({
  selector: 'app-terrain-modal',
  templateUrl: './terrain-modal.component.html',
  styleUrls: ['./terrain-modal.component.scss'],
})
export class ConfModalComponent implements OnInit {
  terrain: Terrain;
  terrainForm: FormGroup;
  defaultTerrain: Terrain = {
    name: '',
    description: '',
    location: '',
    players: [],
    availableFrom: new Date(),
    availableTo: new Date(),
    availability: true,
    capacity: 0,
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
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private toastController: ToastController,
  ) {}

  ngOnInit() {

    if (this.terrain) {
      this.preview.availableFrom = this.terrain.availableFrom;
      this.preview.availableTo = this.terrain.availableTo;
    } else {
      this.preview.availableFrom = null;
      this.preview.availableTo = null;
    }
    this.terrain = {
      ...this.defaultTerrain,
      ...this.terrain,
    };

    this.terrainForm = this.formBuilder.group({
      name: [this.defaultTerrain.name, [Validators.required]],
      description: [this.defaultTerrain.description, [Validators.required]],
      location: [this.defaultTerrain.location, [Validators.required]],
      capacity: [this.defaultTerrain.capacity,],
    });
  }

  async showAlert(err: string) {
    const alert = await this.alertCtrl.create({
      message: err,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      icon: 'alert-circle',
      color,
    });
    toast.present();
  }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  availableFromChanged(event: any) {
    this.terrain.availableFrom = new Date(event.detail.value);
  }

  availableToChanged(event: any) {
    this.terrain.availableTo = new Date(event.detail.value);
  }

  async confirm() {
    // Mettez à jour this.terrain avec les valeurs du formulaire
    this.terrain = {
      availability: true, // Exemple, assurez-vous que cela correspond à votre modèle
      players: [], // Exemple, assurez-vous que cela correspond à votre modèle
      availableFrom: new Date(), // Exemple, assurez-vous que cela correspond à votre modèle
      availableTo: new Date(), // Exemple, assurez-vous que cela correspond à votre modèle
      name: this.terrainForm.value.name,
      description: this.terrainForm.value.description,
      location: this.terrainForm.value.location,
      capacity: this.terrainForm.value.capacity,
      // Ajoutez d'autres champs si nécessaire
      created: new Date(), // Exemple, assurez-vous que cela correspond à votre modèle
      updated: new Date(), // Exemple, assurez-vous que cela correspond à votre modèle
      // ...ajoutez d'autres propriétés nécessaires
    };

    // Rejetez la promesse avec this.terrain
    return this.modalCtrl.dismiss(this.terrain, 'confirm');
  }
}
