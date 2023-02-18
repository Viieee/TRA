using API.Context;
using API.Models.ViewModels;
using API.Repositories.Interface;
using System.Collections.Generic;
using System.Linq;

namespace API.Repositories
{
    public class GeneralRepository<Entity, Primary> : IGeneralRepository<Entity, Primary>
        where Entity : class
    {
        MyContext myContext;
        public GeneralRepository(MyContext myContext) {
            this.myContext = myContext;
        }

        // implementasikan semua yang ada di interface
        // get all
        public List<Entity> Get()
        {
            var data = myContext.Set<Entity>().ToList();
            return data;
        }
        // get by id 
        public Entity Get(Primary id)
        {
            var data = myContext.Set<Entity>().Find(id);
            return data;
        }
        // post
        public PostReturn<Entity> Post(Entity entity)
        {
            var test = myContext.Set<Entity>().Add(entity);
            int result = myContext.SaveChanges();
            var res = new PostReturn<Entity> { result = result, entity = test.Entity };
            return res;
        }
        // edit
        public PostReturn<Entity> Put(Primary id, Entity entity)
        {
            var data = myContext.Set<Entity>().Find(id);
            myContext.Entry(data).CurrentValues.SetValues(entity);
            int result = myContext.SaveChanges();
            var dataReturned = myContext.Set<Entity>().Find(id);
            // the object that will be returned to client
            var response = new PostReturn<Entity> { result = result, entity = dataReturned };
            return response;
        }
        // delete
        public int Delete(Primary id)
        {
            var data = Get(id);
            myContext.Set<Entity>().Remove(data);
            int result = myContext.SaveChanges();
            return result;
        }
    }
}
