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
    public class RequestController : BaseController<RequestRepository, Request, int>
    {
        RequestRepository repository;
        public RequestController(RequestRepository repository) : base(repository)
        {
            this.repository = repository;
        }

        [Route("getAllByEmployee/{id}")]
        [HttpGet]
        public IActionResult GetAllByEmployee(int id)
        {
            var data = repository.GetAllByEmployeeId(id);
            return Ok(new { result = 200, data = data });
        }

        [Route("getAllFinance")]
        [HttpGet]
        public IActionResult GetAllFinance()
        {
            var data = repository.GetAllFinance();
            return Ok(new { result = 200, data = data });
        }

        [Route("getAllManager/{id}")]
        [HttpGet]
        public IActionResult GetAllManager(int id)
        {
            var data = repository.GetAllManager(id);
            return Ok(new { result = 200, data = data });
        }
    }
}
