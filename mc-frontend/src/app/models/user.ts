class idAndTitle {
    id: number;
    title: string;

    constructor(obj: any) {
        this.id = obj.id
        this.title = obj.title
    }
}

export class User {
    userName: string;
    favoritesList: Array<idAndTitle>;
    watchList: Array<idAndTitle>;
    otherListIDs: Array<idAndTitle>;    //The lists a user creates
    savedListIDs: Array<idAndTitle>;    //The lists a user saves, created by other users
    friendsIDs: Array<idAndTitle>;
    friendReccs: Array<idAndTitle>;      //A stack of movies recommended by friends

    constructor(user: any) {
        {
            this.userName = user.userName;
            this.favoritesList = user.favoritesList;
            this.watchList = user.watchList;
            this.otherListIDs = user.otherListIDs;
            this.savedListIDs = user.savedListIDs;
            this.friendsIDs = user.friendsIDs;
            this.friendReccs = user.friendReccs;
        }
    }
}