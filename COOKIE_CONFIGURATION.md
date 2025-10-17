# 🍪 Cookie Configuration Guide

## 🎯 **Problem Solved**
Fixed cookie issues when testing on IP addresses without HTTPS by making cookie security settings configurable.

## ⚙️ **Configuration Options**

### **For Testing on IP Addresses (HTTP)**
Set this environment variable to disable secure cookies:

```bash
DISABLE_SECURE_COOKIES=true
```

**What this does:**
- Sets `secure: false` - Allows cookies over HTTP
- Sets `sameSite: "lax"` - More permissive for cross-origin testing
- Keeps `httpOnly: true` - Still prevents XSS attacks

### **For Production with HTTPS**
Remove or set to false:

```bash
DISABLE_SECURE_COOKIES=false
# OR simply don't set it at all
```

**What this does:**
- Sets `secure: true` - Requires HTTPS
- Sets `sameSite: "strict"` - Maximum security
- Sets `httpOnly: true` - Prevents XSS attacks

## 🔧 **Implementation Details**

### **Affected Cookies:**
1. `_medusa_jwt` - Authentication token
2. `_medusa_cart_id` - Shopping cart identifier  
3. `_medusa_cache_id` - Cache management

### **Code Changes:**
```typescript
// Before (always secure in production)
secure: process.env.NODE_ENV === "production"

// After (configurable)
const isSecure = process.env.NODE_ENV === "production" && 
                 process.env.DISABLE_SECURE_COOKIES !== "true"
secure: isSecure
```

## 🚀 **Deployment Scenarios**

### **1. Local Development**
```bash
NODE_ENV=development
# Cookies automatically work over HTTP
```

### **2. Testing on IP Address (HTTP)**
```bash
NODE_ENV=production
DISABLE_SECURE_COOKIES=true
# Cookies work over HTTP for testing
```

### **3. Production with Domain (HTTPS)**
```bash
NODE_ENV=production
# DISABLE_SECURE_COOKIES not set or false
# Cookies require HTTPS for security
```

## 🛡️ **Security Considerations**

### **Safe for Testing:**
- `DISABLE_SECURE_COOKIES=true` is safe for testing environments
- Still maintains `httpOnly=true` to prevent XSS
- Only affects transport security, not access control

### **Production Security:**
- Always use `DISABLE_SECURE_COOKIES=false` (or unset) in production
- Ensure HTTPS is properly configured
- Monitor cookie behavior in production logs

## 📋 **Quick Setup for IP Testing**

1. **Add to your environment:**
   ```bash
   echo "DISABLE_SECURE_COOKIES=true" >> .env.local
   ```

2. **Restart your application:**
   ```bash
   npm run dev
   # or your production start command
   ```

3. **Test cookies:**
   - Open browser dev tools
   - Check Application > Cookies
   - Verify cookies are being set

## 🔍 **Troubleshooting**

### **Cookies Still Not Working?**

1. **Check environment variable:**
   ```bash
   echo $DISABLE_SECURE_COOKIES
   # Should output: true
   ```

2. **Verify in browser:**
   - Open Dev Tools > Application > Cookies
   - Look for `_medusa_cart_id`, `_medusa_jwt`, `_medusa_cache_id`

3. **Check server logs:**
   - Look for cookie-related errors
   - Verify environment variables are loaded

### **Common Issues:**

| Issue | Solution |
|-------|----------|
| Cookies not set | Add `DISABLE_SECURE_COOKIES=true` |
| Login not persisting | Check `_medusa_jwt` cookie |
| Cart not saving | Check `_medusa_cart_id` cookie |
| Region redirects | Check `_medusa_cache_id` cookie |

## 🎯 **Testing Checklist**

- [ ] Environment variable set: `DISABLE_SECURE_COOKIES=true`
- [ ] Application restarted
- [ ] Cookies visible in browser dev tools
- [ ] Login persists across page refreshes
- [ ] Cart items remain after navigation
- [ ] No cookie-related errors in console

## 🔄 **Reverting for Production**

When deploying to production with HTTPS:

1. **Remove or update environment variable:**
   ```bash
   # Remove the line or set to false
   DISABLE_SECURE_COOKIES=false
   ```

2. **Verify HTTPS is working:**
   ```bash
   curl -I https://yourdomain.com
   # Should return 200 OK with HTTPS
   ```

3. **Test cookie functionality:**
   - Login should work
   - Cart should persist
   - No security warnings

**Your cookies will now work perfectly for IP testing!** 🎉
