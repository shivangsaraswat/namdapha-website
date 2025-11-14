# Community Feature - Launch Checklist

## 📋 Pre-Launch Checklist

### 1. Environment Setup
- [ ] Install dependencies (`npm install next-auth date-fns`)
- [ ] Configure `.env.local` with all required variables
- [ ] Verify Firebase configuration
- [ ] Test Cloudinary image upload

### 2. Google OAuth Configuration
- [ ] Create Google Cloud project
- [ ] Enable Google+ API
- [ ] Create OAuth 2.0 credentials
- [ ] Add redirect URIs (dev + production)
- [ ] Test Google sign-in flow

### 3. Email Authorization
- [ ] Configure authorized domains in `googleSheetAuth.ts`
- [ ] OR set up Google Sheets integration
- [ ] Test with authorized email
- [ ] Test with unauthorized email (should fail)

### 4. Database Setup
- [ ] Verify Firestore collections are created
- [ ] Check Firestore security rules
- [ ] Test read/write permissions
- [ ] Verify indexes are created

### 5. Feature Testing

#### User Registration
- [ ] Sign in with Google
- [ ] Verify email authorization check
- [ ] Confirm user created in Firestore
- [ ] Check username generation (email prefix)
- [ ] Verify profile image from Google

#### Post Creation
- [ ] Create text-only post
- [ ] Create post with 1 image
- [ ] Create post with multiple images (max 4)
- [ ] Test image upload to Cloudinary
- [ ] Verify post appears in feed

#### Post Interactions
- [ ] Like a post
- [ ] Unlike a post
- [ ] Add a comment
- [ ] View comments
- [ ] Check like/comment counters

#### Feed Display
- [ ] View feed without login (public)
- [ ] Attempt interaction without login (should prompt auth)
- [ ] Check post ordering (newest first)
- [ ] Verify user avatars display
- [ ] Test on mobile device

### 6. Admin Panel Testing

#### User Management
- [ ] Access `/admin/community-users` as super-admin
- [ ] View all community users
- [ ] Search for users
- [ ] Suspend a user
- [ ] Activate a suspended user
- [ ] Check user statistics
- [ ] Verify last activity tracking

#### User Status
- [ ] Suspended user cannot post
- [ ] Suspended user cannot comment
- [ ] Suspended user cannot like
- [ ] Deleted user removed from system

### 7. Mobile Responsiveness
- [ ] Test feed on mobile (< 768px)
- [ ] Test post creation on mobile
- [ ] Test auth modal on mobile
- [ ] Test comment section on mobile
- [ ] Test admin panel on mobile

### 8. Performance
- [ ] Check page load time
- [ ] Verify caching works
- [ ] Test with 20+ posts
- [ ] Monitor Firestore read/write counts
- [ ] Check image loading speed

### 9. Security
- [ ] Verify unauthorized users cannot post
- [ ] Check suspended users are blocked
- [ ] Test XSS protection in posts
- [ ] Verify admin-only access to user management
- [ ] Check data validation

### 10. Production Deployment
- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Add production redirect URI to Google OAuth
- [ ] Set production environment variables
- [ ] Test on production domain
- [ ] Monitor error logs

---

## 🚨 Critical Issues to Check

### Before Going Live:
1. **Email Authorization** - Ensure only authorized users can register
2. **Image Upload** - Verify Cloudinary credentials work
3. **Google OAuth** - Test sign-in flow completely
4. **Admin Access** - Confirm super-admin can manage users
5. **Mobile UI** - Test on actual mobile devices

---

## 📊 Monitoring After Launch

### Day 1:
- [ ] Monitor user registrations
- [ ] Check for error logs
- [ ] Verify posts are being created
- [ ] Monitor Firestore usage
- [ ] Check Cloudinary bandwidth

### Week 1:
- [ ] Review user feedback
- [ ] Check performance metrics
- [ ] Monitor database growth
- [ ] Review suspended users
- [ ] Analyze engagement stats

### Month 1:
- [ ] Evaluate feature usage
- [ ] Plan Phase 2 features
- [ ] Review scaling needs
- [ ] Consider Redis upgrade
- [ ] Optimize based on data

---

## 🐛 Common Issues & Solutions

### Issue: "Email not authorized"
**Solution:** Add email domain to `AUTHORIZED_DOMAINS` in `googleSheetAuth.ts`

### Issue: Images not uploading
**Solution:** Check Cloudinary credentials in `.env.local`

### Issue: Posts not appearing
**Solution:** Check Firestore security rules allow reads

### Issue: Cannot sign in
**Solution:** Verify Google OAuth redirect URI matches exactly

### Issue: Admin panel not accessible
**Solution:** Confirm user role is 'super-admin' in database

---

## 📞 Support Contacts

### For Technical Issues:
- Check `COMMUNITY_SETUP.md` for detailed setup
- Review `COMMUNITY_IMPLEMENTATION_SUMMARY.md` for architecture
- Check browser console for errors
- Review Firebase console for database errors

### For Feature Requests:
- Document in GitHub issues
- Prioritize based on user feedback
- Plan for Phase 2 implementation

---

## ✅ Launch Approval

### Sign-off Required:
- [ ] All tests passed
- [ ] No critical bugs
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Mobile tested
- [ ] Admin panel working
- [ ] Documentation complete

### Approved by:
- [ ] Technical Lead: _______________
- [ ] Project Manager: _______________
- [ ] Date: _______________

---

**Ready to Launch? 🚀**

Once all items are checked, you're ready to announce the community feature to your users!
