using API.Context;
using API.Models;

namespace API.Repositories.Data
{
    public class DepartmentRepository : GeneralRepository<Department, int>
    {
        public DepartmentRepository(MyContext context) : base(context)
        {

        }
    }
}
