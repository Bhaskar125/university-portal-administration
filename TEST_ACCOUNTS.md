# Test Accounts for Development

With email verification disabled, you can quickly create these test accounts:

## Sample Student Accounts

```
Email: student1@universityportal.edu
Password: password123
Role: Student
Name: Alice Johnson

Email: student2@universityportal.edu  
Password: password123
Role: Student
Name: Bob Smith

Email: student3@universityportal.edu
Password: password123
Role: Student  
Name: Carol Davis

Email: student4@universityportal.edu
Password: password123
Role: Student
Name: David Wilson
```

## Sample Professor Accounts

```
Email: prof1@universityportal.edu
Password: password123
Role: Professor
Name: Dr. Sarah Mitchell

Email: prof2@universityportal.edu
Password: password123
Role: Professor
Name: Dr. Michael Chen
```

## Sample Admin Account

```
Email: testadmin@universityportal.edu
Password: password123
Role: Admin (No department required)
Name: Test Administrator
```

## Quick Registration Process

1. **Register users:**
   - Go to `/auth/register`
   - Use emails above with any password
   - Select appropriate role
   - For students/professors: Select department (CS, EE, ME, etc.)
   - For administrators: No department selection needed
   - Submit (no email verification needed!)

2. **Complete student academic profiles:**
   - Login as admin (`admin@universityportal.edu` in mock mode)
   - Go to Students → Add New Student
   - Use the SAME email as registered student
   - Fill in department: CS, EE, ME, etc.
   - Fill in batch: 2024, 2023, etc.
   - Fill in semester: 1, 2, 3, etc.
   - Submit

3. **Verify in Supabase:**
   - Check `profiles` table for basic info
   - Check `students` table for academic info
   - Check `auth.users` for authentication

## Testing Different Scenarios

- **CS Department Students:** Use CS in student ID and department
- **EE Department Students:** Use EE in student ID and department  
- **Different Batches:** 2024, 2023, 2022, 2021
- **Different Semesters:** 1-8 for undergraduate programs

## Notes

- All students need to be "completed" via admin interface after registration
- Use consistent email patterns for easy tracking
- Password can be same for all test accounts during development
- Remember to enable email verification before production! 