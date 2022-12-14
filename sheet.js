const { GoogleSpreadsheet } = require('google-spreadsheet');

const secrets = require('./secrets')


class Sheet {
    constructor() {
        this.doc = new GoogleSpreadsheet(secrets.sheetUrl);
    }

    async load() {
        await this.doc.useServiceAccountAuth(secrets.credentials);
        await this.doc.loadInfo();
    }

    async addRow(row) {
        const sheet = this.doc.sheetsByIndex[0];
        await sheet.addRows([row]);
    }

    async getRows(i) {
        const sheet = this.doc.sheetsByIndex[i];
        const rows = await sheet.getRows();
        return rows;
    }

    async getRowByEmail(email) {
        const sheet = this.doc.sheetsByIndex[0];
        const rows = await sheet.getRows();

        // necessary if multiple users
        // const row = rows.filter(row => row.email === email)[0];

        return rows[0];
    }

    async getRowById(id) {
        const sheet = this.doc.sheetsByIndex[0];
        const rows = await sheet.getRows();

        // necessary if multiple users
        // const row = rows.filter(row => row.id === id)[0];

        return rows[0];
    }
}

module.exports = Sheet;