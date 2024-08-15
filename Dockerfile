FROM postgres:13
# init.sql

COPY ./init.sql /docker-entrypoint-initdb.d/