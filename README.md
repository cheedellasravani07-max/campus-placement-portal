# Campus Placement Portal

## 📌 Project Overview

Campus Placement Portal is a web-based application developed to manage
campus placement activities.

The system allows users to manage students, companies, job opportunities,
and student applications through a simple web interface.

## 🚀 Features

### Student Management
- Add students
- View students
- Search students
- Edit student details
- Delete students

### Company Management
- Add companies
- View companies
- Search companies
- Edit company details
- Delete companies

### Job Management
- Add jobs
- View jobs
- Search jobs
- Edit job details
- Delete jobs

### Application Management
- Add applications
- Select students and jobs using dropdowns
- View applications
- Filter applications by status
- Edit applications
- Delete applications

### Dashboard
- Total students
- Total companies
- Total jobs
- Total applications

## 🛠️ Technologies Used

- Java
- Spring Boot
- Spring Data JPA
- Hibernate
- MySQL
- HTML
- CSS
- JavaScript
- Maven

## 🗄️ Database

Database used:

`campus_placement_db`

Main entities:

- Student
- Company
- Job
- Application

## 🔗 Entity Relationships

```text
Company
   │
   └── Job
         │
         └── Application
                │
                └── Student