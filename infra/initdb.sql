CREATE DATABASE IF NOT EXISTS test_upload_db DEFAULT CHARACTER SET = utf8;

use test_upload_db;

create table bucket
(
    id   int auto_increment primary key,
    name varchar(254) not null,
    url  varchar(512) null
);

create table file
(
    id         int auto_increment primary key,
    name       varchar(254) not null,
    url        varchar(254) not null,
    bucket_id  int          not null
);

create table version
(
    id         int auto_increment primary key,
    file_id    int         not null,
    version_id varchar(34) not null,
    size       int          not null,
    created_at datetime(6) null
);


insert into bucket (id, name, url)
values (1, 'rpanchenko123-test-upload-bucket',
        'https://rpanchenko123-test-upload-bucket.s3.eu-central-1.amazonaws.com');
