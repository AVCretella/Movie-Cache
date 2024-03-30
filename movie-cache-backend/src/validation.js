export const routeNames = {
    newRating: "newRating"
}

//TODO should we have a function for each isNumber, isString blah blah to return perfect errors? probs dont matter

//Will be used to validate all fields given to a route
export async function validateRequestBody(routeIdentifier, reqBody) {
    if (routeIdentifier === routeNames.newRating) {
        console.log("validating for newRating")
        try {
            const {movieId, userId} = reqBody

            let newRating = reqBody.rating
            if (newRating > 5) { newRating = 5 }
            else if (newRating < 0) { newRating = 0 }

            let newReview = ""
            if (reqBody.review && reqBody.review != "") { newReview = reqBody.review }

            return {movieId, userId, newRating, newReview}
        } catch (err) {
            throw new Error("You need all properties: rating, userId, and movieName. review is optional")
        }
    }
} 
