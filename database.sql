-- create table
CREATE TABLE student (
    student_id INT NOT NULL,
    student_name VARCHAR(100),
    reg_no NUMERIC(10),
    cgpa NUMERIC(4,2)   
);
-- add constraints
ALTER TABLE student ADD (
  CONSTRAINT student_pk PRIMARY KEY (student_id));
ALTER TABLE student ADD (
  CONSTRAINT student_unq UNIQUE (reg_no));
-- create sequence
CREATE SEQUENCE ID_SEQ;
-- create trigger using the sequence
CREATE OR REPLACE TRIGGER ID_TRIG
BEFORE INSERT ON student 
FOR EACH ROW 
WHEN (new.student_id IS NULL)
BEGIN 
    SELECT ID_SEQ.NEXTVAL 
    INTO :new.student_id 
    FROM dual;
END;
/
-- enable the trigger
ALTER TRIGGER ID_TRIG ENABLE;