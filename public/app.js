// Global Variables
let currentUser = null;
let currentRole = null;
let currentStudent = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    try {
        // Check authentication state
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                currentUser = user;
                await loadUserData();
                showAppScreen();
            } else {
                showAuthScreen();
            }
            hideLoadingScreen();
        });
    } catch (error) {
        console.error('Initialization error:', error);
        showError('Failed to initialize application');
        hideLoadingScreen();
    }
}

// Screen Management
function showLoadingScreen() {
    document.getElementById('loadingScreen').classList.remove('hidden');
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('appScreen').classList.add('hidden');
}

function hideLoadingScreen() {
    document.getElementById('loadingScreen').classList.add('hidden');
}

function showAuthScreen() {
    document.getElementById('authScreen').classList.remove('hidden');
    document.getElementById('appScreen').classList.add('hidden');
}

function showAppScreen() {
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('appScreen').classList.remove('hidden');
    initializeDashboard();
}

// Load User Data
async function loadUserData() {
    try {
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            currentRole = userData.role;
            setupUserInterface(userData);
        } else {
            throw new Error('User data not found');
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        showError('Failed to load user data');
    }
}

// Setup User Interface
function setupUserInterface(userData) {
    // Update header
    document.getElementById('userNameDisplay').textContent = userData.name || 'User';
    document.getElementById('menuUserName').textContent = userData.name || 'User';
    document.getElementById('menuUserEmail').textContent = currentUser.email;
    document.getElementById('menuUserRole').textContent = userData.role || 'Role';
    
    // Update role badge
    const roleBadge = document.getElementById('userRoleBadge');
    roleBadge.textContent = userData.role || 'Role';
    
    // Show/hide navigation items based on role
    const adminOnly = document.querySelectorAll('.admin-only');
    const teacherOnly = document.querySelectorAll('.teacher-only');
    const studentParentOnly = document.querySelectorAll('.student-parent-only');
    
    adminOnly.forEach(el => el.classList.add('hidden'));
    teacherOnly.forEach(el => el.classList.add('hidden'));
    studentParentOnly.forEach(el => el.classList.add('hidden'));
    
    if (userData.role === 'admin') {
        adminOnly.forEach(el => el.classList.remove('hidden'));
    } else if (userData.role === 'teacher') {
        teacherOnly.forEach(el => el.classList.remove('hidden'));
    } else if (userData.role === 'student' || userData.role === 'parent') {
        studentParentOnly.forEach(el => el.classList.remove('hidden'));
    }
}

// Initialize Dashboard
async function initializeDashboard() {
    // Hide all dashboards
    document.getElementById('adminDashboard').classList.add('hidden');
    document.getElementById('teacherDashboard').classList.add('hidden');
    document.getElementById('studentDashboard').classList.add('hidden');
    
    if (currentRole === 'admin') {
        await initializeAdminDashboard();
    } else if (currentRole === 'teacher') {
        await initializeTeacherDashboard();
    } else if (currentRole === 'student' || currentRole === 'parent') {
        await initializeStudentDashboard();
    }
    
    // Load dropdown data
    await loadDropdownData();
}

// Admin Dashboard
async function initializeAdminDashboard() {
    document.getElementById('adminDashboard').classList.remove('hidden');
    
    // Load statistics
    await loadAdminStats();
    await loadRecentStudents();
}

async function loadAdminStats() {
    try {
        const [studentsSnapshot, classesSnapshot, subjectsSnapshot, examsSnapshot] = await Promise.all([
            db.collection('students').get(),
            db.collection('classes').get(),
            db.collection('subjects').get(),
            db.collection('exams').get()
        ]);
        
        document.getElementById('totalStudents').textContent = studentsSnapshot.size;
        document.getElementById('totalClasses').textContent = classesSnapshot.size;
        document.getElementById('totalSubjects').textContent = subjectsSnapshot.size;
        document.getElementById('totalExams').textContent = examsSnapshot.size;
    } catch (error) {
        console.error('Error loading admin stats:', error);
    }
}

