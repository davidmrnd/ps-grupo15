import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData,getDoc, doc, docData, query, where } from '@angular/fire/firestore';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private firestore: Firestore) {}

  // Obtener todos los videojuegos de una categoría
  getVideogames(category: string): Observable<any[]> {
    const videogamesRef = collection(this.firestore, 'videogames');
    const q = query(videogamesRef, where('category', 'array-contains', category));
    return collectionData(q, { idField: 'id' });
  }

  // Obtener un videojuego por su ID
  getVideogameById(id: string): Observable<any> {
    const videogameDoc = doc(this.firestore, `videogames/${id}`);
    return docData(videogameDoc, { idField: 'id' });
  }

  // Obtener un usuario por su ID
  getUsersById(id: string): Observable<any> {
    const userDoc = doc(this.firestore, `users/${id}`);
    return docData(userDoc, { idField: 'id' });
  }

  // Obtener comentarios por el ID del videojuego
  getCommentsByVideogameId(videogameId: string): Observable<any[]> {
    const commentsRef = collection(this.firestore, 'comments');
    const q = query(commentsRef, where('videogameId', '==', videogameId));
    return collectionData(q, { idField: 'id' });
  }

  getFollowingComments(userId: string): Observable<any[]> {
    const userDoc = doc(this.firestore, `users/${userId}`);
    return docData(userDoc).pipe(
      switchMap((user: any) => {
        const followingIds = user.following || [];
        const commentsRef = collection(this.firestore, 'comments');
        const commentsQuery = query(commentsRef, where('userId', 'in', followingIds));
        return collectionData(commentsQuery, { idField: 'id' }).pipe(
          switchMap((comments: any[]) => {
            const enrichedComments = comments.map(async (comment) => {
              const user = await getDoc(doc(this.firestore, `users/${comment.userId}`));
              const videogame = await getDoc(doc(this.firestore, `videogames/${comment.videogameId}`));
              return {
                ...comment,
                user: user.data(),
                videogame: videogame.data(),
              };
            });
            return Promise.all(enrichedComments);
          })
        );
      })
    );
  }

  // Obtener comentarios por el ID del usuario
  getCommentsByUserId(userId: string): Observable<any[]> {
    const commentsRef = collection(this.firestore, 'comments');
    const commentsQuery = query(commentsRef, where('userId', '==', userId));
    return collectionData(commentsQuery, { idField: 'id' });
  }
}
