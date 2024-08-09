import { useEffect, useState } from "react"
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const useUser = () => {
    const [user, setUser] = useState(null) //start as null, so that when we check it in 'unsubscribe' we 
    const [isLoading, setIsLoading] = useState(true)

        useEffect(() => {
            const unsubscribe = onAuthStateChanged(getAuth(), user => {
                setUser(user)
                setIsLoading(false)
            })

            return unsubscribe //when user navigates away, this disappears
        }, []) //this [] ensures that useEffect only gets called on initilization, not every time a component updates

        return {user, isLoading}
}

export default useUser