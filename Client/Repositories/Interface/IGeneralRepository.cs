using System.Collections.Generic;
using System.Net;

namespace Client.Repositories.Interface
{
    public interface IGeneralRepository<Entity>
        where Entity : class
    {
        List<Entity> Get();
        Entity Get(int id);
        object Post(Entity entity);
        object Put(int id, Entity entity);
        HttpStatusCode Delete(int id);
    }
}
