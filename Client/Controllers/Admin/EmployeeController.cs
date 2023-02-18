using Client.Controllers.Base;
using Client.Models;
using Client.Repositories.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Client.Controllers.Admin
{
    [Authorize(Roles = "admin")]
    public class EmployeeController : BaseController<Employee, EmployeeRepository>
    {
        public EmployeeController(EmployeeRepository repository) : base(repository)
        {

        }

        public IActionResult Index()
        {
            return View("~/Views/Admin/Employee/Index.cshtml");
        }
    }
}
