/* 
Backend/src/modules/auth/auth.mapper.ts is typically a mapping layer in an authentication module. Its job is to convert data between different representations used by your application.

```
// User entity from database
{
  id: 1,
  email: "john@example.com",
  passwordHash: "...",
  createdAt: "2025-01-01"
}
```

to 

```
{
  id: 1,
  email: "john@example.com"
}
```
 */
