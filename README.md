# School Mark System - Complete Web Application

A comprehensive School Mark Management System built with Firebase that allows admins, teachers, and students/parents to manage student marks, generate report cards, and send WhatsApp notifications.

## 🌟 Features

### 1. **Authentication & Role-Based Access**
- Email/password authentication
- Role-based access control (Admin, Teacher, Student, Parent)
- Secure profile management with switch account functionality

### 2. **Student Management**
- Add, edit, and delete students
- Complete student profiles with:
  - Name, Roll Number
  - Class and Section
  - Parent Name and Phone
  - Email (optional)

### 3. **Subject & Exam Management**
- Create subjects per class
- Set maximum marks and passing criteria
- Schedule different types of exams:
  - Unit Tests
  - Midterm
  - Final Exams
  - Annual Exams

### 4. **Marks Entry System**
- Teacher-friendly marks entry interface
- **Automatic Calculations:**
  - Subject-wise percentage
  - Total obtained marks
  - Overall percentage
  - Grade assignment (A+, A, B, C, D, Fail)
- **Real-time Highlighting:**
  - Failed subjects marked in red (< 35%)
  - Pass/Fail indicators (✅/❌)
  - Live total calculation while typing

### 5. **Fail Detection & Promotion Status**
- Automatic detection of failed subjects
- Promotion status based on performance
- Visual indicators for pass/fail

### 6. **Report Cards**
- Professional report card generation
- Complete student information
- Subject-wise marks table
- Total, percentage, and grade
- Teacher remarks
- Promotion status
- **Printable/PDF format**

### 7. **WhatsApp Notifications** (Free Mode)
- Automatic notification when marks are submitted
- Detailed message with:
  - School name
  - Student details
  - Exam information
  - Subject-wise marks
  - Total, percentage, grade
  - Promotion status
- Cloud Function trigger on marks submission

### 8. **Cloud Functions**
- `sendWhatsAppNotification`: Triggered on new marks
- `sendWhatsAppOnUpdate`: Triggered on marks update
- `calculateClassRank`: Automatic rank calculation
- `scheduledBackup`: Daily data backup

### 9. **Security**
- Firestore security rules
- Role-based access control
- Students/parents can only view their own data
- Teachers can write marks
- Admins have full access

### 10. **UI/UX**
- Responsive design for all devices
- Role-specific dashboards
- Real-time data updates
- Professional and clean interface
- Profile menu with logout and switch account

## 🚀 Tech Stack

### Frontend
- **HTML5**: Structure
- **CSS3**: Styling with responsive design
- **JavaScript (ES6+)**: Application logic
- **Firebase SDK**: Authentication and Firestore

### Backend
- **Firebase Authentication**: User management
- **Cloud Firestore**: NoSQL database
- **Cloud Functions**: Serverless backend
- **Firebase Hosting**: Web hosting

### CI/CD
- **GitHub Actions**: Automated deployment
- **GitHub**: Version control and collaboration

