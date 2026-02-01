# GitHub Integration & Automated Deployment Guide

This guide will help you set up automated deployment for the School Mark System using GitHub Actions. Your application will automatically deploy to Firebase whenever you push code to GitHub.

## 🚀 Benefits of GitHub Integration

- **Automatic Deployment**: Code deploys automatically when you push to main branch
- **Version Control**: Track all changes with Git
- **Collaboration**: Work with multiple developers
- **CI/CD Pipeline**: Automated testing and deployment
- **Rollback Capability**: Easily revert to previous versions
- **Free Hosting**: GitHub Actions is free for public repositories

## 📋 Prerequisites

Before starting, ensure you have:
- [x] GitHub account (free)
- [x] Firebase project already created (from deployment guide)
- [x] Git installed locally
- [x] Firebase CLI installed

## 🛠️ Step-by-Step Setup

### Step 1: Create GitHub Repository (5 minutes)

1. **Log in to GitHub**
   - Visit: https://github.com
   - Sign in or create an account

2. **Create New Repository**
   - Click the **+** icon (top right)
   - Select **New repository**

3. **Repository Settings**
   - Repository name: `school-mark-system`
   - Description: `Complete School Mark Management System`
   - Choose visibility: **Public** (free) or **Private** (pro)
   - **Don't** initialize with README, .gitignore, or license
   - Click **Create repository**

### Step 2: Initialize Local Git Repository (3 minutes)

Open your terminal in the project directory:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: School Mark System"

# Rename main branch (if needed)
git branch -M main
```

### Step 3: Connect Local Repository to GitHub (2 minutes)

Replace `YOUR_USERNAME` with your GitHub username:

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/school-mark-system.git

# Push to GitHub
git push -u origin main
```

You'll be prompted for your GitHub username and password/token.

### Step 4: Generate Firebase Token (3 minutes)

GitHub needs a Firebase token to deploy your application.

```bash
# Login to Firebase (if not already)
firebase login

# Generate CI token
firebase login:ci
```

This will:
1. Open a browser window
2. Ask you to authorize Firebase CI
3. Display a token like: `1//0xxxxxxxxxxxxxxxxxxxxx`

**⚠️ IMPORTANT**: Copy this token and save it securely. You'll need it in the next step.

### Step 5: Get Firebase Service Account (5 minutes)

For full deployment capabilities, you need a service account.

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com
   - Select your project: `school-mark-system`

2. **Go to Project Settings**
   - Click gear icon (top left) → Project Settings

3. **Service Accounts Tab**
   - Click **Service accounts** tab
   - Click **Generate new private key**
   - Click **Generate key**

4. **Save the JSON File**
   - A JSON file will download
   - Keep this file secure
   - You'll need its contents for GitHub secrets

5. **Open the JSON File**
   - Use a text editor to open it
   - Copy the entire contents

The JSON file should look like:
```json
{
  "type": "service_account",
  "project_id": "school-mark-system",
  "private_key_id": "...",
  "private_key": "...",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

### Step 6: Add Secrets to GitHub (5 minutes)

Secrets allow GitHub to securely access Firebase.

1. **Go to Repository Settings**
   - In your GitHub repository
   - Click **Settings** tab
   - Click **Secrets and variables** → **Actions**

2. **Add FIREBASE_TOKEN Secret**
   - Click **New repository secret**
   - Name: `FIREBASE_TOKEN`
   - Value: Paste the token from Step 4
   - Click **Add secret**

3. **Add FIREBASE_SERVICE_ACCOUNT Secret**
   - Click **New repository secret**
   - Name: `FIREBASE_SERVICE_ACCOUNT`
   - Value: Paste the entire JSON content from Step 5
   - Click **Add secret**

4. **Verify Secrets**
   - You should see both secrets listed
   - Never share these secrets publicly

### Step 7: Push GitHub Workflows (2 minutes)

The GitHub Actions workflows are already included in your project. Push them to GitHub:

```bash
# Ensure all files are committed
git add .
git commit -m "Add GitHub Actions workflows for automated deployment"

