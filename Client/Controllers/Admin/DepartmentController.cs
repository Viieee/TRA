using Client.Controllers.Base;
using Client.Models;
using Client.Repositories.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Client.Controllers.Admin
{
    [Authorize(Roles = "admin")]
    public class DepartmentController : BaseController<Department, DepartmentRepository>
    {
        public DepartmentController(DepartmentRepository repository) : base(repository)
        {

        }

        public IActionResult Index()
        {
            return View("~/Views/Admin/Department/Index.cshtml");
        }
    }
}
