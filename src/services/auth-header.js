

const authHeader = () => {
    const emp = JSON.parse(sessionStorage.getItem('emp'));
    if (emp && emp.token){
        return { Authorization: `Bearer ${emp.token}` }
    }
    else {
        return {};
    }
}

export default authHeader();