# Push to GitHub
git push
```

### Step 8: Trigger First Deployment (Automatic)

As soon as you push to GitHub, the deployment will start automatically.

1. **Check Deployment Status**
   - Go to your GitHub repository
   - Click **Actions** tab
   - You'll see workflows running

2. **View Deployment Logs**
   - Click on the running workflow
   - View each step's output
   - Wait for completion (2-5 minutes)

3. **Deployment Complete**
   - If successful, you'll see a green checkmark
   - Your site is now live at: `https://school-mark-system.web.app`

## 🔄 How Automated Deployment Works

### Workflow 1: Firebase Hosting Deploy
**File**: `.github/workflows/firebase-hosting-deploy.yml`

**Triggers**:
- Push to `main` or `master` branch
- Pull requests to `main` or `master`

**What it does**:
1. Checks out your code
2. Sets up Node.js environment
3. Installs dependencies
4. Deploys to Firebase Hosting

**Use for**: Quick frontend-only updates

### Workflow 2: Full Firebase Deployment
**File**: `.github/workflows/firebase-deploy-full.yml`

**Triggers**:
- Push to `main` or `master` branch
- Manual trigger (workflow_dispatch)

**What it does**:
1. Deploys to Firebase Hosting
2. Deploys Cloud Functions

**Use for**: Complete application updates including backend

### Workflow 3: Firestore Rules & Indexes
**File**: `.github/workflows/deploy-firestore.yml`

**Triggers**:
- Changes to `firestore.rules` or `firestore.indexes.json`
- Manual trigger

**What it does**:
1. Deploys Firestore security rules
2. Deploys Firestore indexes

**Use for**: Database security and performance updates

## 📝 Common Deployment Scenarios

### Scenario 1: Update Frontend (HTML/CSS/JS)

```bash
# Make your changes to files in public/ directory
# Commit and push
git add public/
git commit -m "Update dashboard UI"
git push

# Automatic deployment triggered
```

### Scenario 2: Update Cloud Functions

```bash
# Make changes to functions/index.js
# Commit and push
git add functions/
git commit -m "Add new notification function"
git push

# Automatic deployment triggered
```

### Scenario 3: Update Firestore Rules

```bash
# Make changes to firestore.rules
# Commit and push
git add firestore.rules
git commit -m "Update security rules"
git push

# Only Firestore rules will be deployed
```

### Scenario 4: Deploy from Different Branch

```bash
# Create a feature branch
git checkout -b feature/new-feature

# Make changes
git add .
git commit -m "Add new feature"

# Push branch
git push origin feature/new-feature

# Create Pull Request on GitHub
# Merge to main triggers deployment
```

## 🧪 Testing Before Production

### Create Staging Environment

1. **Add Staging Channel**
   - In `firebase.json`, update hosting:
   ```json
   "hosting": {
     "public": "public",
     "ignore": [...],
     "target": "production",
     "channels": {
       "staging": {
         "target": "staging"
       }
     }
   }
   ```

2. **Create Staging Workflow**
   - Duplicate workflow files
   - Change target to `staging`
   - Trigger on `develop` branch

3. **Deploy to Staging**
   ```bash
   git checkout develop
   git push
   # Deploys to staging channel
   ```

4. **Test Staging**
   - Visit: `https://school-mark-system.web.app/?channel=staging`
   - Test all features
   - Merge to main for production

## 🔍 Monitoring Deployments

### View Deployment History

1. **GitHub Actions Tab**
   - See all workflow runs
   - View success/failure status
   - Check deployment logs

2. **Firebase Console**
   - Go to: https://console.firebase.google.com
   - Select your project
   - Check Hosting → Releases
   - Check Functions → Logs

### Troubleshooting Failed Deployments

1. **Check GitHub Actions Logs**
   - Click on failed workflow
   - Find the failing step
   - Read error message

2. **Common Issues & Fixes**

   **Issue**: "Firebase token not found"
   ```bash
   # Solution: Regenerate token
   firebase login:ci
   # Update GitHub secret FIREBASE_TOKEN
   ```

   **Issue**: "Service account invalid"
   ```bash
   # Solution: Regenerate service account
   # Update GitHub secret FIREBASE_SERVICE_ACCOUNT
   ```

   **Issue**: "Build failed"
   ```bash
   # Solution: Check syntax errors in code
   # Test locally: firebase serve
   ```

   **Issue**: "Functions deployment failed"
   ```bash
   # Solution: Check functions logs
   firebase functions:log
   ```

