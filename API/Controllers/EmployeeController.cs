using API.Context;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        MyContext context;
        public EmployeeController(MyContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var data = context.Set<Employee>().ToList();
            return Ok(new { result = 200, data = data });
        }
    }
}