### Free Services Used
- Firebase Authentication (Email/Password)
- Cloud Firestore (Free tier)
- Cloud Functions (Free tier)
- Firebase Hosting (Free tier)

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Node.js** (v18 or higher) installed
2. **npm** or **yarn** package manager
3. **Firebase account** (Create at [firebase.google.com](https://firebase.google.com))
4. **GitHub account** (for automated deployment)
5. **Git** installed locally

## 🛠️ Setup Instructions

### Quick Start Options

You have two options for deployment:

#### Option 1: Manual Deployment (Recommended for First-Time Setup)
Follow the manual deployment steps below. See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

#### Option 2: GitHub Automated Deployment (Recommended for Ongoing Development)
Follow the GitHub integration guide for automated CI/CD deployments. See [GITHUB_SETUP_GUIDE.md](GITHUB_SETUP_GUIDE.md) for detailed instructions.

### Manual Deployment Steps

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name: `school-mark-system`
4. Follow the setup wizard
5. Enable Google Analytics (optional)

### Step 2: Enable Required Services

#### 2.1 Enable Authentication
1. Go to **Build > Authentication**
2. Click **Get Started**
3. Select **Email/Password** sign-in method
4. Enable it and click **Save**

#### 2.2 Enable Firestore
1. Go to **Build > Firestore Database**
2. Click **Create Database**
3. Select a location (choose closest to your users)
4. Start in **Test Mode** (we'll add security rules later)
5. Click **Enable**

#### 2.3 Enable Cloud Functions
1. Go to **Build > Functions**
2. Click **Get Started**
3. Accept the Blaze Plan (pay-as-you-go) - you only pay for usage beyond free tier

### Step 3: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 4: Login to Firebase

```bash
firebase login
```

This will open a browser window for authentication.

### Step 5: Clone or Download This Project

```bash
# If using git
git clone <your-repo-url>
cd school-mark-system

# Or download and extract the files
```

### Step 6: Install Dependencies

```bash
# Install root dependencies
npm install

# Install functions dependencies
cd functions
npm install
cd ..
```

### Step 7: Initialize Firebase

```bash
firebase init
```

When prompted:
- Select: **Hosting**, **Firestore**, **Functions**
- Select existing project: **school-mark-system**
- Public directory: **public**
- Configure as single-page app: **Yes**
- Set up automatic builds: **No**
- Language: **JavaScript**
- ESLint: **No**

### Step 8: Configure Firebase

#### 8.1 Get Firebase Configuration
1. Go to **Project Settings** in Firebase Console
2. Scroll down to **Your apps**
3. Click **Web app (</>)**
4. Copy the configuration

#### 8.2 Update `firebase-config.js`
Replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 9: Deploy Security Rules

The `firestore.rules` file is already included. Deploy it:

```bash
firebase deploy --only firestore:rules
```

### Step 10: Deploy Database Indexes

```bash
firebase deploy --only firestore:indexes
```

### Step 11: Deploy the Application

```bash
# Deploy everything
firebase deploy

# Or deploy specific parts
firebase deploy --only hosting
firebase deploy --only functions
```

### Step 12: Access Your Application

After deployment, Firebase will provide a hosting URL:
```
https://your-project.web.app
```

## 👥 User Setup

### Create First Admin User

1. Open the application in your browser
2. Click **"Register"**
3. Fill in the details:
   - **Name**: Admin Name
   - **Email**: admin@yourschool.com
   - **Password**: Your secure password
   - **Role**: Admin
4. Click **"Register"**

### Create Teachers

1. Login as Admin
2. Ask teachers to register with **Teacher** role
3. Or create teacher accounts manually in Firebase Console

### Create Students/Parents

1. Login as Admin
2. Go to **Students** section
3. Click **"Add Student"**
4. Fill in student details
5. For parents: Register with **Parent** role and link to student

## 📖 Usage Guide

### For Admins

#### Dashboard
- View statistics (students, classes, subjects, exams)
- See recent students
- Quick access to all features

#### Manage Students
1. Click **"➕ Add Student"** or go to **Students** section
2. Fill in student details
3. Click **"Save Student"**
4. Edit or delete students as needed

#### Manage Classes
1. Click **"➕ Add Class"** or go to **Classes** section
2. Select class name (1-12)
3. Enter section (A, B, C, etc.)
4. Add class teacher (optional)
5. Click **"Save Class"**

#### Manage Subjects
1. Click **"➕ Add Subject"** or go to **Subjects** section
2. Enter subject name
3. Select class
4. Set maximum marks (default: 100)
5. Set passing marks (default: 35)
6. Click **"Save Subject"**

#### Manage Exams
1. Click **"➕ Add Exam"** or go to **Exams** section
2. Select exam type (Unit Test, Midterm, Final, etc.)
3. Select class
4. Choose exam date
5. Click **"Save Exam"**

### For Teachers

#### Dashboard
- View marks entry queue
- See pending and completed marks
- Quick access to marks entry

#### Enter Marks
1. Click **"📝 Enter Marks"**
2. Select Class
3. Select Exam
4. Select Student
5. Enter marks for each subject:
   - Marks are auto-calculated in real-time
   - Failed subjects are highlighted in red
   - Total and percentage update automatically
6. Add teacher remark (optional)
7. Click **"Submit Marks"**
8. WhatsApp notification is sent automatically

#### Generate Report Cards
1. Click **"📄 Generate Report Card"**
2. Select Student
3. Select Exam
4. Report card is generated automatically
5. Click **"🖨️ Print Report Card"** to print or save as PDF

### For Students/Parents

#### Dashboard
- View student information
- See recent results
- Access report cards

#### View Report Card
1. Click **"📄 View Report Card"**
2. Select exam (if multiple available)
3. View complete report card with:
   - Subject-wise marks
   - Total and percentage
   - Grade
   - Promotion status
   - Teacher remarks

#### Print Report Card
1. Open report card
2. Click **"🖨️ Print Report Card"**
3. Choose save as PDF or print to printer

## 🔧 Configuration Options

### Environment Variables (Optional)

Create a `.runtimeconfig.json` file in the project root:

```json
{
  "SCHOOL_NAME": "Your School Name"
}
```

### WhatsApp Integration (Optional)

To enable actual WhatsApp messaging, you can integrate with:

#### Option 1: Twilio
1. Create a Twilio account at [twilio.com](https://www.twilio.com)
2. Get your Account SID and Auth Token
3. Purchase a WhatsApp number
4. Add these to Firebase environment variables:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_WHATSAPP_NUMBER`
5. Uncomment the Twilio code in `functions/index.js`

#### Option 2: Gupshup
1. Create a Gupshup account
2. Get API credentials
3. Update the Cloud Functions accordingly

#### Option 3: Other Providers
- MessageBird
- Vonage
- WhatsApp Business API (Meta)

## 📊 Database Schema

### Collections

#### `users`
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  role: "admin|teacher|student|parent",
  createdAt: timestamp
}
```

#### `students`
```javascript
{
  name: "Jane Smith",
  rollNumber: "001",
  class: "10",
  section: "A",
  parentName: "Robert Smith",
  parentPhone: "+1234567890",
  email: "jane@example.com",
  parentId: "user_id", // For linking parent accounts
  createdAt: timestamp
}
```

#### `classes`
```javascript
{
  name: "10",
  section: "A",
  classTeacher: "Mr. Johnson",
  createdAt: timestamp
}
```

#### `subjects`
```javascript
{
  name: "Mathematics",
  class: "10",
  maxMarks: 100,
  passingMarks: 35,
  createdAt: timestamp
}
```

#### `exams`
```javascript
{
  name: "Final Exam",
  class: "10",
  date: "2024-03-15",
  status: "upcoming|ongoing|completed",
  createdAt: timestamp
}
```

#### `marks`
```javascript
{
  studentId: "student_id",
  examId: "exam_id",
  subjects: [
    {
      subjectId: "subject_id",
      subjectName: "Mathematics",
      maxMarks: 100,
      passingMarks: 35,
      obtainedMarks: 85,
      isPassed: true,
      percentage: 85
    }
  ],
  totalObtained: 425,
  totalMaximum: 500,
  overallPercentage: 85,
  overallGrade: "A",
  failedSubjects: 0,
  isPromoted: true,
  rank: 1,
  remark: "Excellent performance!",
  submittedBy: "user_id",
  submittedByName: "Teacher Name",
  createdAt: timestamp
}
```

#### `reportCards`
```javascript
{
  studentId: "student_id",
  examId: "exam_id",
  marksId: "marks_id",
  generatedAt: timestamp
}
```

#### `notifications`
```javascript
{
  type: "whatsapp|whatsapp_update",
  studentId: "student_id",
  examId: "exam_id",
  marksId: "marks_id",
  phone: "+1234567890",
  message: "Full WhatsApp message...",
  status: "logged|sent|failed",
  sentAt: timestamp
}
```

#### `backups`
```javascript
{
  type: "daily",
  students: [...],
  marks: [...],
  timestamp: timestamp
}
```

## 🔒 Security Rules

The `firestore.rules` file implements:

- **Authentication Required**: All reads require user authentication
- **Role-Based Access**:
  - Admins: Full access
  - Teachers: Can write marks and student data
  - Students/Parents: Can only read their own data
- **Data Isolation**: Students can only see their marks
- **Parent Access**: Parents can see their children's data

## 📱 Features in Detail

### Automatic Grade Calculation

The system automatically assigns grades based on percentage:

- **A+**: 90% and above
- **A**: 80% - 89%
- **B**: 70% - 79%
- **C**: 60% - 69%
- **D**: 35% - 59%
- **Fail**: Below 35%

### Promotion Status

- **Promoted**: All subjects passed (≥ passing marks)
- **Not Promoted**: One or more subjects failed

### Real-time Calculations

As teachers enter marks:
- Subject percentage is calculated instantly
- Total obtained marks update
- Overall percentage is computed
- Grade is assigned
- Pass/fail status is determined
- Failed subjects are highlighted in red

### WhatsApp Message Format

The WhatsApp notification includes:

```
📚 SCHOOL NAME

👤 Student Name: John Doe
🎓 Class: 10 - A
📋 Exam: Final Exam

📖 Mathematics: 85/100 (85%) ✅
📖 Science: 78/100 (78%) ✅
📖 English: 72/100 (72%) ✅

📊 Total: 425/500
📈 Percentage: 85%
🏆 Grade: A
❌ Failed Subjects: 0

🎯 Status: ✅ PROMOTED

📝 Teacher's Remark: Excellent performance!

─────────────────
Generated by School Mark System
```

## 🧪 Testing

### Local Testing with Firebase Emulators

```bash
# Install emulators
firebase init emulators

# Start emulators
firebase emulators:start

# The app will use emulators for testing
```

### Test Accounts

Create test accounts for each role:
- Admin: admin@test.com
- Teacher: teacher@test.com
- Student: student@test.com
- Parent: parent@test.com

## 🚀 Deployment Options

### Option 1: Manual Deployment with Firebase CLI

```bash
# Deploy everything
firebase deploy

# Deploy hosting only
firebase deploy --only hosting

# Deploy functions only
firebase deploy --only functions

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy specific functions
firebase deploy --only functions:sendWhatsAppNotification
```

**See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for complete manual deployment instructions.**

### Option 2: Automated Deployment with GitHub Actions

This is the recommended approach for ongoing development:

1. **Push to GitHub** → Automatic deployment triggered
2. **Pull Request** → Preview deployment
3. **Merge to Main** → Production deployment

**Benefits:**
- Zero-downtime deployments
- Automatic version control
- Easy rollback capability
- CI/CD pipeline integration

**See [GITHUB_SETUP_GUIDE.md](GITHUB_SETUP_GUIDE.md) for complete GitHub integration instructions.**

#### GitHub Workflows Included:

1. **Hosting Deploy** - Quick frontend updates
2. **Full Deployment** - Hosting + Functions
3. **Firestore Deploy** - Rules and indexes updates

## 📝 Maintenance

### Backup Data

The system includes automatic daily backups. You can also:

```bash
# Export Firestore data
firebase firestore:export --backup-path ./backups

# Import Firestore data
firebase firestore:import --backup-path ./backups
```

### Monitor Functions

```bash
# View function logs
firebase functions:log

# View real-time logs
firebase functions:log --only sendWhatsAppNotification
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Authentication Errors
- Ensure Authentication is enabled in Firebase Console
- Check email/password format
- Verify Firestore security rules

#### 2. Marks Not Saving
- Check Firestore permissions
- Ensure teacher has proper role
- Check browser console for errors

#### 3. WhatsApp Not Sending
- Verify Cloud Functions are deployed
- Check notification logs in Firestore
- Ensure API credentials are set (if using actual WhatsApp API)

#### 4. Report Card Not Generating
- Ensure marks are submitted for the student
- Check exam and student IDs
- Verify data in Firestore

## 🔐 Security Best Practices

1. **Strong Passwords**: Enforce strong password policies
2. **Email Verification**: Enable email verification in Authentication
3. **Regular Backups**: Monitor and maintain backup system
4. **Audit Logs**: Keep track of who changed what
5. **Rate Limiting**: Implement rate limiting for API calls (if needed)

## 📞 Support

For issues or questions:
- Check the Firebase documentation
- Review Firestore security rules
- Examine Cloud Functions logs
- Test with Firebase emulators
- Review GitHub Actions logs (if using automated deployment)
- Check deployment guides:
  - [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Manual deployment
  - [GITHUB_SETUP_GUIDE.md](GITHUB_SETUP_GUIDE.md) - GitHub integration

## 📄 License

This project is open source and available for educational purposes.

## 🔄 CI/CD Pipeline

The project includes GitHub Actions for automated deployment:

### Workflows

1. **firebase-hosting-deploy.yml**
   - Deploys frontend to Firebase Hosting
   - Triggers on push to main/master
   - Supports pull request previews

2. **firebase-deploy-full.yml**
   - Deploys Hosting + Cloud Functions
   - Full application deployment
   - Triggers on push or manual dispatch

3. **deploy-firestore.yml**
   - Deploys Firestore rules and indexes
   - Triggers on changes to Firestore config files
   - Manual dispatch available

### Setup Required

To use automated deployment, see [GITHUB_SETUP_GUIDE.md](GITHUB_SETUP_GUIDE.md)

Required GitHub Secrets:
- `FIREBASE_TOKEN` - CI token for Firebase
- `FIREBASE_SERVICE_ACCOUNT` - Service account JSON

### Deployment Process

```bash
# 1. Make changes
git add .
git commit -m "Update feature"

# 2. Push to GitHub
git push origin main

# 3. Automatic deployment starts
# Check: GitHub Actions tab

# 4. View live site
# https://school-mark-system.web.app
```

### Monitoring

- **GitHub Actions**: View workflow runs and logs
- **Firebase Console**: Check deployment status and function logs
- **Rollback**: Easy rollback to previous versions via GitHub or Firebase

## 🎉 Conclusion

The School Mark System provides a complete, professional solution for managing student marks with:
- **100% Free Tier Compatible**
- **Real-time Calculations**
- **WhatsApp Notifications**
- **Professional Report Cards**
- **Role-Based Access**
- **Secure Database**
- **Responsive Design**

Start managing your school's marks efficiently today! 🚀