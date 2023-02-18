using Client.Models;

namespace Client.Repositories.Data
{
    public class UserRoleRepository : GeneralRepository<UserRole>
    {
        public UserRoleRepository(string request = "UserRole/") : base(request)
        {

        }
    }
}
