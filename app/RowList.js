function RowList () {
    this.rows = []
};

RowList.prototype.add = function(row) {
    this.rows.push(row);
}

RowList.prototype.getRowsBySession = function(session) {
    return this.rows.filter(function(row) {
        return row.session == session;
    });
};

RowList.prototype.getRowsByType = function(type) {
    return this.rows.filter(function(row) {
        return row.type == type;
    });
};

module.exports = RowList;