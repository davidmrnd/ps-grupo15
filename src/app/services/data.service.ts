import {inject, Injectable} from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  getDoc,
  doc,
  docData,
  query,
  where,
  updateDoc
} from '@angular/fire/firestore';
import {Observable, switchMap, tap} from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private firestore: Firestore = inject(Firestore);

  // Estado reactivo para las categorías seleccionadas
  private selectedCategoriesSubject = new BehaviorSubject<string[]>([]);
  selectedCategories$ = this.selectedCategoriesSubject.asObservable();

  constructor() {}

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
              return {
                ...comment,
                user: user.data(),
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
  updateUserProfile(userId: string, data: any): Promise<void> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return updateDoc(userRef, data);
  }

  getFollowingUsers(userId: string): Observable<any[]> {
    const userDoc = doc(this.firestore, `users/${userId}`);
    return docData(userDoc).pipe(
      switchMap((user: any) => {
        const followingIds = user.following || [];
        const usersRef = collection(this.firestore, 'users');
        const usersQuery = query(usersRef, where('id', 'in', followingIds));
        return collectionData(usersQuery, { idField: 'id' });
      })
    );
  }
  searchUsername(username: string): Observable<any[]> {
    const usersRef = collection(this.firestore, 'users');
    const usersQuery = query(usersRef, where('username', '==', username));
    return collectionData(usersQuery, { idField: 'id' });
  }

  // Buscar usuarios por nombre de usuario
  searchUser(username: string): Observable<any[]> {
    const usersRef = collection(this.firestore, 'users');
    // Convertir el username a minúsculas para hacer la búsqueda insensible a mayúsculas/minúsculas
    const usernameLowercase = username.toLowerCase();

    // Realizar la búsqueda en Firestore
    const usersQuery = query(
      usersRef,
      where('username', '>=', usernameLowercase),
      where('username', '<=', usernameLowercase + '\uf8ff') // Esto maneja la búsqueda parcial
    );


    return collectionData(usersQuery, { idField: 'id' }).pipe(
      tap(users => {
        console.log('Usuarios encontrados:', users); // Ver los usuarios obtenidos
      })
    );
  }

  setSelectedCategories(categories: string[]) {
    this.selectedCategoriesSubject.next(categories);
  }
}
