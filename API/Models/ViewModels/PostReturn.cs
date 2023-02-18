namespace API.Models.ViewModels
{
    public class PostReturn<Entity>
         where Entity : class
    {
        public int result;
        public Entity entity;
    }
}
