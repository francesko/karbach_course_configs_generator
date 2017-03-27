String.prototype.lowercaseFirstLetter = function() {
    return this.charAt(0).toLowerCase() + this.slice(1);
};

String.prototype.uppercaseFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

if(!('contains' in String.prototype)) {
  String.prototype.contains = function(str, startIndex) {
    return -1 !== String.prototype.indexOf.call(this, str, startIndex);
  };
}