## 🔄 Rollback to Previous Version

If something goes wrong, you can easily rollback:

### Option 1: Git Revert
```bash
# Find previous commit
git log --oneline

# Revert to previous commit
git revert <commit-hash>

# Push rollback
git push
# This triggers deployment with reverted code
```

### Option 2: Firebase Console Rollback
1. Go to Firebase Console
2. Hosting → Releases
3. Find the previous release
4. Click "Rollback"

### Option 3: Redeploy Previous Commit
```bash
# Checkout previous commit
git checkout <commit-hash>

# Force push (use with caution)
git push origin main --force
```

## 📊 Deployment Best Practices

### 1. Branch Strategy
```
main        → Production (auto-deploy)
develop     → Staging (auto-deploy)
feature/*   → Pull requests (no deploy)
```

### 2. Commit Messages
Use clear, descriptive messages:
```bash
git commit -m "feat: Add student export to CSV"
git commit -m "fix: Correct grade calculation bug"
git commit -m "docs: Update deployment guide"
```

### 3. Pull Request Process
1. Create feature branch
2. Make changes
3. Push to GitHub
4. Create Pull Request
5. Review and test
6. Merge to main (triggers deployment)

### 4. Environment Variables
Add project-specific environment variables in workflows:
```yaml
env:
  FIREBASE_PROJECT: school-mark-system
  NODE_ENV: production
```

## 🔒 Security Best Practices

### 1. Never Commit Secrets
```bash
# Add to .gitignore
.env
.env.local
firebase-service-account.json
```

### 2. Rotate Tokens Regularly
```bash
# Regenerate Firebase token every 90 days
firebase login:ci

# Regenerate service account key annually
# In Firebase Console → Service Accounts
```

### 3. Use Branch Protection
- Require pull requests for main branch
- Require approval before merging
- Enable status checks

### 4. Monitor Access
- Review GitHub Actions logs
- Check Firebase Console audit logs
- Set up alerts for suspicious activity

## 📈 Performance Optimization

### 1. Reduce Deployment Time
- Cache dependencies (already configured)
- Use incremental builds
- Only deploy changed services

### 2. Optimize Assets
- Compress images
- Minify CSS/JS
- Use CDN for static assets

### 3. Monitor Build Time
- GitHub Actions provides build time metrics
- Optimize slow workflows
- Use parallel jobs when possible

## 🆘 Getting Help

### Useful Resources
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Firebase CLI Documentation](https://firebase.google.com/docs/cli)
- [Firebase Hosting on GitHub](https://github.com/FirebaseExtended/action-hosting-deploy)

### Common Commands

```bash
# Check GitHub Actions status
gh run list

# View workflow logs
gh run view <run-id>

# Re-run failed workflow
gh run rerun <run-id>

# Cancel running workflow
gh run cancel <run-id>

# Manual deployment (bypass GitHub)
firebase deploy
```

## 🎉 Success Checklist

- [x] GitHub repository created
- [x] Local Git initialized
- [x] Code pushed to GitHub
- [x] Firebase token generated
- [x] Service account created
- [x] GitHub secrets added
- [x] GitHub Actions workflows pushed
- [x] First deployment successful
- [x] Application accessible at hosting URL
- [x] Deployment monitoring set up

## 🚀 Next Steps

Now that you have automated deployment set up:

1. **Enable Branch Protection** (recommended)
2. **Set up Staging Environment** (optional)
3. **Add Automated Tests** (optional)
4. **Configure Deployment Notifications** (optional)
5. **Set up Monitoring & Alerts** (recommended)

## 📞 Support

If you encounter issues:
- Check GitHub Actions logs for errors
- Review Firebase Console for deployment status
- Verify all secrets are correctly set
- Test locally with `firebase serve`

---

**Congratulations!** Your School Mark System now has automated deployment via GitHub. Every time you push code to the main branch, it will automatically deploy to Firebase! 🎉