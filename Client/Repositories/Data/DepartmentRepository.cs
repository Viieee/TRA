using Client.Models;

namespace Client.Repositories.Data
{
    public class DepartmentRepository : GeneralRepository<Department>
    {
        public DepartmentRepository(string request = "Department/") : base(request)
        {

        }
    }
}
