using API.Context;
using API.Models;
using System.Collections.Generic;
using System.Linq;

namespace API.Repositories.Data
{
    public class ExpenseRepository : GeneralRepository<Expense, int>
    {
        MyContext context;
        public ExpenseRepository(MyContext context) : base(context)
        {
            this.context = context;
        }

        // getting all the expenses based on request id
        public List<Expense> GetAllByParent(int id)
        {
            var data = context.Set<Expense>().ToList().FindAll((Expense expense) => {
                if (expense.Request_Id == id)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            });
            return data;
        }
    }
}
