import json
import sqlite3

with open("students_db.json", "r", encoding="utf-8") as f:
    students = json.load(f)

conn = sqlite3.connect("OldInfo/students.db")
cursor = conn.cursor()

# 1. Принудительно удаляем старую таблицу с неправильным типом id
cursor.execute('DROP TABLE IF EXISTS students')

# 2. Создаем заново с правильным типом TEXT
cursor.execute('''
    CREATE TABLE students (
        id TEXT PRIMARY KEY,
        fio TEXT NOT NULL,
        faculty TEXT NOT NULL,
        [group] TEXT NOT NULL,
        email TEXT NOT NULL)''')


for student in students:
    cursor.execute(
        'INSERT OR REPLACE INTO students (id, fio, faculty, [group], email) VALUES (?, ?, ?, ?, ?)',
        (
            student.get('id'),
            student.get('fio'),
            student.get('faculty'),
            student.get('group'),
            student.get('email')
        )
    )

conn.commit()
conn.close()

print("Данные успешно импортированы!")
