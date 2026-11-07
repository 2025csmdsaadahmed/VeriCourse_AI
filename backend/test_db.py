from sqlalchemy import text
from app.database.session import engine

try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT version()"))
        print("PostgreSQL Connected Successfully!")
        print(result.fetchone()[0])

except Exception as error:
    print("Database Connection Failed!")
    print(error)