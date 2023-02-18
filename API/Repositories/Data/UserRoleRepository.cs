using API.Context;
using API.Models;

namespace API.Repositories.Data
{
    public class UserRoleRepository: GeneralRepository<UserRole, int>
    {
        public UserRoleRepository(MyContext context) : base(context)
        {

        }
    }
}
