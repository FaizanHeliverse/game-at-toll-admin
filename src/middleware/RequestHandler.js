const proxy = process.env.REACT_APP_PROXY   ;
export async function fetchData(path,requestOptions) {
    let response;
    
    requestOptions.headers = {
        ...requestOptions.headers,
        'Content-Type' : "application/json",
        'Accept' : 'application/json',
        'Authorization' : localStorage.accessToken
    } 
    let data = await fetch(proxy + path,requestOptions);
    data = await data.json();
    if(data.authStatus == undefined || data.authStatus == null) {
        return data;
    }
    console.log("Unauthorized. Trying to refresh session");
    const payload = {
        refreshToken:localStorage.refreshToken
    }
    const refreshOptions = {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
    }
    let refreshData = await fetch(proxy+'/refresh_session',refreshOptions);
    refreshData = await refreshData.json();
    if(!refreshData.status) {
        console.log("Refresh token is also expired");
        return null;    
    }
    console.log("Session Refreshed");
    localStorage.accessToken = refreshData.accessToken;
    localStorage.refreshToken = refreshData.refreshToken;
    requestOptions.headers = {
        ...requestOptions.headers,
        'Authorization': localStorage.accessToken
    }
    response = await fetch(proxy+path,requestOptions);
    response = await response.json();
    return response;
}