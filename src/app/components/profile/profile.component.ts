import { DataService } from '../../services/data.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ApiService} from '../../services/api.service';
import { getAuth, onAuthStateChanged  } from 'firebase/auth';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnChanges {
  @Input() type: string = '';
  data: any = null;
  @Input() gameInfo: any = null;
  @Input() gameCover: string = "";
  id!: string;
  apiService: ApiService = inject(ApiService);
  @Input() showPlatformsAndGenres: boolean = false;
  @Output() showErrorMessageEmitter = new EventEmitter<boolean>();

  editMode: boolean = false;
  editableData: any = {
    name: '',
    username: '',
    description: '',
    profileicon: ''
  };
  selectedFile: File | null = null;
  originalData: any = {};

  isCurrentUser: boolean = false;
  constructor(private dataService: DataService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];

      if (this.type === 'user') {
        this.loadUserProfile();
      } else if (this.type === 'videogame') {
        this.loadVideogameProfile();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['type'] && this.id) {
      if (this.type === 'user') {
        this.loadUserProfile();
      } else if (this.type === 'videogame') {
        this.loadVideogameProfile();
      }
    }
  }

  private loadVideogameProfile(): void {
    this.dataService.getVideogameById(this.id).subscribe(response => {
      this.data = response;
    });
  }

  protected showReleaseYear() {
    return !isNaN(this.apiService.getReleaseYear(this.gameInfo.first_release_date));
  }
  private loadUserProfile(): void {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.dataService.getUsersById(this.id).subscribe(response => {
        this.showErrorMessageEmitter.emit(response === undefined);
        this.data = response;
        this.originalData = { ...response };

        this.isCurrentUser = user?.uid === response.id;

        // Si es el perfil del usuario autenticado, intenta usar imagen del localStorage
        if (this.isCurrentUser) {
          const localImage = localStorage.getItem(`profile-image-${this.id}`);
          if (localImage) {
            this.data.profileicon = localImage;
          }
        }

        this.editableData = {
          name: response.name || '',
          username: response.username || '',
          description: response.description || '',
          profileicon: response.profileicon || ''
        };
      });
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result as string;
        // Guardamos en localStorage con la clave basada en el ID del usuario
        localStorage.setItem(`profile-image-${this.id}`, base64Image);
        this.selectedFile = file;
      };
      reader.readAsDataURL(file); // Convierte la imagen a base64
    }
  }


  saveProfile(): void {
    if (this.selectedFile) {
      // Guardamos solo el nombre del archivo como referencia
      this.editableData.profileicon = this.selectedFile.name;
    }

    this.dataService.updateUserProfile(this.id, this.editableData).then(() => {
      this.editMode = false;
      this.loadUserProfile();
    }).catch(error => {
      console.error('Error al actualizar el perfil:', error);
    });
  }
  cancelEdit(): void {
    this.editMode = false;
    this.editableData = { ...this.originalData };
  }
}
