class idAndTitle {
    id: number;
    title: string;

    constructor(obj: any) {
        this.id = obj.id
        this.title = obj.title
    }
}

export class Movie {
    Title: string
    // Year: '2014'
    // Rated: 'PG-13'
    // Released: '07 Nov 2014'
    // Runtime: '169 min'
    // Actors: Array<string>
    // Awards: string
    // BoxOffice: 
    // Country: 
    // DVD: 
    // Director: 
    // Genre: 
    // Language:
    // Metascore:
    // Plot: 
    // Poster: 
    // Production: 
    // Rated: 
    // Ratings:
    // Released:
    // Response:
    // Runtime:
    // Title:
    // Type:
    // Website:
    // Writer:
    // Year:
    // imdbID: 
    // imdbRating:
    // imdbVotes:

    constructor(title: string) {
        {
            this.Title = title;
            // this.favoritesList = user.favoritesList;
            // this.watchList = user.watchList;
            // this.otherListIDs = user.otherListIDs;
            // this.savedListIDs = user.savedListIDs;
            // this.friendsIDs = user.friendsIDs;
            // this.friendReccs = user.friendReccs;
        }
    }
}