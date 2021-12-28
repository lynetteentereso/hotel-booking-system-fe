const initialState = {
    guests:[],
    bookings:[],
    rooms: [],
    users:[],
    departments:[],
    loggedInUser: localStorage.getItem('User') ? localStorage.getItem('User') : null
    
}   
const reducer = (state = initialState, action) => {
    switch(action.type){
        case 'LOGOUT':
            localStorage.removeItem('User');
            return { 
                ...state, 
                loggedInUser: null 
            };
        case 'SET_LOGGEDIN_USER':
            console.log(action.payload);
            localStorage.setItem("User", JSON.stringify( action.payload ))
            return { 
                ...state, 
                loggedInUser: JSON.stringify( action.payload )
            };
        case 'LOAD_USERS':
            return{
                ...state,
                users: action.payload
            };
        case 'LOAD_GUESTS':
            return{
                ...state,
                guests: action.payload
            };
        case 'LOAD_BOOKINGS':
            return{
                ...state,
                bookings: action.payload
            }
        case 'LOAD_ROOMS':
            return{
                ...state,
                rooms: action.payload
            }
        case 'LOAD_DEPARTMENTS':
            return{
                ...state,
                departments: action.payload
            }
        case 'ADD_GUEST':
            return{
                ...state,
                guests: [...state.guests, action.payload]
            };
        case 'ADD_BOOKING':
            return{
                ...state,
                bookings: [...state.bookings, action.payload]
            }
        case 'ADD_ROOM':
            return{
                ...state,
                rooms: [...state.rooms, action.payload]
            }
        case 'ADD_DEPARTMENT':
            return{
                ...state,
                departments: [...state.departments, action.payload]  
            }
        case 'DELETE_GUEST':
            return{
                ...state,
                guests: state.guests.filter(guest => guest._id !== action.payload)
            }
        case 'DELETE_ROOM':
            return{
                ...state,
                rooms: state.rooms.filter(room => room._id !== action.payload)
            }
        case 'DELETE_BOOKING':
            return{
                ...state,
                bookings: state.bookings.filter(book => book._id !== action.payload)
            }
        case 'DELETE_DEPARTMENT':
            return{
                ...state,
                departments: state.departments.filter(dep => dep._id !== action.payload)
            }
        case 'UPDATE_GUEST':
            return{
                ...state,
                guests: state.guests.map( guest => 
                    guest._id === action.payload._id
                    ? {...guest, full_name: action.payload.full_name, address: action.payload.address, city: action.payload.city, province: action.payload.address, zip_code: action.payload.zip_code, company_name:action.payload.company_name, email_address:action.payload.email_address, mobile_number: action.payload.mobile_number }
                    : guest)
            }
        case 'UPDATE_BOOKING':
            console.log(action.payload);
            return{
                ...state,
                bookings: state.bookings.map( booking => 
                    booking._id === action.payload._id
                    ? {...booking, guest: action.payload.guest, room: action.payload.room, room_num: action.payload.room_num, checkin_date: action.payload.checkin_date, checkout_date: action.payload.checkout_date, status: action.payload.status }
                    : booking)
            }
        case 'UPDATE_ROOM':
            return{
                ...state,
                rooms: state.rooms.map( room => 
                    room._id === action.payload._id
                    ? {...room, type: action.payload.type, rate: action.payload.rate, count: action.payload.count }
                    : room)
            }
        case 'UPDATE_DEPARTMENT':
            return{
                ...state,
                departments: state.departments.map( dept => 
                    dept._id === action.payload._id
                    ? {...dept, name: action.payload.name, head: action.payload.head }
                    : dept)
            }
        default:
            return state;
    }
}

export default reducer;
