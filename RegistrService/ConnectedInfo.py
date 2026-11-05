import _sqlite3
import email

from old_usrers_to_db import cursor


def rigistration():

    conn_old = _sqlite3.connect('students.db')
    cursor = conn_old.cursor()

    # СДЕЛАТЬ ЗАПРОС ПО ДАННЫХ ПО СТРОКЕ EMAIL
    cursor.execute('''SELECT fio, faculty, group FROM student WHERE email = ?''', ('', email))

    # ДОПИСАТЬ ЗАКРЫТИЕ БД, СОЗДАНИЕ НОВОЙ БД С ИТОГОВЫМИ УЖЕ ПОЛЬЗОВАТЕЛЯМИ С ПОЛЯМИ:
    # id
    # FIO
    # faculty
    # group
    # gender
    # birthDate