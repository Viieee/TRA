using API.Models.ViewModels;
using API.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Base
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController<Repository, Entity, Primary> : ControllerBase
        where Entity : class // entity harus berupa class
        where Repository : GeneralRepository<Entity, Primary> // repository harus menurun dari general repository
    {
        Repository repository;
        public BaseController(Repository repository)
        {
            this.repository = repository;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var data = repository.Get();
            return Ok(new { result = 200, data = data });
        }

        [HttpGet("{id}")]
        public IActionResult Get(Primary id)
        {
            if (string.IsNullOrWhiteSpace(id.ToString()))
            {
                return BadRequest();
            }
            var data = repository.Get(id);
            if (data != null)
            {
                return Ok(new { status = 200, data = data });
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPost]
        public IActionResult Create(Entity entity)
        {
            PostReturn<Entity> result = repository.Post(entity);
            if (result.result > 0)
                return Ok(new { status = 200, message = "successfully inserted", data=result.entity }); // returning the detail of item that just created
            return BadRequest();
        }

        [HttpPut("{id}")]
        public IActionResult Edit(Primary id, Entity entity)
        {
            if (ModelState.IsValid)
            {
                if (string.IsNullOrWhiteSpace(id.ToString()))
                {
                    return BadRequest();
                }
                var data = repository.Get(id);
                if (data == null)
                {
                    return NotFound();
                }
                PostReturn<Entity> result = repository.Put(id, entity);
                if (result.result > 0)
                    return Ok(new { status = 200, data = result.entity });
                return BadRequest();
            }
            return BadRequest();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(Primary id)
        {
            if (string.IsNullOrWhiteSpace(id.ToString()))
            {
                return BadRequest();
            }
            var data = repository.Get(id);
            if (data == null)
            {
                return NotFound();
            }
            int result = repository.Delete(id);
            if (result > 0)
                return Ok(new { status = 200, message = "data deleted successfully" });
            return BadRequest();
        }
    }
}
