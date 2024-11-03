import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  getUserInfo() {
    return {
      userName: "floorsalami",
      favoritesList: [],
      watchList: [],
      otherListIDs: [
        {
          id: 1,
          title: "my other list"
        }, 
        {
          id: 2,
          title: "the second extra list"
        }
      ],
      savedListIDs: [],
      friendsIDs: [],
      friendReccs: []
    }
  }
}
