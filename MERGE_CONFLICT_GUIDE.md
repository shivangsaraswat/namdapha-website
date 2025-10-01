# Merge Conflict Resolution Guide

## Quick Resolution Commands

```bash
# Check for conflicts
git status

# Use VS Code to resolve conflicts
git mergetool

# After resolving all conflicts
git add .
git commit -m "Resolve merge conflicts"
```

## Common Conflict Areas in Admin Dashboard

### 1. Package.json Conflicts
- **Issue**: Different dependencies or versions
- **Resolution**: Keep the latest versions, merge unique dependencies
- **File**: `backend/admin-dashboard/package.json`

### 2. Component Conflicts
- **Issue**: Different implementations of same component
- **Resolution**: Choose the more complete implementation or merge features
- **Files**: `backend/admin-dashboard/src/components/*`

### 3. Dashboard Page Conflicts
- **Issue**: Different dashboard layouts or features
- **Resolution**: Merge features, keep consistent styling
- **File**: `backend/admin-dashboard/src/app/dashboard/page.tsx`

### 4. Configuration Conflicts
- **Issue**: Different build or environment configurations
- **Resolution**: Use the most recent stable configuration
- **Files**: 
  - `backend/admin-dashboard/next.config.ts`
  - `backend/admin-dashboard/tsconfig.json`
  - `backend/admin-dashboard/tailwind.config.js`

## Resolution Strategies

### For Dashboard Components
1. **Keep both implementations**: Rename one and integrate both
2. **Merge features**: Combine the best parts of both implementations
3. **Choose latest**: Use the most recent working version

### For Dependencies
1. **Use highest version**: Generally safer for bug fixes
2. **Test compatibility**: Ensure new versions work with existing code
3. **Lock versions**: Use exact versions to prevent future conflicts

## VS Code Conflict Resolution

When VS Code opens a conflicted file, you'll see:
- **Accept Current Change**: Keep your version
- **Accept Incoming Change**: Use their version  
- **Accept Both Changes**: Merge both (be careful with this)
- **Compare Changes**: See detailed diff

## Post-Resolution Testing

After resolving conflicts:
```bash
# Test the admin dashboard
cd backend/admin-dashboard
npm run dev

# Test the frontend
cd ../../frontend
npm run dev

# Run any tests
npm test
```

## Emergency Reset (Last Resort)

If conflicts are too complex:
```bash
# Reset to last working state
git reset --hard HEAD~1

# Or reset to specific commit
git reset --hard <commit-hash>

# Force push (only if you're sure)
git push --force-with-lease origin feature/admin-dashboard
```
