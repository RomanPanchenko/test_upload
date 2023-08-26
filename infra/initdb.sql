CREATE DATABASE IF NOT EXISTS test_upload_db DEFAULT CHARACTER SET = utf8;

create table file
(
    id         int auto_increment
        primary key,
    name       varchar(254) not null,
    size       int          not null,
    created_at datetime(6)  null,
    updated_at datetime(6)  null,
    bucket_id  int          not null
);

create table bucket
(
    id   int auto_increment
        primary key,
    name varchar(254) not null,
    url  varchar(512) null
);

create table version
(
    file_id    int         not null,
    version_id varchar(34) not null
);


insert into bucket (id, name, url) values(1, 'rpanchenko123-test-upload-bucket', 'https://rpanchenko123-test-upload-bucket.s3.eu-central-1.amazonaws.com');
