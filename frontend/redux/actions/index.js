import { USER_STATE_CHANGE, ALL_USERS_STATE_CHANGE, USER_BLOCKING_STATE_CHANGE, LIKES_STATE_CHANGE, FADES_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE,NFL_GAMES_STATE_CHANGE, NCAAF_GAMES_STATE_CHANGE, MLB_GAMES_STATE_CHANGE, NBA_GAMES_STATE_CHANGE, NCAAB_GAMES_STATE_CHANGE, CLEAR_DATA} from '../constants/index'
import firebase from 'firebase'
import { SnapshotViewIOSComponent } from 'react-native'
require('firebase/firestore')


export function clearData() {
    return ((dispatch) => {
        dispatch({type: CLEAR_DATA})
    })
}

export function fetchUser() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() })
                }
                else {
                }
            })
    })
}





export function fetchUserFollowing() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .onSnapshot((snapshot) => {
                let following = snapshot.docs.map(doc => {
                    const id = doc.id;
                    return id
                })
                dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following });
                for(let i = 0; i < following.length; i++){
                    dispatch(fetchUsersData(following[i], true));
                }
            })
    })
}

export function fetchUserBlocking() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("blocking")
            .doc(firebase.auth().currentUser.uid)
            .collection("userBlocking")
            .onSnapshot((snapshot) => {
                let blocking = snapshot.docs.map(doc => {
                    const id = doc.id;
                    return id
                })
                dispatch({ type: USER_BLOCKING_STATE_CHANGE, blocking });
                for(let i = 0; i < blocking.length; i++){
                }
            })
    })
}

export function fetchLikes() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .collection("userLikes")
            .onSnapshot((snapshot) => {
                let liked = snapshot.docs.map(doc => {
                    const id = doc.id;
                    return id
                })
                dispatch({ type: LIKES_STATE_CHANGE, liked });
                for(let i = 0; i < liked.length; i++){
                }
            })
    })
}

export function fetchFades() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("fades")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFades")
            .onSnapshot((snapshot) => {
                let faded = snapshot.docs.map(doc => {
                    const id = doc.id;
                    return id
                })
                dispatch({ type: FADES_STATE_CHANGE, faded });
                for(let i = 0; i < faded.length; i++){
                }
            })
    })
}

export function fetchAllUsers() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("users")
            .onSnapshot((snapshot) => {
                let allUsers = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                dispatch({ type: ALL_USERS_STATE_CHANGE, allUsers });
                for(let i = 0; i < allUsers.length; i++){
                }
            })
    })
}
            
export function fetchUsersData(uid, getPosts) {
    return ((dispatch, getState) => {
        const found = getState().usersState.users.some(el => el.uid === uid);
        if (!found) {
            firebase.firestore()
                .collection("users")
                .doc(uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        let user = snapshot.data();
                        user.uid = snapshot.id;

                        dispatch({ type: USERS_DATA_STATE_CHANGE, user })
                    }
                    else {
                    }
                })
                
        }
    })
}



export function fetchNFLGames() {
    return((dispatch) => {
        firebase.firestore()
        .collection("nfl")
        .orderBy("gameDate", "asc")
        .get()
        .then((snapshot) => {
            let nflGames = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data }
            })
            dispatch({ type: NFL_GAMES_STATE_CHANGE, nflGames })
        })
    })
}

export function fetchNCAAFGames() {
    return((dispatch) => {
        firebase.firestore()
        .collection("ncaaf")
        .orderBy("gameDate", "asc")
        .get()
        .then((snapshot) => {
            let ncaafGames = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data }
            })
            dispatch({ type: NCAAF_GAMES_STATE_CHANGE, ncaafGames })
        })
    })
}

export function fetchMLBGames() {
    return((dispatch) => {
        firebase.firestore()
        .collection("mlb")
        .orderBy("gameDate", "asc")
        .get()
        .then((snapshot) => {
            let mlbGames = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data }
            })
            dispatch({ type: MLB_GAMES_STATE_CHANGE, mlbGames })
        })
    })
}

export function fetchNBAGames() {
    return((dispatch) => {
        firebase.firestore()
        .collection("nba")
        .orderBy("gameDate", "asc")
        .get()
        .then((snapshot) => {
            let nbaGames = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data }
            })
            dispatch({ type: NBA_GAMES_STATE_CHANGE, nbaGames })
        })
    })
}

export function fetchNCAABGames() {
    return((dispatch) => {
        firebase.firestore()
        .collection("ncaab")
        .orderBy("gameDate", "asc")
        .get()
        .then((snapshot) => {
            let ncaabGames = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data }
            })
            dispatch({ type: NCAAB_GAMES_STATE_CHANGE, ncaabGames })
        })
    })
}




        
        

