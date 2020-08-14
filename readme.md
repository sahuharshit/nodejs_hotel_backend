Backend for Hotel app

install npm modules with `npm install`



install postgres from https://www.postgresql.org/download/

$ psql template1
postgres=# CREATE USER pradyumna WITH PASSWORD 'pradyumna'; //or some other user
postgres=# ALTER USER pradyumna WITH SUPERUSER;

check users with `\du`
You will see two users - pradyumna and postgres(or some other default superuser)
if you want, change default's password for security - 

    postgres=# ALTER USER postgres WITH PASSWORD '[some_secure_password_here]';

make a "hoteldb" database and set username and password in ./database/db.js line 4
    $ createdb hoteldb


also change the process.env.SECRET_KEY in ./routes/Users.js 
users table is made by `db.sequelize.sync();` in ./models/User.js line 32

once this is done, run the server with `npm start`


