const GET_DATA_IN_DOING = 'GET_DATA_IN_DOING';
const GET_SETDATA_IN_DOING = 'GET_SETDATA_IN_DOING';



export default (state = {}, action) => {
    switch (action.type) {
        case GET_DATA_IN_DOING:
            return {
                ...state,
                data: action.data,
            };
        case GET_SETDATA_IN_DOING:
            return {
                ...state,
                navRoot: action.data,
            };
        default:
            return state;
    }
}


export const getData = (data) => {
    return {
        type: GET_DATA_IN_DOING,
        data
    }
};

export const setData = (data, callback) => {
    callback && callback();
    return {
        type: GET_SETDATA_IN_DOING,
        data
    }
};
