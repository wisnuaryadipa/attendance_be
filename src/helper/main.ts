export const isEmptyObject = (obj: Object) => {
    var name;
    for(name in obj) {
        return false;
    }
    return true;
}