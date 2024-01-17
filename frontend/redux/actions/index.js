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
    WNBA_GAMES_STATE_CHANGE, 
    NCAAB_GAMES_STATE_CHANGE,
    EPL_GAMES_STATE_CHANGE,
    MMA_GAMES_STATE_CHANGE,
    GOLF_GAMES_STATE_CHANGE,
    FUTURE_GAMES_STATE_CHANGE,
    TEAM_LOGOS_STATE_CHANGE,
    BLOG_DETAILS_STATE_CHANGE,
    FORMULA1_TEAMS_STATE_CHANGE,
    FORMULA1_RACES_STATE_CHANGE,
    FORMULA1_DRIVERS_STATE_CHANGE,
    FORMULA1_RANKINGS_STATE_CHANGE,
    NHL_GAMES_STATE_CHANGE, 
    ALL_POSTS_STATE_CHANGE,
    CONTEST_STATUS_STATE_CHANGE,
    CLEAR_DATA
    } from '../constants/index'
    
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const currentUser = auth().currentUser;


export function clearData() {
    return ((dispatch) => {
        dispatch({type: CLEAR_DATA})
    })
}
export function fetchUser() {
    return (dispatch) => {
      const unsubscribe = auth().onAuthStateChanged(async (user) => {
        if (user) {
          try {
            const snapshot = await firestore()
              .collection('users')
              .doc(user.uid)
              .get();
  
            if (snapshot.exists) {
              dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() });
            } else {
              // Handle the case where the user document does not exist
            }
          } catch (error) {
            console.error('Error fetching user:', error);
            // Handle the error appropriately
          }
        } else {
          // Handle the case where no user is signed in
          console.log('No user signed in');
        }
  
        // Clean up the listener when component unmounts
        unsubscribe();
      });
    };
  }

  export function fetchUserFollowing() {
    const currentUser = auth().currentUser;

    return ((dispatch) => {
        firestore()
            .collection("following")
            .doc(currentUser.uid)
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
    const currentUser = auth().currentUser;

    return ((dispatch) => {
       firestore()
            .collection("blocking")
            .doc(currentUser.uid)
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
    const currentUser = auth().currentUser;

    return ((dispatch) => {
        firestore()
            .collection("users")
            .doc(currentUser.uid)
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
    const currentUser = auth().currentUser;

    return ((dispatch) => {
        firestore()
            .collection("likes")
            .doc(currentUser.uid)
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
    const currentUser = auth().currentUser;

    return ((dispatch) => {
        firestore()
            .collection("fades")
            .doc(currentUser.uid)
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

export function fetchUsersData(uid, getPosts) {
    return ((dispatch, getState) => {
        const found = getState().usersState.users.some(el => el.uid === uid);
        if (!found) {
            firestore()
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

export function fetchAllUsers() {
    return ((dispatch) => {
        firestore()
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

/*export function fetchMLBGames() {
    return (dispatch) => {
      dispatch({ type: MLB_GAMES_STATE_CHANGE, mlbGames: [] }); // Clear previous games if any
    
      firestore()
        .collection("mlb")
        .orderBy('gameDate', 'desc')
        .onSnapshot((snapshot) => {
          let mlbGames = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          dispatch({ type: MLB_GAMES_STATE_CHANGE, mlbGames });
        });
    };
  }
  */

export function fetchNFLGames() {
    return ((dispatch) => {
        firestore()
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

/*export function fetchNCAAFGames() {
    return ((dispatch) => {
        firestore()
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
} */

export function fetchNBAGames() {
    return ((dispatch) => {
        firestore()
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

/*export function fetchWNBAGames() {
    return ((dispatch) => {
        firestore()
            .collection("wnba")
            .orderBy('gameDate', 'desc')
            .onSnapshot((snapshot) => {
                let wnbaGames = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                dispatch({ type: WNBA_GAMES_STATE_CHANGE, wnbaGames });
                for(let i = 0; i < wnbaGames.length; i++){
                }
            })
    })
} */

export function fetchNCAABGames() {
    return ((dispatch) => {
        firestore()
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
} 

export function fetchNHLGames() {
    return ((dispatch) => {
        firestore()
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
        firestore()
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
        firestore()
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
        firestore()
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

/*export function fetchFutureGames() {
    return ((dispatch) => {
        firestore()
            .collection("futures")
            .onSnapshot((snapshot) => {
                let futureGames = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                dispatch({ type: FUTURE_GAMES_STATE_CHANGE, futureGames });
            })
    })
} */

export function fetchTeamLogos() {
    return ((dispatch) => {
        firestore()
            .collection("logos")
            .onSnapshot((snapshot) => {
                let teamLogos = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                dispatch({ type: TEAM_LOGOS_STATE_CHANGE, teamLogos });
            })
    })
}

export function fetchBlogDetails() {
    return ((dispatch) => {
        firestore()
            .collectionGroup("userBlogs")
            .onSnapshot((snapshot) => {
                let blogDetails = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                dispatch({ type: BLOG_DETAILS_STATE_CHANGE, blogDetails });
            })
    })
}

/*export function fetchFormula1Teams() {
    return ((dispatch) => {
        firestore()
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
        firestore()
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
        firestore()
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
        firestore()
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
*/











        
        