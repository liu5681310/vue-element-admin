import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}

export function getSchoolid() {
    return Cookies.get('schoolid')
}

export function setSchoolid(schoolid) {
    return Cookies.set('schoolid', schoolid)
}

export function removeSchoolid() {
    return Cookies.remove('schoolid')
}