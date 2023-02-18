using Client.Models;

namespace Client.Repositories.Data
{
    public class EmployeeRepository : GeneralRepository<Employee>
    {
        public EmployeeRepository(string request = "Employee/") : base(request)
        {

        }
    }
}
