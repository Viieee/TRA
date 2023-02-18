using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Client.Models
{
    public class UserRole
    {
        [Key]
        public int Id { get; set; }
        public virtual User User { get; set; }
        [ForeignKey("User")]
        public int User_Id { get; set; }
        public virtual Role Role { get; set; }
        [ForeignKey("Role")]
        public int Role_Id { get; set; }
    }
}
