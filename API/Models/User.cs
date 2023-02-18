using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    public class User
    {
        public virtual Employee Employee { get; set; }
        [Key]
        [ForeignKey("Employee")]
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
