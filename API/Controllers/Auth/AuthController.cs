using API.Models.ViewModels;
using API.Repositories.Auth;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;

namespace API.Controllers.Auth
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        AuthRepository repository;
        private IConfiguration _config; // accessing appsettings.json content

        public AuthController(AuthRepository repository, IConfiguration config)
        {
            this.repository = repository;
            _config = config;
        }

        [HttpPost]
        [Route("Login")]
        public IActionResult Login(Login input)
        {
            if (string.IsNullOrWhiteSpace(input.Email) || string.IsNullOrWhiteSpace(input.Password))
            {
                return BadRequest();
            }
            var check = repository.GetEmployee(input.Email);
            if (check == null)
            {
                return NotFound();
            }
            var result = repository.Login(input); // this will return the full data of the user (if it's registered)
            if (result != null)
            {
                var jwt = new JWTService(_config);
                string FullName = result.Employee.FirstName + " " + result.Employee.LastName;
                List<string> roles = repository.GetRolesByUserId(result.Id);
                var token = jwt.GenerateSecurityToken(result.Id, result.Employee.Email, FullName, roles);
                return Ok(new { status = 200, message = "login successful!", token = token, data = new { Id = result.Id, Email = result.Employee.Email, Name = FullName, Role = roles } });
            }
            return BadRequest();
        }

        [HttpPost]
        [Route("Register")]
        public IActionResult Register(Register input)
        {
            if (string.IsNullOrWhiteSpace(input.Email) ||
                string.IsNullOrWhiteSpace(input.FirstName) ||
                string.IsNullOrWhiteSpace(input.LastName) ||
                string.IsNullOrWhiteSpace(input.PhoneNumber) ||
                string.IsNullOrWhiteSpace(input.Salary.ToString()) ||
                string.IsNullOrWhiteSpace(input.Username) ||
                string.IsNullOrWhiteSpace(input.Password))
            {
                return BadRequest();
            }
            var checkEmail = repository.GetEmployee(input.Email);
            if (checkEmail != null)
            {
                return BadRequest(new { message = "user with the same email already exists!" });
            }
            var check = repository.Get(input.Username);
            if (check != null)
            {
                return BadRequest(new { message = "user with the same username already exists!" });
            }
            int result = repository.Register(input);
            if (result > 0)
                return Ok(new { status = 200, message = "successfully registered!" });
            return BadRequest();
        }
    }
}
