using API.Context;
using API.Models;
using API.Models.ViewModels;
using System.Collections.Generic;
using System.Linq;

namespace API.Repositories.Auth
{
    public class AuthRepository
    {
        MyContext context;
        public AuthRepository(MyContext context)
        {
            this.context = context;
        }

        // hashing stuff
        public string GetRandomSalt()
        {
            return BCrypt.Net.BCrypt.GenerateSalt(12);
        }
        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password, GetRandomSalt());
        }
        public bool ValidatePassword(string password, string correctHash)
        {
            return BCrypt.Net.BCrypt.Verify(password, correctHash);
        }

        // auth operations
        // getting an employee based on email
        public Employee GetEmployee(string email)
        {
            var checkEmployee = context.Employees.SingleOrDefault(e => e.Email.Equals(email));
            return checkEmployee;
        }
        // getting the user based on the email
        public User GetUserByEmail(string email)
        {
            var getEmployee = context.Employees.SingleOrDefault(_e => _e.Email.Equals(email));
            if (getEmployee != null)
            {
                var getUser = context.Users.Find(getEmployee.Id);
                return getUser;
            }
            return null;
        }
        // getting the user based on id
        public User Get(int id)
        {
            var checkUsername = context.Users.Find(id);
            return checkUsername;
        }
        // getting the user based on username
        public User Get(string username)
        {
            var checkUsername = context.Users.SingleOrDefault(user => user.Username.Equals(username));
            return checkUsername;
        }
        // getting the roles of a user
        public List<string> GetRolesByUserId(int id)
        {
            List<string> returnValue = new List<string>();
            var user = context.Users.Find(id);
            UserRole[] userRoles = context.UserRoles.Where(x => x.User_Id.Equals(id)).ToArray();
            foreach(UserRole _userRole in userRoles)
            {
                Role role;
                role = context.Roles.Find(_userRole.Role_Id);
                returnValue.Add(role.Name);
            }

            return returnValue;

            /*Role role;*/
            /*if (userRole.Length > 1)
            {
                role = context.Roles.Find(1);
            }
            else
            {
                role = context.Roles.Find(userRole[0].Role_Id);
            }
            return role.Name;*/
        }
        // login operation
        public User Login(Login input)
        {
            var checkEmployee = GetEmployee(input.Email);
            if (checkEmployee != null)
            {
                var checkUser = Get(checkEmployee.Id);
                if (checkUser != null)
                {
                    bool checkPass = ValidatePassword(input.Password, checkUser.Password);
                    if (checkPass != false)
                        return checkUser;
                }
            }
            return null;
        }
        // register operation
        public int Register(Register input)
        {
            context.Employees.Add(
                new Employee
                {
                    FirstName = input.FirstName,
                    LastName = input.LastName,
                    Email = input.Email,
                    PhoneNumber = input.PhoneNumber,
                    HireDate = input.HireDate,
                    Salary = input.Salary,
                    Manager_Id = input.Manager_Id,
                    Department_Id = input.Department_Id
                });
            int resultAddingEmployee = context.SaveChanges();
            if (resultAddingEmployee > 0)
            {
                var currentUser = context.Employees.SingleOrDefault(_e => _e.Email.Equals(input.Email));
                context.Users.Add(
                    new User
                    {
                        Id = currentUser.Id,
                        Username = input.Username,
                        Password = HashPassword(input.Password)
                    }
                );
                int resultAddingUser = context.SaveChanges();
                if (resultAddingUser > 0)
                {
                    context.UserRoles.Add(new UserRole { User_Id = currentUser.Id, Role_Id = 4 });
                    int result = context.SaveChanges();
                    return result;
                }
            }
            return 0;
        }
    }
}
