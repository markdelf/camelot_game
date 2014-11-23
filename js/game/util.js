//Helper function to compare arrays
function arrayEqualTo(source, array) {
    if (!array)
        return false;
    if (source.length != array.length)
        return false;
    for (var i = 0, l = source.length; i < l; i++) {
        if (source[i] instanceof Array && array[i] instanceof Array) {
            if (!arrayEqualtTo(source, array[i]))
                return false;
        } else if (source[i] != array[i]) {
            return false;
        }
    }
    return true;
}