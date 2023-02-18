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
    public class ExpenseController : BaseController<ExpenseRepository, Expense, int>
    {
        ExpenseRepository repository;
        public ExpenseController(ExpenseRepository repository) : base(repository)
        {
            this.repository = repository;
        }

        // getting all the expenses based on request id
        [Route("getAllByParent/{id}")]
        [HttpGet]
        public IActionResult GetAllByParent(int id)
        {
            var data = repository.GetAllByParent(id);
            return Ok(new { result = 200, data = data });
        }
    }
}
