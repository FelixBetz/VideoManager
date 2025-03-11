export interface DatabaseCol {
	name: string;
	type: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	mapCb: null | ((x: any) => string);
}

export class DatabaseObject {
	tableName: string;
	cols: DatabaseCol[];

	constructor(pTableName: string, pCols: DatabaseCol[]) {
		this.tableName = pTableName;
		this.cols = pCols;
	}
	getCreateQuery(): string {
		const colStr = this.cols.map((col) => `${col.name} ${col.type}`).join(', ');
		return `CREATE TABLE IF NOT EXISTS ${this.tableName}(${colStr}) `;
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	getInsertQuery(obj: Record<string, any>): string {
		//skip 1st col (id col)
		const arr = this.cols.slice(1);

		const colsStr = arr.map((col) => col.name).join(', ');

		let queryString = `INSERT INTO ${this.tableName} (${colsStr})`;
		queryString += ' VALUES (' + this.mapValues(obj).join(',') + ')';

		return queryString;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	getUpdateQuery(obj: Record<string, any>): string {
		//skip 1st col (id col)
		const arr = this.cols.slice(1);
		const values = this.mapValues(obj);

		const cols = [];
		for (let i = 0; i < arr.length; i++) {
			cols.push(arr[i].name + ' = ' + values[i]);
		}

		return `UPDATE ${this.tableName} SET ${cols.join(', ')} WHERE id = ${obj.id} `;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private mapValues(obj: Record<string, any>): any[] {
		const arr = this.cols.slice(1);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const retArr: any[] = [];
		arr.forEach((key) => {
			if (key.mapCb != null) {
				retArr.push(key.mapCb(obj[key.name]));
			} else {
				if (typeof obj[key.name] == 'string') {
					retArr.push('"' + obj[key.name] + '"');
				} else {
					retArr.push(obj[key.name].toString());
				}
			}
		});

		return retArr;
	}
}
