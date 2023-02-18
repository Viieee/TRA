using Client.Models;

namespace Client.Repositories.Data
{
    public class RoleRepository : GeneralRepository<Role>
    {
        public RoleRepository(string request = "Role/") : base(request)
        {

        }
    }
}
