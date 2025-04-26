// juniOrDB.js
const fs = require('fs');
const path = require('path');

class JuniOrDB {
  constructor(dbFile = "DB.json") {
    this.dbPath = path.join(__dirname, dbFile);
    if (!fs.existsSync(this.dbPath)) {
      fs.writeFileSync(this.dbPath, '{}'); // Start with empty object
    }
  }

  _readDB() {
    return JSON.parse(fs.readFileSync(this.dbPath));
  }

  _writeDB(data) {
    fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
  }

  createTable(table) {
    const db = this._readDB();
    if (!db[table]) {
      db[table] = [];
      this._writeDB(db);
    }
  }

  insert(table, data) {
    const db = this._readDB();
    if (!db[table]) this.createTable(table);
    data.id = Date.now();
    db[table].push(data);
    this._writeDB(db);
    return data;
  }

  getAll(table) {
    const db = this._readDB();
    return db[table] || [];
  }

  getById(table, id) {
    const records = this.getAll(table);
    return records.find(item => item.id === id);
  }

  update(table, id, newData) {
    const db = this._readDB();
    const records = db[table] || [];
    const index = records.findIndex(item => item.id === id);
    if (index !== -1) {
      records[index] = { ...records[index], ...newData };
      this._writeDB(db);
      return records[index];
    }
    return null;
  }

  delete(table, id) {
    const db = this._readDB();
    if (!db[table]) return;
    db[table] = db[table].filter(item => item.id !== id);
    this._writeDB(db);
  }
}

module.exports = JuniOrDB;