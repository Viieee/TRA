using API.Context;
using API.Models;
using System.Collections.Generic;
using System.Linq;

namespace API.Repositories.Data
{
    public class RequestRepository : GeneralRepository<Request, int>
    {
        MyContext context;
        public RequestRepository(MyContext context) : base(context)
        {
            this.context = context;
        }

        // getting all request based on the employee id
        public List<Request> GetAllByEmployeeId(int id)
        {
            var data = context.Set<Request>().ToList().FindAll((Request req) => {
                if (req.Employee_Id == id)
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

        // getting all requests for finance role
        // displaying all request on 1st review status
        public List<Request> GetAllFinance()
        {
            var data = context.Set<Request>().ToList().FindAll((Request req) => {
                if (req.Status == "1st review")
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

        // getting all requests for manager role
        // displaying all request on 2nd review status and the request has to be made by an employee under the current user
        // that means the employee's manager is the current user
        public List<Request> GetAllManager(int id)
        {
            List<Employee> employees = context.Set<Employee>().ToList().FindAll((Employee employee) => {
                if (employee.Manager_Id == id)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            });

            List<Request> requests = new List<Request>();
            employees.ForEach(e =>
            {
                List<Request> reqs = GetAllByEmployeeId(e.Id);
                reqs.ForEach(r =>
                {
                    if(r.Status == "2nd review")
                    {
                        requests.Add(r);
                    }
                });
            });
            return requests;
        }
    }
}
