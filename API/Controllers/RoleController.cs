using API.Controllers.Base;
using API.Models;
using API.Repositories.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RoleController : BaseController<RoleRepository, Role, int>
    {
        public RoleController(RoleRepository roleRepository) : base(roleRepository)
        {

        }
    }
}
