import {Component, inject, Input, OnInit, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { StarsComponent } from '../stars/stars.component';
import {AuthService} from '../../services/auth.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-commentaries',
  standalone: true,
  imports: [CommonModule, StarsComponent, RouterLink, FormsModule],
  templateUrl: './commentaries.component.html',
  styleUrls: ['./commentaries.component.css']
})
export class CommentariesComponent implements OnInit {
  @Input() type: string = '';
  @Input() comments: any[] = [];
  id!: string;
  currentUserId: string | null = null;
  private videogameSlug: string = "";

  orderOptions = [
    {value: "recentFirst", text: "Más recientes"},
    {value: "oldFirst", text: "Más antiguos"},
    {value: "mostStars", text: "Más estrellas"},
    {value: "leastStars", text: "Menos estrellas"},
    {value: "mostVoted", text: "Más votados"},
    {value: "leastVoted", text: "Menos votados"},
  ]

  selectedOrder = "recentFirst";

  private authService: AuthService = inject(AuthService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  constructor() {}

  ngOnInit(): void {
    // Obtener el ID del usuario autenticado
    this.authService.getCurrentUserObservable().subscribe((user) => {
      this.currentUserId = user ? user.uid : null;
    });

    this.route.params.subscribe(params => {
      this.videogameSlug = params["slug"];
    });
    this.sortComments()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['comments'] && this.comments?.length) {
      this.sortComments();
    }
  }
  setProfileIcon(comment: any){
    if (comment.userId === this.currentUserId) {
      const localImage = localStorage.getItem(`profile-image-${comment.userId}`);
      return localImage || comment.user?.profileicon;
    }
    return comment.user?.profileicon;
  }
  showReleaseYear(releaseDate: number) {
    return !isNaN(releaseDate);
  }

  navigateToEditCommentFromUserProfile(slug: string): void {
    this.router.navigate(['/new-comment', slug]);
  }

  navigateToEditCommentFromVideogame() {
    this.router.navigate(['/new-comment', this.videogameSlug]);
  }

  sortComments(): void {
    if (this.type === "user"){
      this.sortAllComments(this.comments);
      return;
    }
    if (this.type === "videogame"){
      const userComment = this.comments.find(comment => comment.userId === this.currentUserId);
      const otherComments = this.comments.filter(comment => comment.userId !== this.currentUserId);

      this.sortAllComments(otherComments)
      this.comments = userComment ? [userComment, ...otherComments] : otherComments;
    }

    if (!this.comments || !this.currentUserId) {
      return;
    }
  }

  private sortAllComments(comments: any[]) {
    switch (this.selectedOrder) {
      case "recentFirst":
        console.log("recent");
        comments.sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
        break;
      case "oldFirst":
        console.log("old");
        comments.sort((a,b)=>a.createdAt.localeCompare(b.createdAt));
        break;
      case "mostStars":
        console.log("mostStars");
        comments.sort((a,b)=>b.rating-a.rating);
        break;
      case "leastStars":
        console.log("leastStars");
        comments.sort((a,b)=>a.rating-b.rating);
        break;
      /*
    case "mostVoted":
      comments.sort((a,b)=>a.createdAt.localeCompare(b.createdAt));
      break;
    case "leastVoted":
      comments.sort((a,b)=>a.createdAt.localeCompare(b.createdAt));
      break;*/
    }
  }
}
