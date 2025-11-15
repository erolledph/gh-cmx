# Firebase Deployment Guide

This guide explains how to deploy Firestore indexes and security rules using the Firebase CLI.

## Prerequisites

1. **Install Firebase CLI** (if not already installed):
```bash
npm install -g firebase-tools
```

2. **Login to Firebase**:
```bash
firebase login
```

3. **Initialize Firebase project** (if not done):
```bash
firebase init
```

## Files Included

- `firebase.json` - Firebase CLI configuration
- `firestore.rules` - Firestore security rules
- `firestore.indexes.json` - Firestore composite indexes
- `storage.rules` - Firebase Storage security rules

## Deployment Steps

### Option 1: Deploy Everything at Once

Deploy all rules and indexes together:

```bash
firebase deploy
```

This will deploy:
- ✅ Firestore security rules
- ✅ Firestore composite indexes
- ✅ Firebase Storage rules

### Option 2: Deploy Specific Components

**Deploy only Firestore rules:**
```bash
firebase deploy --only firestore:rules
```

**Deploy only Firestore indexes:**
```bash
firebase deploy --only firestore:indexes
```

**Deploy only Storage rules:**
```bash
firebase deploy --only storage
```

## What Each File Does

### firestore.rules
Defines security rules for:
- **Comments**: Public read, anyone can create, admin can update/delete
- **Messages**: Anyone can create, admin can read/update/delete
- **Subscribers**: Anyone can subscribe/unsubscribe, admin can read

### firestore.indexes.json
Creates composite indexes for efficient queries:

1. **Comments by slug and date** - For fetching blog post comments
2. **Comments by parent and date** - For fetching comment replies
3. **Messages by date** - For sorting inbox by newest first
4. **Messages by read status and date** - For filtering unread messages
5. **Subscribers by status and date** - For filtering active subscribers
6. **Subscribers by date** - For sorting newest subscribers

### storage.rules
Defines security rules for:
- **Public image read** - Anyone can view images
- **Admin image upload** - Authenticated users can upload (max 5MB, images only)

## Verification

After deployment, verify rules and indexes:

**Check deployed rules:**
```bash
firebase rules:list
```

**View Firestore indexes:**
1. Go to Firebase Console
2. Go to Firestore Database → Indexes
3. You should see 6 composite indexes listed

**View Storage rules:**
1. Go to Firebase Console
2. Go to Storage → Rules
3. Your storage rules should be published

## Troubleshooting

**"Project not found" error:**
- Run `firebase use --add` to select your project
- Or add `--project <PROJECT_ID>` to commands

**"Permission denied" errors:**
- Ensure you have correct Firebase roles/permissions
- Ask project owner to grant Editor role

**Indexes still being built:**
- Composite indexes can take 5-15 minutes to build
- Check progress in Firebase Console → Indexes

**Rules won't deploy:**
- Check syntax in `firestore.rules` and `storage.rules`
- Run `firebase validate` to check for syntax errors

## Rollback

To revert to previous rules version:

1. Go to Firebase Console
2. Firestore Database → Rules → History
3. Click on previous version and restore

## Testing Rules Locally

Test rules before deploying:

```bash
firebase emulators:start
```

Then use the Emulator Suite to test your rules.

## Additional Resources

- [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Composite Indexes Guide](https://firebase.google.com/docs/firestore/query-data/index-overview)
- [Storage Security Rules](https://firebase.google.com/docs/storage/security/start)
