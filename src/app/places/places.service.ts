import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';

import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';

interface placeData {
  availableFrom: string,
  availableTo: string,
  description: string,
  imageUrl: string,
  price: number,
  title: string,
  userId: string
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  get places() {
    return this._places.asObservable();
  } 

  fetchPlaces() {
    return this.http.get<{[key: string]: placeData}>('https://ionic-airbnb-3fe1e.firebaseio.com/offered-places.json')
      .pipe(
        map(resData => {
          const places = [];
          for(const key in resData) {
            if(resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key, 
                  resData[key].title, 
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  new Date(resData[key].availableFrom),
                  new Date(resData[key].availableTo),
                  resData[key].userId 
                )
              );
            }
          }
          return places;
        }),
        tap(places => {
          this._places.next(places);
        })
      );
  }

  constructor(private authService: AuthService,
              private http: HttpClient  
  ) { }

  getPlace(id: string) {
    return this.http.get<placeData>(
      `https://ionic-airbnb-3fe1e.firebaseio.com/offered-places/${id}.json`
    ).pipe(
      map(placeData => {
        return new Place(
            id,
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId,
          )
      })
    );
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    let generatedId: string;
    const newPlace = new Place(
      Math.random.toString(),
      title,
      description,
      "https://i.pinimg.com/originals/65/8f/77/658f77b9b527f89922ba996560a3e2b0.jpg", 
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    
    return this.http
        .post<{name: string}>('https://ionic-airbnb-3fe1e.firebaseio.com/offered-places.json', { 
          ...newPlace, 
          id: null 
        })
        .pipe(
          switchMap(resData => {
            generatedId = resData.name;
            return this.places;
          }),
          take(1),
          tap(places => {
            newPlace.id = generatedId;
            this._places.next( places.concat(newPlace));  
          })
        );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap(places => {
        if(!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId );
        const updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        return this.http.put(
          `https://ionic-airbnb-3fe1e.firebaseio.com/offered-places/${placeId}.json`,
          {...updatedPlaces[updatedPlaceIndex], id: null}
        ) 
      }),
      tap(() => {
        this._places.next( updatedPlaces ); 
      })
    );
  }

}
