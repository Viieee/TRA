using API.Controllers.Base;
using API.Models;
using API.Repositories.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DepartmentController : BaseController<DepartmentRepository, Department, int>
    {
        public DepartmentController(DepartmentRepository departmentRepository) : base(departmentRepository)
        {

        }
    }
}
