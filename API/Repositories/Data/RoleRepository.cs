using API.Context;
using API.Models;

namespace API.Repositories.Data
{
    public class RoleRepository : GeneralRepository<Role, int>
    {
        public RoleRepository(MyContext context) : base(context)
        {

        }
    }
}
