<div align="center">

# 🎓 College Enterprise Handling System (CEHS)
### *Smart Campus Operations Made Simple, Transparent, and Fast*

[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg?style=for-the-badge)](LICENSE)

<br />

> **Tired of manual paper attendance, scattered Excel files, and last-minute exam hall ticket confusion?**  
> CEHS is a complete all-in-one digital campus management system that connects **Students**, **Teachers**, and **College Management** on one intuitive platform.

---

[💡 What is This?](#-plain-english-what-does-this-system-do) • [👥 Who Uses It?](#-how-it-works-for-everyone) • [✨ Key Highlights](#-what-makes-it-great) • [🚀 5-Minute Setup](#-running-the-project-locally-step-by-step) • [📡 Technical Reference](#-deep-dive-for-developers)

---

</div>

## 💡 Plain English: What Does This System Do?

Imagine running a college without a single paper sheet:

- **Teachers** take attendance on their phone or laptop in 15 seconds instead of calling out 60 names with a physical register.
- **Students** check their real-time attendance percentage directly from their phone so they never drop below the required 75% cutoff.
- **College Admins** organize departments, subjects, faculty schedules, and exam marks in one central place with zero spreadsheet chaos.

```text
       ┌────────────────────────────────────────────────────────┐
       │                CEHS Campus Cloud Hub                   │
       └───────┬──────────────────┬───────────────────┬─────────┘
               │                  │                   │
               ▼                  ▼                   ▼
      👨‍💼 Administrator        👩‍🏫 Faculty            👨‍🎓 Student
     • Set up departments   • Fast attendance    • Real-time attendance
     • Assign teachers      • Enter exam marks   • Check internal marks
     • Broadcast notices    • View class lists   • Digital campus ID

👥 How It Works for Everyone
Attendance Health Check: Real-time progress bar showing whether your attendance is safely above 75%.

Internal Marks Tracker: Instant access to your scores (Test 1, Test 2, Lab assessments) as soon as teachers post them.

Course Hub: View all registered subjects, credit points, and assigned professors for your current semester.

Direct Notifications: Receive immediate updates about exam schedules, timetables, and college circulars.

One-Click Attendance Sheet: Select your subject and date, then toggle absences with a single click—everyone else defaults to "Present".

Simple Marks Entry: Input scores directly into a clean digital marksheet that auto-calculates totals and averages.

Class Roster at a Glance: Access complete student lists sorted by roll number and department in seconds.

Campus Structure Management: Add departments (e.g., Computer Science, Mechanical) and configure course curricula.

Staff Course Allocation: Link professors to specific subjects and semesters without scheduling conflicts.

Secure Access Control: Ensure students only see their own records, teachers only manage their assigned classes, and sensitive data stays protected.

Everyday Problem,How CEHS Fixes It
"""Am I eligible for exams?""",Color-coded indicators warn students immediately if their attendance drops near 75%.
"""Lost attendance register sheets""",Records are securely backed up in an enterprise PostgreSQL cloud database.
"""Mark compilation takes weeks""",Faculty submit scores online; grade sheets and GPA calculations happen automatically.
"""Wrong person seeing private data""",Bank-grade security with encrypted logins ensures strict data privacy.

🚀 Running the Project Locally (Step-by-Step)
You do not need to be a senior software engineer to run this on your laptop. Just follow these steps:

1. What You Need First
Make sure you have installed:

*Node.js (Version 18 or newer)

*PostgreSQL (Free database)

*Git

2. Get the CodeOpen your terminal (or Command Prompt) and run:Bashgit clone [https://github.com/prathiksha-07-10ay/College-Enterprise-Handling.git](https://github.com/prathiksha-07-10ay/College-Enterprise-Handling.git)
cd College-Enterprise-Handling
3. Start the Backend (The Brain)Bash# Go to server folder and install dependencies
cd server
npm install

# Set up your environment file
cp .env.example .env
Note on .env: Open the newly created .env file and verify your PostgreSQL database connection:Code snippetPORT=5000
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/college_erp"
JWT_SECRET="your_custom_secret_key"
Bash# Set up the database tables automatically
npx prisma migrate dev --name init

# Start the backend server!
npm run dev
(Your backend is now running at http://localhost:5000)4. Start the Frontend (The User Interface)Open a new terminal window:Bash# Go to client folder and install dependencies
cd client
npm install

# Start the user interface!
npm run dev
Open your browser and visit:👉 http://localhost:5173Log in and explore the dashboards!📡 Deep Dive for DevelopersCode snippetdatasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  ADMIN
  FACULTY
  STUDENT
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  OD
}

model User {
  id           String    @id @default(uuid())
  email        String    @unique
  passwordHash String
  role         Role
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  facultyProfile Faculty?
  studentProfile Student?
}

model Department {
  id       String    @id @default(uuid())
  name     String    @unique
  code     String    @unique
  courses  Course[]
  students Student[]
  faculty  Faculty[]
}

model Student {
  id             String       @id @default(uuid())
  registerNumber String       @unique
  firstName      String
  lastName       String
  semester       Int
  userId         String       @unique
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  departmentId   String
  department     Department   @relation(fields: [departmentId], references: [id])
  enrollments    Enrollment[]
  attendance     Attendance[]
  marks          Mark[]
}

model Faculty {
  id           String       @id @default(uuid())
  employeeId   String       @unique
  firstName    String
  lastName     String
  designation  String
  userId       String       @unique
  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  departmentId String
  department   Department   @relation(fields: [departmentId], references: [id])
  allocations  Allocation[]
}

model Course {
  id           String       @id @default(uuid())
  code         String       @unique
  title        String
  credits      Int
  departmentId String
  department   Department   @relation(fields: [departmentId], references: [id])
  allocations  Allocation[]
  enrollments  Enrollment[]
}

model Allocation {
  id         String   @id @default(uuid())
  courseId   String
  course     Course   @relation(fields: [courseId], references: [id])
  facultyId  String
  faculty    Faculty  @relation(fields: [facultyId], references: [id])
  semester   Int
  academicYr String

  @@unique([courseId, facultyId, semester, academicYr])
}

model Enrollment {
  id         String   @id @default(uuid())
  studentId  String
  student    Student  @relation(fields: [studentId], references: [id])
  courseId   String
  course     Course   @relation(fields: [courseId], references: [id])
  enrolledAt DateTime @default(now())

  @@unique([studentId, courseId])
}

model Attendance {
  id        String           @id @default(uuid())
  date      DateTime         @db.Date
  status    AttendanceStatus
  studentId String
  student   Student          @relation(fields: [studentId], references: [id])
  courseId  String
}

model Mark {
  id        String   @id @default(uuid())
  examType  String
  maxMarks  Float
  obtained  Float
  studentId String
  student   Student  @relation(fields: [studentId], references: [id])
  courseId  String
}
MethodEndpointDescriptionPermitted RolesPOST/api/v1/auth/loginSign in with email and passwordEveryoneGET/api/v1/users/meFetch active user profileLogged-in UsersPOST/api/v1/departmentsAdd a new departmentAdminPOST/api/v1/courses/allocateAssign course to an instructorAdminPOST/api/v1/attendance/batchSubmit bulk lecture attendanceFacultyGET/api/v1/attendance/student/:idGet overall attendance percentageStudent, FacultyPOST/api/v1/marks/uploadPost exam or assignment resultsFacultyGET/api/v1/marks/student/:idRetrieve report card & marksStudent, Faculty📂 Project OrganizationPlaintextCollege-Enterprise-Handling/
├── 🌐 client/              # Everything user-facing (React, Tailwind CSS)
│   ├── src/components/     # Buttons, Navbars, Popups, Data Cards
│   ├── src/pages/          # Admin, Faculty, and Student Dashboard views
│   └── src/services/       # Network calls to backend
│
├── ⚙️ server/              # Business logic & security (Node.js, Express)
│   ├── prisma/             # Database layout & test data seeds
│   ├── src/controllers/    # Attendance calculations, mark evaluations
│   └── src/routes/         # Web URL endpoints for the application
│
├── 📄 LICENSE              # Project licensing rules
└── 📘 README.md            # You are here!
🤝 Want to Help Build This?Contributions, bug reports, and suggestions are welcome!Fork the repositoryCreate your branch: git checkout -b feature/CoolNewFeatureCommit your changes: git commit -m 'Add some cool feature'Push to branch: git push origin feature/CoolNewFeatureSubmit a Pull Request📜 LicenseThis project is open-source and released under the MIT License.
Feel free to use and adapt it for your college or institution!
