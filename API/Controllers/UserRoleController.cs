using API.Controllers.Base;
using API.Models;
using API.Repositories.Data;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserRoleController : BaseController<UserRoleRepository, UserRole, int>
    {
        public UserRoleController(UserRoleRepository repository) : base(repository)
        {

        }
    }
}
