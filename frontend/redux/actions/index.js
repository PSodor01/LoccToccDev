import { USER_STATE_CHANGE, 
    ALL_USERS_STATE_CHANGE, 
    USER_BLOCKING_STATE_CHANGE, 
    LIKES_STATE_CHANGE, 
    FADES_STATE_CHANGE, 
    USER_FOLLOWING_STATE_CHANGE, 
    USER_NOTIFICATIONS_STATE_CHANGE,
    USERS_DATA_STATE_CHANGE, 
    NFL_GAMES_STATE_CHANGE, 
    NCAAF_GAMES_STATE_CHANGE, 
    MLB_GAMES_STATE_CHANGE,
    NBA_GAMES_STATE_CHANGE, 
    NCAAB_GAMES_STATE_CHANGE,
    EPL_GAMES_STATE_CHANGE,
    MMA_GAMES_STATE_CHANGE,
    GOLF_GAMES_STATE_CHANGE,
    FUTURE_GAMES_STATE_CHANGE,
    FORMULA1_TEAMS_STATE_CHANGE,
    FORMULA1_RACES_STATE_CHANGE,
    FORMULA1_DRIVERS_STATE_CHANGE,
    FORMULA1_RANKINGS_STATE_CHANGE,
    NHL_GAMES_STATE_CHANGE, 
    ALL_POSTS_STATE_CHANGE,
    CONTEST_STATUS_STATE_CHANGE,
    CLEAR_DATA
    } from '../constants/index'
    
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

export function fetchUserNotifications() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .collection("notifications")
            .orderBy('creation', 'desc')
            .onSnapshot((snapshot) => {
                let userNotifications = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                dispatch({ type: USER_NOTIFICATIONS_STATE_CHANGE, userNotifications });
              
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

/*export function fetchAllPosts(uid) {
    var ourDate = new Date();
    var pastDate = ourDate.getDate() - 3;
    ourDate.setDate(pastDate);
    return ((dispatch) => {
        firebase.firestore()
            .collectionGroup("userPosts")
            .where("creation", ">=", ourDate)
            .orderBy('creation', 'desc')
            .get()
            .then((snapshot) => {
                let allPosts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                dispatch({ type: ALL_POSTS_STATE_CHANGE, allPosts });
                for(let i = 0; i < allPosts.length; i++){
                }
            })
    })
} */

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

export function fetchMLBGames() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("mlb")
            .orderBy('gameDate', 'desc')
            .onSnapshot((snapshot) => {
                let mlbGames = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                dispatch({ type: MLB_GAMES_STATE_CHANGE, mlbGames });
                for(let i = 0; i < mlbGames.length; i++){
                }
            })
    })
}

/*export function fetchNFLGames() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("nfl")
            .orderBy('gameDate', 'desc')
            .onSnapshot((snapshot) => {
                let nflGames = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                dispatch({ type: NFL_GAMES_STATE_CHANGE, nflGames });
                for(let i = 0; i < nflGames.length; i++){
                }
            })
    })
}

export function fetchNCAAFGames() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("ncaaf")
            .orderBy('gameDate', 'desc')
            .onSnapshot((snapshot) => {
                let ncaafGames = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                dispatch({ type: NCAAF_GAMES_STATE_CHANGE, ncaafGames });
                for(let i = 0; i < ncaafGames.length; i++){
                }
            })
    })
}*/

export function fetchNBAGames() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("nba")
            .orderBy('gameDate', 'desc')
            .onSnapshot((snapshot) => {
                let nbaGames = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                dispatch({ type: NBA_GAMES_STATE_CHANGE, nbaGames });
                for(let i = 0; i < nbaGames.length; i++){
                }
            })
    })
}

/*export function fetchNCAABGames() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("ncaab")
            .orderBy('gameDate', 'desc')
            .onSnapshot((snapshot) => {
                let ncaabGames = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                dispatch({ type: NCAAB_GAMES_STATE_CHANGE, ncaabGames });
            })
    })
} */

export function fetchNHLGames() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("nhl")
            .orderBy('gameDate', 'desc')
            .onSnapshot((snapshot) => {
                let nhlGames = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                dispatch({ type: NHL_GAMES_STATE_CHANGE, nhlGames });
                for(let i = 0; i < nhlGames.length; i++){
                }
            })
    })
}

export function fetchMMAGames() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("mma")
            .orderBy('gameDate', 'desc')
            .onSnapshot((snapshot) => {
                let mmaGames = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                dispatch({ type: MMA_GAMES_STATE_CHANGE, mmaGames });
                for(let i = 0; i < mmaGames.length; i++){
                }
            })
    })
}

export function fetchEPLGames() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("epl")
            .orderBy('gameDate', 'desc')
            .onSnapshot((snapshot) => {
                let eplGames = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                dispatch({ type: EPL_GAMES_STATE_CHANGE, eplGames });
                for(let i = 0; i < eplGames.length; i++){
                }
            })
    })
}


export function fetchGolfGames() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("golf")
            .onSnapshot((snapshot) => {
                let golfGames = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                dispatch({ type: GOLF_GAMES_STATE_CHANGE, golfGames });
                for(let i = 0; i < golfGames.length; i++){
                }
            })
    })
} 

export function fetchFutureGames() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("futures")
            .onSnapshot((snapshot) => {
                let futureGames = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                dispatch({ type: FUTURE_GAMES_STATE_CHANGE, futureGames });
                for(let i = 0; i < futureGames.length; i++){
                }
            })
    })
}

export function fetchFormula1Teams() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("formula1")
            .doc("info")
            .collection("teams")
            .orderBy('currentSeasonRank', 'asc')
            .onSnapshot((snapshot) => {
                let formula1Teams = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                dispatch({ type: FORMULA1_TEAMS_STATE_CHANGE, formula1Teams });
                
            })
    })
}
export function fetchFormula1Races() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("formula1")
            .doc("info")
            .collection("races")
            .doc("currentRace")
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    let formula1Races = snapshot.data();
                    dispatch({  type: FORMULA1_RACES_STATE_CHANGE, formula1Races})
                }
                else {
                }
            })
    })
}
export function fetchFormula1Drivers() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("formula1")
            .doc("info")
            .collection("drivers")
            .orderBy('driverRank', 'asc')
            .onSnapshot((snapshot) => {
                let formula1Drivers = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                dispatch({ type: FORMULA1_DRIVERS_STATE_CHANGE, formula1Drivers });
                
            })
    })
}
export function fetchFormula1Rankings() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("formula1")
            .doc("info")
            .collection("races")
            .orderBy('driverPosition', 'asc')
            .onSnapshot((snapshot) => {
                let formula1Rankings = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                dispatch({ type: FORMULA1_RANKINGS_STATE_CHANGE, formula1Rankings });
                
            })
    })
} 

export function fetchContestStatus() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("contest")
            .doc('oKeXGH8M6mmdawUvxADp')
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    let contestStatus = snapshot.data();

                    dispatch({ type: CONTEST_STATUS_STATE_CHANGE, contestStatus})
                }
                else {
                }
            })
                
    })
}












        
        

