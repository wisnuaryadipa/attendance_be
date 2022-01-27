export const addZero = (number, length) => {
    var isNegative = number < 0;
    var _number = isNegative ? -1 * number : number;
    for (var i = _number.toString().length; i < length; i++) {
        _number = '0' + _number;
    }
    return (isNegative ? '-' : '') + _number;
}