async function loadRecentStudents() {
    try {
        const snapshot = await db.collection('students')
            .orderBy('createdAt', 'desc')
            .limit(10)
            .get();
        
        const tbody = document.getElementById('recentStudentsBody');
        tbody.innerHTML = '';
        
        snapshot.forEach(doc => {
            const student = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.rollNumber}</td>
                <td>Class ${student.class}</td>
                <td>${student.section}</td>
                <td>${student.parentName}</td>
                <td>
                    <div class="actions">
                        <button class="btn btn-secondary btn-sm" onclick="editStudent('${doc.id}')">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteStudent('${doc.id}')">Delete</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading recent students:', error);
    }
}

// Teacher Dashboard
async function initializeTeacherDashboard() {
    document.getElementById('teacherDashboard').classList.remove('hidden');
    await loadMarksQueue();
}

async function loadMarksQueue() {
    try {
        const examsSnapshot = await db.collection('exams').get();
        const tbody = document.getElementById('marksQueueBody');
        tbody.innerHTML = '';
        
        for (const examDoc of examsSnapshot.docs) {
            const exam = examDoc.data();
            
            // Get students in this class
            const studentsSnapshot = await db.collection('students')
                .where('class', '==', exam.class)
                .get();
            
            const totalStudents = studentsSnapshot.size;
            
            // Get marks submitted for this exam
            const marksSnapshot = await db.collection('marks')
                .where('examId', '==', examDoc.id)
                .get();
            
            const completed = marksSnapshot.size;
            const pending = totalStudents - completed;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>Class ${exam.class}</td>
                <td>${exam.name}</td>
                <td>${totalStudents}</td>
                <td class="${pending > 0 ? 'pending' : ''}">${pending}</td>
                <td>${completed}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="openMarksEntryForExam('${examDoc.id}')">
                        ${pending > 0 ? 'Enter Marks' : 'View Marks'}
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        }
    } catch (error) {
        console.error('Error loading marks queue:', error);
    }
}

// Student Dashboard
async function initializeStudentDashboard() {
    document.getElementById('studentDashboard').classList.remove('hidden');
    
    // Set dashboard title based on role
    if (currentRole === 'parent') {
        document.getElementById('studentDashboardTitle').textContent = 'Parent Dashboard';
    }
    
    await loadStudentInfo();
    await loadRecentResults();
}

async function loadStudentInfo() {
    try {
        let studentId;
        
        if (currentRole === 'student') {
            studentId = currentUser.uid;
        } else if (currentRole === 'parent') {
            // Find student linked to this parent
            const snapshot = await db.collection('students')
                .where('parentId', '==', currentUser.uid)
                .limit(1)
                .get();
            
            if (!snapshot.empty) {
                studentId = snapshot.docs[0].id;
                currentStudent = { id: studentId, ...snapshot.docs[0].data() };
            }
        }
        
        if (studentId) {
            const studentDoc = await db.collection('students').doc(studentId).get();
            if (studentDoc.exists) {
                const student = studentDoc.data();
                const infoDiv = document.getElementById('studentInfo');
                infoDiv.innerHTML = `
                    <div class="student-info-grid">
                        <div class="info-item">
                            <span class="info-label">Name</span>
                            <span class="info-value">${student.name}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Roll Number</span>
                            <span class="info-value">${student.rollNumber}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Class</span>
                            <span class="info-value">Class ${student.class} - ${student.section}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Parent Name</span>
                            <span class="info-value">${student.parentName}</span>
                        </div>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('Error loading student info:', error);
    }
}

async function loadRecentResults() {
    try {
        let studentId;
        if (currentRole === 'student') {
            studentId = currentUser.uid;
        } else if (currentRole === 'parent' && currentStudent) {
            studentId = currentStudent.id;
        }
        
        if (studentId) {
            const marksSnapshot = await db.collection('marks')
                .where('studentId', '==', studentId)
                .orderBy('createdAt', 'desc')
                .limit(5)
                .get();
            
            const resultsContainer = document.getElementById('recentResults');
            resultsContainer.innerHTML = '';
            
            for (const doc of marksSnapshot.docs) {
                const marks = doc.data();
                const examDoc = await db.collection('exams').doc(marks.examId).get();
                
                if (examDoc.exists) {
                    const exam = examDoc.data();
                    const resultCard = document.createElement('div');
                    resultCard.className = 'result-card';
                    resultCard.innerHTML = `
                        <div class="result-header">
                            <h4>${exam.name}</h4>
                            <span class="result-percentage">${marks.overallPercentage}%</span>
                        </div>
                        <div class="result-details">
                            <div class="result-detail">
                                <div class="result-detail-value">${marks.totalObtained}/${marks.totalMaximum}</div>
                                <div class="result-detail-label">Total</div>
                            </div>
                            <div class="result-detail">
                                <div class="result-detail-value">${marks.overallGrade}</div>
                                <div class="result-detail-label">Grade</div>
                            </div>
                            <div class="result-detail">
                                <div class="result-detail-value">${marks.isPromoted ? '✅' : '❌'}</div>
                                <div class="result-detail-label">Status</div>
                            </div>
                        </div>
                    `;
                    resultsContainer.appendChild(resultCard);
                }
            }
        }
    } catch (error) {
        console.error('Error loading recent results:', error);
    }
}

// Load Dropdown Data
async function loadDropdownData() {
    try {
        // Load classes
        const classesSnapshot = await db.collection('classes').get();
        const classSelects = document.querySelectorAll('#studentClass, #filterClass, #subjectClass, #examClass, #marksClass');
        
        classSelects.forEach(select => {
            // Clear existing options (except the first one)
            while (select.options.length > 1) {
                select.remove(1);
            }
            
            classesSnapshot.forEach(doc => {
                const classData = doc.data();
                const option = document.createElement('option');
                option.value = classData.name;
                option.textContent = `Class ${classData.name} - ${classData.section}`;
                select.appendChild(option);
            });
        });
        
        // Load students
        const studentsSnapshot = await db.collection('students').get();
        const studentSelects = document.querySelectorAll('#marksStudent, #reportStudent');
        
        studentSelects.forEach(select => {
            while (select.options.length > 1) {
                select.remove(1);
            }
            
            studentsSnapshot.forEach(doc => {
                const student = doc.data();
                const option = document.createElement('option');
                option.value = doc.id;
                option.textContent = `${student.name} (Class ${student.class} - ${student.section})`;
                select.appendChild(option);
            });
        });
        
        // Load exams
        const examsSnapshot = await db.collection('exams').get();
        const examSelects = document.querySelectorAll('#marksExam, #reportExam');
        
        examSelects.forEach(select => {
            while (select.options.length > 1) {
                select.remove(1);
            }
            
            examsSnapshot.forEach(doc => {
                const exam = doc.data();
                const option = document.createElement('option');
                option.value = doc.id;
                option.textContent = `${exam.name} (Class ${exam.class})`;
                select.appendChild(option);
            });
        });
    } catch (error) {
        console.error('Error loading dropdown data:', error);
    }
}

// Authentication Handlers
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
        showToast('Login successful!', 'success');
    } catch (error) {
        console.error('Login error:', error);
        showError(error.message);
    }
});

document.getElementById('registerFormElement').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;
    
    try {
        // Create user
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const userId = userCredential.user.uid;
        
        // Create user document
        await db.collection('users').doc(userId).set({
            name: name,
            email: email,
            role: role,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showToast('Registration successful!', 'success');
    } catch (error) {
        console.error('Registration error:', error);
        showError(error.message);
    }
});

document.getElementById('showRegister').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('loginForm').parentElement.classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
});

document.getElementById('showLogin').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('loginForm').parentElement.classList.remove('hidden');
});

// Profile Menu
document.getElementById('profileMenuBtn').addEventListener('click', () => {
    document.getElementById('profileMenu').classList.toggle('hidden');
});

document.getElementById('logout').addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        await auth.signOut();
        showToast('Logged out successfully!', 'success');
        document.getElementById('profileMenu').classList.add('hidden');
    } catch (error) {
        console.error('Logout error:', error);
        showError(error.message);
    }
});

document.getElementById('switchAccount').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('profileMenu').classList.add('hidden');
    showAuthScreen();
});

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', async (e) => {
        e.preventDefault();
        
        // Remove active class from all items
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        
        // Add active class to clicked item
        item.classList.add('active');
        
        const page = item.getAttribute('data-page');
        
        // Hide all sections
        document.getElementById('adminDashboard').classList.add('hidden');
        document.getElementById('teacherDashboard').classList.add('hidden');
        document.getElementById('studentDashboard').classList.add('hidden');
        document.getElementById('studentsList').classList.add('hidden');
        document.getElementById('classesList').classList.add('hidden');
        document.getElementById('subjectsList').classList.add('hidden');
        document.getElementById('examsList').classList.add('hidden');
        
        // Show relevant section
        switch (page) {
            case 'dashboard':
                if (currentRole === 'admin') {
                    await initializeAdminDashboard();
                } else if (currentRole === 'teacher') {
                    await initializeTeacherDashboard();
                } else {
                    await initializeStudentDashboard();
                }
                break;
            case 'students':
                await loadStudentsList();
                document.getElementById('studentsList').classList.remove('hidden');
                break;
            case 'classes':
                await loadClassesList();
                document.getElementById('classesList').classList.remove('hidden');
                break;
            case 'subjects':
                await loadSubjectsList();
                document.getElementById('subjectsList').classList.remove('hidden');
                break;
            case 'exams':
                await loadExamsList();
                document.getElementById('examsList').classList.remove('hidden');
                break;
            case 'marksEntry':
                showModal('marksEntryModal');
                break;
            case 'reportCard':
                showModal('reportCardModal');
                break;
        }
    });
});

// Student Management
document.getElementById('studentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const studentId = document.getElementById('studentId').value;
    const studentData = {
        name: document.getElementById('studentName').value,
        rollNumber: document.getElementById('rollNumber').value,
        class: document.getElementById('studentClass').value,
        section: document.getElementById('studentSection').value,
        parentName: document.getElementById('parentName').value,
        parentPhone: document.getElementById('parentPhone').value,
        email: document.getElementById('studentEmail').value,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        if (studentId) {
            await db.collection('students').doc(studentId).update(studentData);
            showToast('Student updated successfully!', 'success');
        } else {
            await db.collection('students').add(studentData);
            showToast('Student added successfully!', 'success');
        }
        
        hideModal('studentModal');
        document.getElementById('studentForm').reset();
        document.getElementById('studentId').value = '';
        
        // Refresh lists
        if (currentRole === 'admin') {
            await loadRecentStudents();
        }
        await loadStudentsList();
    } catch (error) {
        console.error('Error saving student:', error);
        showError(error.message);
    }
});

async function loadStudentsList() {
    try {
        let query = db.collection('students');
        
        // Apply filters
        const filterClass = document.getElementById('filterClass').value;
        const filterSection = document.getElementById('filterSection').value;
        const searchStudent = document.getElementById('searchStudent').value;
        
        if (filterClass) {
            query = query.where('class', '==', filterClass);
        }
        if (filterSection) {
            query = query.where('section', '==', filterSection);
        }
        
        const snapshot = await query.orderBy('class').orderBy('rollNumber').get();
        const tbody = document.getElementById('studentsTableBody');
        tbody.innerHTML = '';
        
        let filteredStudents = [];
        snapshot.forEach(doc => {
            const student = doc.data();
            if (!searchStudent || 
                student.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
                student.rollNumber.toLowerCase().includes(searchStudent.toLowerCase())) {
                filteredStudents.push({ id: doc.id, ...student });
            }
        });
        
        filteredStudents.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.rollNumber}</td>
                <td>Class ${student.class}</td>
                <td>${student.section}</td>
                <td>${student.parentName}</td>
                <td>${student.parentPhone}</td>
                <td>
                    <div class="actions">
                        <button class="btn btn-secondary btn-sm" onclick="editStudent('${student.id}')">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteStudent('${student.id}')">Delete</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading students:', error);
    }
}

async function editStudent(studentId) {
    try {
        const doc = await db.collection('students').doc(studentId).get();
        if (doc.exists) {
            const student = doc.data();
            
            document.getElementById('studentId').value = studentId;
            document.getElementById('studentName').value = student.name;
            document.getElementById('rollNumber').value = student.rollNumber;
            document.getElementById('studentClass').value = student.class;
            document.getElementById('studentSection').value = student.section;
            document.getElementById('parentName').value = student.parentName;
            document.getElementById('parentPhone').value = student.parentPhone;
            document.getElementById('studentEmail').value = student.email || '';
            
            showModal('studentModal');
        }
    } catch (error) {
        console.error('Error loading student:', error);
        showError(error.message);
    }
}

async function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        try {
            await db.collection('students').doc(studentId).delete();
            showToast('Student deleted successfully!', 'success');
            
            // Refresh lists
            if (currentRole === 'admin') {
                await loadRecentStudents();
            }
            await loadStudentsList();
        } catch (error) {
            console.error('Error deleting student:', error);
            showError(error.message);
        }
    }
}

// Class Management
document.getElementById('classForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const classId = document.getElementById('classId').value;
    const classData = {
        name: document.getElementById('className').value,
        section: document.getElementById('classSection').value,
        classTeacher: document.getElementById('classTeacher').value,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        if (classId) {
            await db.collection('classes').doc(classId).update(classData);
            showToast('Class updated successfully!', 'success');
        } else {
            await db.collection('classes').add(classData);
            showToast('Class added successfully!', 'success');
        }
        
        hideModal('classModal');
        document.getElementById('classForm').reset();
        document.getElementById('classId').value = '';
        
        await loadClassesList();
    } catch (error) {
        console.error('Error saving class:', error);
        showError(error.message);
    }
});

async function loadClassesList() {
    try {
        const snapshot = await db.collection('classes')
            .orderBy('name')
            .orderBy('section')
            .get();
        
        const tbody = document.getElementById('classesTableBody');
        tbody.innerHTML = '';
        
        for (const doc of snapshot.docs) {
            const classData = doc.data();
            
            // Get student count
            const studentsSnapshot = await db.collection('students')
                .where('class', '==', classData.name)
                .where('section', '==', classData.section)
                .get();
            
            // Get subject count
            const subjectsSnapshot = await db.collection('subjects')
                .where('class', '==', classData.name)
                .get();
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>Class ${classData.name}</td>
                <td>${classData.section}</td>
                <td>${studentsSnapshot.size}</td>
                <td>${subjectsSnapshot.size}</td>
                <td>
                    <div class="actions">
                        <button class="btn btn-danger btn-sm" onclick="deleteClass('${doc.id}')">Delete</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        }
    } catch (error) {
        console.error('Error loading classes:', error);
    }
}

async function deleteClass(classId) {
    if (confirm('Are you sure you want to delete this class?')) {
        try {
            await db.collection('classes').doc(classId).delete();
            showToast('Class deleted successfully!', 'success');
            await loadClassesList();
        } catch (error) {
            console.error('Error deleting class:', error);
            showError(error.message);
        }
    }
}

// Subject Management
document.getElementById('subjectForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const subjectId = document.getElementById('subjectId').value;
    const subjectData = {
        name: document.getElementById('subjectName').value,
        class: document.getElementById('subjectClass').value,
        maxMarks: parseInt(document.getElementById('maxMarks').value),
        passingMarks: parseInt(document.getElementById('passingMarks').value),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        if (subjectId) {
            await db.collection('subjects').doc(subjectId).update(subjectData);
            showToast('Subject updated successfully!', 'success');
        } else {
            await db.collection('subjects').add(subjectData);
            showToast('Subject added successfully!', 'success');
        }
        
        hideModal('subjectModal');
        document.getElementById('subjectForm').reset();
        document.getElementById('subjectId').value = '';
        
        await loadSubjectsList();
    } catch (error) {
        console.error('Error saving subject:', error);
        showError(error.message);
    }
});

async function loadSubjectsList() {
    try {
        const snapshot = await db.collection('subjects')
            .orderBy('class')
            .orderBy('name')
            .get();
        
        const tbody = document.getElementById('subjectsTableBody');
        tbody.innerHTML = '';
        
        snapshot.forEach(doc => {
            const subject = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${subject.name}</td>
                <td>Class ${subject.class}</td>
                <td>${subject.maxMarks}</td>
                <td>${subject.passingMarks}</td>
                <td>
                    <div class="actions">
                        <button class="btn btn-danger btn-sm" onclick="deleteSubject('${doc.id}')">Delete</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading subjects:', error);
    }
}

async function deleteSubject(subjectId) {
    if (confirm('Are you sure you want to delete this subject?')) {
        try {
            await db.collection('subjects').doc(subjectId).delete();
            showToast('Subject deleted successfully!', 'success');
            await loadSubjectsList();
        } catch (error) {
            console.error('Error deleting subject:', error);
            showError(error.message);
        }
    }
}

// Exam Management
document.getElementById('examForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const examId = document.getElementById('examId').value;
    const examData = {
        name: document.getElementById('examName').value,
        class: document.getElementById('examClass').value,
        date: document.getElementById('examDate').value,
        status: 'upcoming',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        if (examId) {
            await db.collection('exams').doc(examId).update(examData);
            showToast('Exam updated successfully!', 'success');
        } else {
            await db.collection('exams').add(examData);
            showToast('Exam added successfully!', 'success');
        }
        
        hideModal('examModal');
        document.getElementById('examForm').reset();
        document.getElementById('examId').value = '';
        
        await loadExamsList();
    } catch (error) {
        console.error('Error saving exam:', error);
        showError(error.message);
    }
});

async function loadExamsList() {
    try {
        const snapshot = await db.collection('exams')
            .orderBy('class')
            .orderBy('date', 'desc')
            .get();
        
        const tbody = document.getElementById('examsTableBody');
        tbody.innerHTML = '';
        
        snapshot.forEach(doc => {
            const exam = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${exam.name}</td>
                <td>Class ${exam.class}</td>
                <td>${new Date(exam.date).toLocaleDateString()}</td>
                <td>${exam.status}</td>
                <td>
                    <div class="actions">
                        <button class="btn btn-danger btn-sm" onclick="deleteExam('${doc.id}')">Delete</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading exams:', error);
    }
}

async function deleteExam(examId) {
    if (confirm('Are you sure you want to delete this exam?')) {
        try {
            await db.collection('exams').doc(examId).delete();
            showToast('Exam deleted successfully!', 'success');
            await loadExamsList();
        } catch (error) {
            console.error('Error deleting exam:', error);
            showError(error.message);
        }
    }
}

// Marks Entry
async function loadStudentsForMarks() {
    const classValue = document.getElementById('marksClass').value;
    const studentSelect = document.getElementById('marksStudent');
    
    // Reset student dropdown
    while (studentSelect.options.length > 1) {
        studentSelect.remove(1);
    }
    
    if (classValue) {
        try {
            const snapshot = await db.collection('students')
                .where('class', '==', classValue)
                .orderBy('rollNumber')
                .get();
            
            snapshot.forEach(doc => {
                const student = doc.data();
                const option = document.createElement('option');
                option.value = doc.id;
                option.textContent = `${student.name} (Roll ${student.rollNumber})`;
                studentSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading students:', error);
        }
    }
}

async function loadSubjectsForMarks() {
    const classValue = document.getElementById('marksClass').value;
    const examId = document.getElementById('marksExam').value;
    
    if (classValue) {
        try {
            const snapshot = await db.collection('subjects')
                .where('class', '==', classValue)
                .get();
            
            const container = document.getElementById('marksSubjectContainer');
            container.innerHTML = '';
            
            snapshot.forEach(doc => {
                const subject = doc.data();
                const row = document.createElement('div');
                row.className = 'marks-row';
                row.innerHTML = `
                    <span class="marks-subject-name">${subject.name}</span>
                    <div class="marks-input-group">
                        <label>Max: ${subject.maxMarks}</label>
                        <input type="number" 
                               class="marks-input" 
                               data-subject-id="${doc.id}" 
                               data-subject-name="${subject.name}"
                               data-max-marks="${subject.maxMarks}"
                               data-passing-marks="${subject.passingMarks}"
                               min="0" 
                               max="${subject.maxMarks}"
                               placeholder="0"
                               oninput="calculateMarks()">
                        <span class="marks-percentage">0%</span>
                        <span class="marks-status">-</span>
                    </div>
                `;
                container.appendChild(row);
            });
            
            resetMarksSummary();
        } catch (error) {
            console.error('Error loading subjects:', error);
        }
    }
}

async function loadSubjectsForStudent() {
    const studentId = document.getElementById('marksStudent').value;
    const examId = document.getElementById('marksExam').value;
    
    if (studentId && examId) {
        try {
            // Check if marks already exist
            const marksSnapshot = await db.collection('marks')
                .where('studentId', '==', studentId)
                .where('examId', '==', examId)
                .limit(1)
                .get();
            
            if (!marksSnapshot.empty) {
                const marksDoc = marksSnapshot.docs[0];
                const marksData = marksDoc.data();
                
                // Populate marks fields
                if (marksData.subjects) {
                    marksData.subjects.forEach(subjectMark => {
                        const input = document.querySelector(`[data-subject-id="${subjectMark.subjectId}"]`);
                        if (input) {
                            input.value = subjectMark.obtainedMarks;
                        }
                    });
                    
                    // Set teacher remark
                    document.getElementById('teacherRemark').value = marksData.remark || '';
                    
                    // Calculate totals
                    calculateMarks();
                }
            }
        } catch (error) {
            console.error('Error loading student marks:', error);
        }
    }
}

function calculateMarks() {
    const inputs = document.querySelectorAll('.marks-input');
    let totalObtained = 0;
    let totalMaximum = 0;
    let failedSubjects = 0;
    
    inputs.forEach(input => {
        const maxMarks = parseInt(input.getAttribute('data-max-marks'));
        const passingMarks = parseInt(input.getAttribute('data-passing-marks'));
        const obtainedMarks = parseInt(input.value) || 0;
        
        totalObtained += obtainedMarks;
        totalMaximum += maxMarks;
        
        // Calculate percentage
        const percentage = Math.round((obtainedMarks / maxMarks) * 100);
        const percentageSpan = input.parentElement.querySelector('.marks-percentage');
        const statusSpan = input.parentElement.querySelector('.marks-status');
        
        percentageSpan.textContent = `${percentage}%`;
        
        // Update input style and status
        input.classList.remove('failed', 'passed');
        
        if (obtainedMarks < passingMarks) {
            input.classList.add('failed');
            statusSpan.textContent = '❌';
            failedSubjects++;
        } else {
            input.classList.add('passed');
            statusSpan.textContent = '✅';
        }
    });
    
    // Calculate overall percentage
    const overallPercentage = totalMaximum > 0 ? Math.round((totalObtained / totalMaximum) * 100) : 0;
    
    // Determine grade
    let grade = 'F';
    if (overallPercentage >= 90) grade = 'A+';
    else if (overallPercentage >= 80) grade = 'A';
    else if (overallPercentage >= 70) grade = 'B';
    else if (overallPercentage >= 60) grade = 'C';
    else if (overallPercentage >= 35) grade = 'D';
    
    // Update summary
    document.getElementById('totalObtained').textContent = totalObtained;
    document.getElementById('totalMaximum').textContent = totalMaximum;
    document.getElementById('overallPercentage').textContent = `${overallPercentage}%`;
    document.getElementById('overallGrade').textContent = grade;
    
    // Update pass/fail status
    const passFailStatus = document.getElementById('passFailStatus');
    if (failedSubjects > 0) {
        passFailStatus.textContent = `NOT PROMOTED (${failedSubjects} subject(s) failed)`;
        passFailStatus.style.color = '#dc3545';
    } else {
        passFailStatus.textContent = 'PROMOTED';
        passFailStatus.style.color = '#28a745';
    }
    
    return {
        totalObtained,
        totalMaximum,
        overallPercentage,
        grade,
        failedSubjects,
        isPromoted: failedSubjects === 0
    };
}

function resetMarksSummary() {
    document.getElementById('totalObtained').textContent = '0';
    document.getElementById('totalMaximum').textContent = '0';
    document.getElementById('overallPercentage').textContent = '0%';
    document.getElementById('overallGrade').textContent = '-';
    document.getElementById('passFailStatus').textContent = '-';
    document.getElementById('passFailStatus').style.color = '';
}

async function submitMarks() {
    const studentId = document.getElementById('marksStudent').value;
    const examId = document.getElementById('marksExam').value;
    const remark = document.getElementById('teacherRemark').value;
    
    if (!studentId || !examId) {
        showError('Please select student and exam');
        return;
    }
    
    try {
        const inputs = document.querySelectorAll('.marks-input');
        const subjects = [];
        let hasMarks = false;
        
        inputs.forEach(input => {
            const obtainedMarks = parseInt(input.value) || 0;
            if (obtainedMarks > 0) hasMarks = true;
            
            subjects.push({
                subjectId: input.getAttribute('data-subject-id'),
                subjectName: input.getAttribute('data-subject-name'),
                maxMarks: parseInt(input.getAttribute('data-max-marks')),
                passingMarks: parseInt(input.getAttribute('data-passing-marks')),
                obtainedMarks: obtainedMarks,
                isPassed: obtainedMarks >= parseInt(input.getAttribute('data-passing-marks')),
                percentage: Math.round((obtainedMarks / parseInt(input.getAttribute('data-max-marks'))) * 100)
            });
        });
        
        if (!hasMarks) {
            showError('Please enter at least one mark');
            return;
        }
        
        const calculations = calculateMarks();
        
        // Check if marks already exist
        const existingMarks = await db.collection('marks')
            .where('studentId', '==', studentId)
            .where('examId', '==', examId)
            .limit(1)
            .get();
        
        const marksData = {
            studentId: studentId,
            examId: examId,
            subjects: subjects,
            totalObtained: calculations.totalObtained,
            totalMaximum: calculations.totalMaximum,
            overallPercentage: calculations.overallPercentage,
            overallGrade: calculations.grade,
            failedSubjects: calculations.failedSubjects,
            isPromoted: calculations.isPromoted,
            remark: remark,
            submittedBy: currentUser.uid,
            submittedByName: currentUser.displayName || currentUser.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        if (!existingMarks.empty) {
            await db.collection('marks').doc(existingMarks.docs[0].id).update(marksData);
            showToast('Marks updated successfully!', 'success');
        } else {
            await db.collection('marks').add(marksData);
            showToast('Marks submitted successfully!', 'success');
        }
        
        hideModal('marksEntryModal');
        document.getElementById('marksEntryModal').querySelectorAll('select, input, textarea').forEach(el => {
            if (el.type !== 'number' && el.type !== 'submit') {
                el.value = '';
            }
        });
        resetMarksSummary();
        
        // Refresh marks queue if on teacher dashboard
        if (currentRole === 'teacher') {
            await loadMarksQueue();
        }
    } catch (error) {
        console.error('Error submitting marks:', error);
        showError(error.message);
    }
}

async function openMarksEntryForExam(examId) {
    try {
        const examDoc = await db.collection('exams').doc(examId).get();
        if (examDoc.exists) {
            const exam = examDoc.data();
            
            // Set exam
            document.getElementById('marksExam').value = examId;
            document.getElementById('marksClass').value = exam.class;
            
            // Load students
            await loadStudentsForMarks();
            
            showModal('marksEntryModal');
        }
    } catch (error) {
        console.error('Error opening marks entry:', error);
        showError(error.message);
    }
}

// Report Card
async function loadReportCard() {
    const studentId = document.getElementById('reportStudent').value;
    const examId = document.getElementById('reportExam').value;
    
    if (!studentId || !examId) {
        return;
    }
    
    try {
        // Get marks
        const marksSnapshot = await db.collection('marks')
            .where('studentId', '==', studentId)
            .where('examId', '==', examId)
            .limit(1)
            .get();
        
        if (marksSnapshot.empty) {
            document.getElementById('reportCardContent').innerHTML = '<p class="text-center">No marks found for this student in this exam.</p>';
            return;
        }
        
        const marksData = marksSnapshot.docs[0].data();
        
        // Get student details
        const studentDoc = await db.collection('students').doc(studentId).get();
        const student = studentDoc.data();
        
        // Get exam details
        const examDoc = await db.collection('exams').doc(examId).get();
        const exam = examDoc.data();
        
        // Generate report card HTML
        let reportCardHTML = `
            <div class="report-card-header">
                <h2>🎓 Report Card</h2>
                <h3>School Name</h3>
            </div>
            
            <div class="student-info-grid">
                <div class="info-item">
                    <span class="info-label">Student Name</span>
                    <span class="info-value">${student.name}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Roll Number</span>
                    <span class="info-value">${student.rollNumber}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Class</span>
                    <span class="info-value">Class ${student.class} - ${student.section}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Exam</span>
                    <span class="info-value">${exam.name}</span>
                </div>
            </div>
            
            <table class="marks-table">
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Max Marks</th>
                        <th>Obtained</th>
                        <th>Percentage</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        marksData.subjects.forEach(subject => {
            reportCardHTML += `
                <tr class="${subject.isPassed ? 'pass' : 'fail'}">
                    <td class="subject-name">${subject.subjectName}</td>
                    <td>${subject.maxMarks}</td>
                    <td>${subject.obtainedMarks}</td>
                    <td>${subject.percentage}%</td>
                    <td>${subject.isPassed ? '✅ PASS' : '❌ FAIL'}</td>
                </tr>
            `;
        });
        
        reportCardHTML += `
                </tbody>
            </table>
            
            <div class="report-summary">
                <div class="summary-row">
                    <span class="summary-label">Total Obtained:</span>
                    <span class="summary-value">${marksData.totalObtained} / ${marksData.totalMaximum}</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">Overall Percentage:</span>
                    <span class="summary-value">${marksData.overallPercentage}%</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">Grade:</span>
                    <span class="summary-value grade-${marksData.overallGrade.toLowerCase().replace('+', '-plus')}">${marksData.overallGrade}</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">Failed Subjects:</span>
                    <span class="summary-value">${marksData.failedSubjects}</span>
                </div>
            </div>
            
            <div class="promotion-status ${marksData.isPromoted ? 'promoted' : 'not-promoted'}">
                ${marksData.isPromoted ? '✅ PROMOTED TO NEXT CLASS' : '❌ NOT PROMOTED'}
            </div>
            
            <div class="teacher-remark">
                <h4>Teacher's Remark:</h4>
                <p class="remark-text">${marksData.remark || 'No remark provided.'}</p>
            </div>
            
            <div class="report-card-footer">
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Principal Signature:</strong> _______________________</p>
            </div>
        `;
        
        document.getElementById('reportCardContent').innerHTML = reportCardHTML;
    } catch (error) {
        console.error('Error loading report card:', error);
        showError(error.message);
    }
}

function showReportCard() {
    if (currentStudent) {
        document.getElementById('reportStudent').value = currentStudent.id;
        loadReportCard();
    }
    showModal('reportCardModal');
}

function printReportCard() {
    window.print();
}

// Modal Management
function showModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    document.body.style.overflow = 'auto';
    
    // Reset forms
    const form = document.getElementById(modalId).querySelector('form');
    if (form) {
        form.reset();
    }
}

// Utility Functions
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

function showError(message) {
    showToast(message, 'error');
}

// Close modals on outside click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal(modal.id);
        }
    });
});

// Filter event listeners
document.getElementById('filterClass')?.addEventListener('change', loadStudentsList);
document.getElementById('filterSection')?.addEventListener('change', loadStudentsList);
document.getElementById('searchStudent')?.addEventListener('input', debounce(loadStudentsList, 300));

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}