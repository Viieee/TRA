using Client.Controllers.Base;
using Client.Models;
using Client.Repositories.Data;
using Microsoft.AspNetCore.Mvc;

namespace Client.Controllers.Operations
{
    public class ExpenseController : BaseController<Expense, ExpenseRepository>
    {
        public ExpenseRepository repository;
        public ExpenseController(ExpenseRepository repository) : base(repository)
        {
            this.repository = repository;
        }
        public IActionResult Index()
        {
            return View();
        }
        // Expense/GetAllByParentId/id
        public JsonResult GetAllByParentId(int id)
        {
            var result = repository.GetAllByParentId(id);
            return Json(result);
        }

    }
}
