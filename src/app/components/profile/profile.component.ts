import { DataService } from '../../services/data.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {Component, inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ApiService} from '../../services/api.service';
import { getAuth, onAuthStateChanged  } from 'firebase/auth';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {StorageService} from '../../services/storage.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslatePipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnChanges {
  @Input() type: string = '';
  @Input() userInfo: any = null;
  @Input() gameInfo: any = null;
  @Input() gameCover: string = "";
  id!: string;
  apiService: ApiService = inject(ApiService);
  @Input() showPlatformsAndGenres: boolean = false;

  errorMessage: string = "";
  formErrorMessage: string = "";
  editMode: boolean = false;
  editableData: any = {
    name: '',
    username: '',
    description: '',
    profileicon: ''
  };
  selectedFile: File | null = null;
  originalData: any = {};

  @Input() isCurrentUser: boolean = false;

  private dataService: DataService = inject(DataService);
  private storageService: StorageService = inject(StorageService);

  private emptyNameAndUsernameMessage = 'profile.message.empty_name_and_username_message';
  private nonAvailableUsernameMessage = 'profile.message.non_available_username_message';
  private genericSavingProfileMessage = 'profile.message.generic_saving_message';
  private genericUsernameAvailabilityMessage = 'profile.message.generic_availability_message';
  @Input() selectedLanguage!: string;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["userInfo"]) {
      this.prepareUserProfile();
    }
  }

  protected showReleaseYear() {
    return !isNaN(this.apiService.getReleaseYear(this.gameInfo.first_release_date));
  }

  private prepareUserProfile(): void {
    const auth = getAuth();
    onAuthStateChanged(auth, () => {
      if (this.userInfo) {
        this.id = this.userInfo.id;
        this.originalData = { ...this.userInfo };

        // Si es el perfil del usuario autenticado, intenta usar imagen del localStorage
        if (this.isCurrentUser) {
          const localImage = this.storageService.getItem(`profile-image-${this.id}`);
          if (localImage) {
            this.userInfo.profileicon = localImage;
          }

          this.editableData = {
            name: this.userInfo.name || '',
            username: this.userInfo.username || '',
            description: this.userInfo.description || '',
            profileicon: this.userInfo.profileicon || ''
          };
        }
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result as string;
        // Guardamos en localStorage con la clave basada en el ID del usuario
        this.storageService.setItem(`profile-image-${this.id}`, base64Image);
        this.selectedFile = file;
      };
      reader.readAsDataURL(file); // Convierte la imagen a base64
    }
  }

  saveProfile(): void {
    this.formErrorMessage = '';
    const { name, username } = this.editableData;
    if (!name.trim() || !username.trim()) {
      this.formErrorMessage = this.emptyNameAndUsernameMessage;
      return;
    }
    this.checkUsernameAvailability(username).then((isUsernameAvailable) => {
      if (!isUsernameAvailable) {
        this.errorMessage = this.nonAvailableUsernameMessage;
        return;
      }
      if (this.selectedFile) {
        this.editableData.profileicon = this.selectedFile.name;
      }

      this.dataService.updateUserProfile(this.userInfo.id, this.editableData).then(() => {
        this.editMode = false;
      }).catch(error => {
        console.error('Error al actualizar el perfil:', error);
        this.formErrorMessage = this.genericSavingProfileMessage;
      });
    }).catch(error => {
      console.error('Error al comprobar disponibilidad del nombre de usuario:', error);
      this.formErrorMessage = this.genericUsernameAvailabilityMessage;
    });
  }
  checkUsernameAvailability(username: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.dataService.searchUsername(username).subscribe((existingUsers: any[]) => {
        if (existingUsers.length > 0 && existingUsers[0].id !== this.id) {
          // Si ya existe otro usuario con el mismo nombre de usuario y no es el mismo que está editando
          resolve(false); // Nombre de usuario no disponible
        } else {
          resolve(true); // Nombre de usuario disponible
        }
      }, (error) => {
        reject(error); // En caso de error en la llamada a la API
      });
    });
  }

  cancelEdit(): void {
    this.editMode = false;
    this.errorMessage = "";
    this.editableData = { ...this.originalData };
  }
}
