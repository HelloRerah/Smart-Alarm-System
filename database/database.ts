import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';
import { Alarm } from '../types/Alarm';
SQLite.enablePromise(true);
const DATABASE_NAME = 'SmartAlarm.db';
let db: SQLiteDatabase | null = null;

const getDB = async (): Promise<SQLiteDatabase> => {
if (db) return db;
db = await SQLite.openDatabase({ name: DATABASE_NAME, location: 'default' });
return db;};

export const initDatabase = async (): Promise<void> => {
const database = await getDB();
await database.executeSql(`
CREATE TABLE IF NOT EXISTS Alarms (
id TEXT PRIMARY KEY,
hour INTEGER NOT NULL,
minute INTEGER NOT NULL,
repeatDays TEXT NOT NULL DEFAULT '[]',
label TEXT NOT NULL DEFAULT '',
enabled INTEGER NOT NULL DEFAULT 1,
stage2DelayMinutes INTEGER NOT NULL DEFAULT 30,
photoVerificationOn INTEGER NOT NULL DEFAULT 1
);
`);
console.log('Database initialised');
};

export const insertAlarm = async (alarm: Alarm): Promise<void> => {
const database = await getDB();
await database.executeSql(
`INSERT INTO Alarms
(id, hour, minute, repeatDays, label, enabled, stage2DelayMinutes, photoVerificationOn)
VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
[
alarm.id,
alarm.hour,
alarm.minute,
JSON.stringify(alarm.repeatDays),
alarm.label,
alarm.enabled ? 1 : 0,
alarm.stage2DelayMinutes,
alarm.photoVerificationOn ? 1 : 0,
]
);
console.log('Alarm inserted:', alarm.id);
};
export const getAllAlarms = async (): Promise<Alarm[]> => {
const database = await getDB();
const [results] = await database.executeSql(
'SELECT * FROM Alarms ORDER BY hour, minute;'
);
const alarms: Alarm[] = [];
for (let i = 0; i < results.rows.length; i++) {
const row = results.rows.item(i);
alarms.push({
id: row.id,
hour: row.hour,
minute: row.minute,
repeatDays: JSON.parse(row.repeatDays),
label: row.label,
enabled: row.enabled === 1,
stage2DelayMinutes: row.stage2DelayMinutes,
photoVerificationOn: row.photoVerificationOn === 1,
});}
return alarms;
};

export const updateAlarm = async (alarm: Alarm): Promise<void> => {
const database = await getDB();
await database.executeSql(
`UPDATE Alarms
SET hour = ?, minute = ?, repeatDays = ?, label = ?,
enabled = ?, stage2DelayMinutes = ?, photoVerificationOn = ?
WHERE id = ?;`,
[
alarm.hour,
alarm.minute,
JSON.stringify(alarm.repeatDays),
alarm.label,
alarm.enabled ? 1 : 0,
alarm.stage2DelayMinutes,
alarm.photoVerificationOn ? 1 : 0,
alarm.id,
]
);
console.log('Alarm updated:', alarm.id);
};

export const deleteAlarm = async (id: string): Promise<void> => {
const database = await getDB();
await database.executeSql('DELETE FROM Alarms WHERE id = ?;', [id]);
console.log('Alarm deleted:', id);
};

