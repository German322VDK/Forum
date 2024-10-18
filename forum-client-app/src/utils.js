export const AutHeader = () =>{
    const storedUser = localStorage.getItem('user');
    if(storedUser == null)
        return {};

    const user = JSON.parse(storedUser);
    const token = user != null ? user.token : null;
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    return headers;
}

export const getUser = ()=>{
    const storedUser = localStorage.getItem('user');
    if(storedUser == null)
        return null;

    return JSON.parse(storedUser);
}

export const getToken = () =>{
    const storedUser = localStorage.getItem('user');
    if(storedUser == null)
        return {};

    const user = JSON.parse(storedUser);
    const token = user != null ? user.token : null;

    return token;
}

export const getToggleResult = async(route)=>{
    const token = getToken();
    if(token == null || token == {})
        return false;

    try{
        const response = await fetch(route, {
            method: 'Get',
            headers: {
                'Authorization': `Bearer ${token}`,
              }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        return result;
        

    }catch(error) {
        console.error('There was a problem with the fetch operation:', error);
        return false;
    }
};